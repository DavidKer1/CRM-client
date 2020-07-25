import React, { useState } from 'react'
import {gql, useQuery, useMutation} from "@apollo/client";
import {useRouter} from "next/router";

import Layout from '../components/Layout'
import InputComponent from '../components/InputComponent';

import { useFormik } from 'formik';
import * as Yup from 'yup'

const OBTENER_CLIENTES_USUARIO = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

const NUEVO_CLIENTE = gql`
   mutation nuevoCliente($input: ClienteInput){
      nuevoCliente(input: $input){
         id
         nombre
         apellido
         empresa
         email
         telefono
      }
   }
`

const NuevoCliente = () => {
   const [mensajeEmail, setMensajeEmail] = useState(null)

   // Mutation para crear nuevos clientes
   const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
      update(cache, { data: {nuevoCliente}}) {
         // Obtener el objeto de cache que deseamos actualizar
         const {obtenerClientesVendedor} = cache.readQuery({ query:  OBTENER_CLIENTES_USUARIO})

         // Reescribimos el cache (el cache nunca se debe modificar si no reescribir)
         cache.writeQuery({
            query: OBTENER_CLIENTES_USUARIO,
            data: {
               obtenerClientesVendedor: [...obtenerClientesVendedor,nuevoCliente]
            }
         })
      }
   })

   const formik = useFormik({
      initialValues: {
         nombre: '',
         apellido: '',
         empresa:'',
         email: '',
         telefono: ''
      },
      validationSchema: Yup.object({
         nombre: Yup.string().required('El nombre no puede ir vacío'),
         apellido: Yup.string().required('El apellido no puede ir vacío'),
         empresa: Yup.string().required('La empresa es obligatorio'),
         email: Yup.string().required('El email es obligatorio').email('Email no valido')
      }),
      onSubmit:async valores => {
         const {nombre,apellido,empresa,email,telefono } = valores
         try {
            const {data} = await nuevoCliente({
               variables: {
                  input: {
                     nombre,
                     apellido,
                     empresa,
                     email,
                     telefono
                  }
               }
            })
            router.push('/')

            console.log(data.nuevoCliente);
         } catch (error) {
            setMensajeEmail(error.message.replace('GraphQL error:',''))
            console.log(error);
         }
      }
   })





   const vistaProtegida = () => {
      router.push('/login')
    }
    // Router
	const router = useRouter();
	// Consulta de apollo
	const {data, loading} = useQuery(OBTENER_CLIENTES_USUARIO);

   if (loading){  return (
		<Layout >Cargando...</Layout>
	)}

      
      

   return (
      <>
         {data.obtenerClientesVendedor && !loading ? (
            <Layout>
                  <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
                  <div className="flex justify-center mt-5">
                     <div className="w-full max-w-lg">
                        <form
                           onSubmit={formik.handleSubmit}
                           className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        >
                           <InputComponent 
                              name="nombre"
                              type="text"
                              formik={formik}
                              tipo="cliente"
                              
                           />
                           <InputComponent 
                              name="apellido"
                              type="text"
                              formik={formik}
                              tipo="cliente"
                           />
                           <InputComponent 
                              name="empresa"
                              type="text"
                              formik={formik}
                              tipo="cliente"
                           />
                           <InputComponent 
                              name="email"
                              type="email"
                              formik={formik}
                              tipo="cliente"
                              mensaje={mensajeEmail}
                              handleFocus={() => setMensajeEmail(null)}
                           />
                           <InputComponent 
                              name="telefono"
                              type="tel"
                              formik={formik}
                              tipo="cliente"
                           />
                           <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded transition duration-500" value="Registrar cliente"/>
                        </form>
                     </div>
                  </div>
            </Layout>
          ) : (
            vistaProtegida()
         )}

      </>
   )
}

export default NuevoCliente
