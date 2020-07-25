import React,{ useState }from 'react'
import Layout from '../components/Layout'
import {gql, useQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

import InputComponent from '../components/InputComponent';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
mutation  nuevoProducto($input: ProductoInput){
   nuevoProducto(input: $input){
     id
     nombre
     existencia
     precio
     creado
   }
 }
`
const OBTENER_PRODUCTOS = gql`
query obtenerProductos {
   obtenerProductos{
     id
     nombre
     precio
     existencia
   }
 }
`
const nuevoproducto = () => {
   const {data}= useQuery(OBTENER_PRODUCTOS);
   const [nuevoProducto] = useMutation(NUEVO_PRODUCTO,{
      update(cache, {data: {nuevoProducto}}){
         const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS});
        
         cache.writeQuery({
            query: OBTENER_PRODUCTOS,
            data: {
               obtenerProductos: [...obtenerProductos,nuevoProducto]
            }
         })
      }
   })
   const router = useRouter()

   // Formulario para los nuevos productos
   const formik = useFormik({
      initialValues: {
         nombre: '',
         existencia: '',
         precio: ''
      },
      validationSchema: Yup.object({
         nombre: Yup.string().required('El nombre no puede ir vacío'),
         existencia: Yup.number().positive("La existencia debe ser positiva").required("La existencia es requerida").integer("La existencia debe ser numeros enteros"),
         precio: Yup.number().required("El precio es requerido").positive( "El precio debe ser positivo")

      }),
      onSubmit: async valores => {
         const {existencia, nombre, precio} = valores;
         try {
            const {data} = await nuevoProducto({
               variables: {
                  input:{
                     nombre,
                     existencia,
                     precio
                  }
               }
            })
            Swal.fire({
               title: 'Producto creado correctamente',
               icon:"success"
            })
            router.push('/productos')
         } catch (error) {
            console.log(error);
         }
      }
   })

   return (
      <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Producto</h1>
          <div className="flex justify-center mt-5">
             <div className="w-full max-2-lg">
                <form 
                  onSubmit={formik.handleSubmit}
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
               >
                     <InputComponent 
                        name="nombre"
                        type="text"
                        formik={formik}
                        tipo="producto"
                     />
                     <InputComponent 
                        name="existencia"
                        type="number"
                        formik={formik}
                        tipo="producto"
                        min="0"
                        
                     />
                     <InputComponent 
                        name="precio"
                        type="number"
                        formik={formik}
                        tipo="producto"
                        min="0"
                        step="0.01" 

                     />
                     <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold cursor-pointer hover:bg-gray-900 rounded transition duration-500" value="Crear Producto"/>
                </form>
             </div>
          </div>
      </Layout>
   )
}

export default nuevoproducto
