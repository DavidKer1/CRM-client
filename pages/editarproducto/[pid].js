import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import InputComponent from "../../components/InputComponent";
import {gql, useQuery, useMutation} from "@apollo/client";

import * as Yup from "yup";

import {Formik} from "formik";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
   query obtenerProducto($id: ID!){
      obtenerProducto(id: $id){
      nombre
      precio
      existencia
      }
   }
`

const ACTUALIZAR_PRODUCTO = gql`
   mutation actualizarProducto($id: ID!, $input: ProductoInput){
      actualizarProducto(id: $id, input:$input){
      id
      nombre
      existencia
      precio
      }
   }
`
const EditarProducto = () => {
   const router = useRouter();
   const {query:{id}} = router

   // Consultar para obtener el cliente
   const {data, loading} = useQuery(OBTENER_PRODUCTO,{
      variables: {
         id
      }
   })

   // Mutation para actualizar Producto
   const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

   if(loading) return null
   if(!data){
      return 'Accion no permitida'
   }
   // Schema de validacion
   const schemaValidacion = () => {
      return Yup.object({
         nombre: Yup.string().required('El nombre no puede ir vacío'),
         existencia: Yup.number().positive("La existencia debe ser positiva").required("La existencia es requerida").integer("La existencia debe ser numeros enteros"),
         precio: Yup.number().required("El precio es requerido").positive( "El precio debe ser positivo")
      })
   }

   // modificar el producto en la base de datos
   const acutalizarInfoProducto = async (valores) => {
      const {nombre, existencia, precio} = valores
      try {
         const {data}= await actualizarProducto({
            variables: {
               id,
               input: {
                  nombre,
                  existencia,
                  precio
               }
            }
         })

         //  SWAL
			Swal.fire(
				"Actualizado",
				"El producto se actualizo correctamente",
				"success"
			);
			//  Redireccionar
			router.push("/productos");
      } catch (error) {
            console.log(error);
      }
   }
   return (
      <Layout>
         <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
         <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
               <Formik
                  enableReinitialize
                  initialValues={data.obtenerProducto}
                  validationSchema={schemaValidacion}
                  onSubmit = {valores => acutalizarInfoProducto(valores)}
               >
                  {
                     (formik = props) => {
                        return (
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
                              <input
                                 type="submit"
                                 className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded transition duration-500"
                                 value="Actualizar Producto"
                              />
                           </form>
                        )
                     }

                  }
               </Formik>
            </div>
         </div>
      </Layout>
   )
}

export default  EditarProducto
