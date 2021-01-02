import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from 'next/link'
import { useRouter } from "next/router";
// Formularios
import { useFormik } from "formik";
import * as Yup from 'yup'
import InputComponent from '../components/InputComponent';


const AUTENTICAR_USUARIO = gql`
   mutation autenticarUsuario($input: AutenticarInput){
      autenticarUsuario(input: $input){
      token
      }
   }
`
const OBTENER_USUARIO = gql`
query obtenerUsuario{
   obtenerUsuario{
   id
   nombre
   apellido
   }
}
`

const Login = () => {
   // State para el mensaje
   const [mensajePass, setMensajePass] = useState(null)
   const [mensajeEmail, setMensajeEmail] = useState(null)
   // Mutation para crear nuevos usuarios en apollo
   const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO)
   
   // Query para obtener usuario si lo hay
   const {loading, client,data}  = useQuery(OBTENER_USUARIO);

  
 
   // Routing | Proteger pagina
   const router = useRouter()
   if(!loading && data.obtenerUsuario){
      router.replace('/')
   }

   const formik = useFormik({
      initialValues: {
         email: '',
         password: ''
      },
      validationSchema: Yup.object({
         email: Yup.string().email('El email no es válido').required('El email no puede ir vacío'),
         password: Yup.string().required('El password es obligatorio')
      }),
      onSubmit: async valores => {
         // console.log(valores);
         const {email,password} = valores
         try {
            const {data} = await autenticarUsuario({
               variables: {
                  "input": {
                     email, password
                  }
               }
            })

            // Resetear el caché
            client.clearStore()

            // Guardar el token en localstorage
            const {token} = data.autenticarUsuario;
            localStorage.setItem('token',token)
            router.replace('/')
         } catch (error) {
            if(error.message === 'El password es incorrecto'){
               setMensajePass(error.message.replace('GraphQL error:',''))
            }else {
               setMensajeEmail(error.message.replace('GraphQL error:',''))

            }
            console.log(error.message);
         }
      }
   })

   
   return (
      <>
      <Layout>
         <h1 className="text-center text-2xl text-white font-light">Login</h1>
         <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm bg-white rounded shadow-md px-8 pt-6 pb-8 mb-8">
               <form className="" onSubmit={formik.handleSubmit} >
                  
                  {/* Email Input */}
                  <InputComponent 
                     name="email"
                     type="email"
                     formik={formik}
                     mensaje={mensajeEmail}
                     handleFocus={() => setMensajeEmail(null)}

                  />

                  {/* Password Input */}
                  <InputComponent 
                     name="password"
                     type="password"
                     formik={formik}
                     mensaje={mensajePass}
                     handleFocus={() => setMensajePass(null)}

                  />
                   <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer" value="Iniciar Sesión"/>
               </form>
               <div className="text-sm pt-2 text-right">
                  ¿Nuevo usuario? 
                  <Link href="/nuevacuenta">
                        <a className="font-bold"> Registrarse aquí</a>
                  </Link>
               </div>
            </div>
         </div>
      </Layout>
      </>
   )
}

export default Login
