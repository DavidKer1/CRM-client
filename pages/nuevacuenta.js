import React, { useState, useEffect } from 'react'
import Link from "next/link";

// Apollo
import { useMutation,gql } from '@apollo/client';

// Form libraries
import { useFormik } from "formik";
import * as Yup from 'yup'

// Components
import Layout from '../components/Layout'
import InputComponent from '../components/InputComponent';

// Animation library
import { motion } from 'framer-motion';

const NUEVA_CUENTA = gql`
   mutation nuevoUsuario($input: UsuarioInput) {
      nuevoUsuario(input: $input){
         id
         nombre
         apellido
         email
      }
   }
`
const variants = {
   visible: {opacity: 1, scale: [.5,1.05, 0.95 ,1]},
   hidden: {opacity: 0, scale: 0}
}
const NuevaCuenta = () => {
   // State para el error de la cuenta 
   const [mensaje, setMensaje] = useState(null)
   // State para mensaje cuenta registrada
   const [cuentaCreada, setCuentaCreada] = useState(false)
   // Variants para animacion mensaje
   
   // Mutation para crear nuevos usuarios
   const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA)


   // Validacion del formulario
   const formik = useFormik({
      initialValues: {
         nombre: '',
         apellido: '',
         email: '',
         password: '',
      },
      validationSchema: Yup.object({
         nombre: Yup.string().required('El nombre es obligatorio'),
         apellido: Yup.string().required('El apellido es obligatorio'),
         email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
         password: Yup.string().required('El password no puede ir vacio').min(6, 'El password debe ser de minimo 6 caracteres')
      }),
      onSubmit: async valores => {
         // console.log(valores);
         const {nombre, apellido, email, password} = valores
         

         try {
            const {data} = await nuevoUsuario({
               variables: {
                  input: {
                     nombre,
                     apellido,
                     email,
                     password
                  }
               }
            });
            console.log(data);

            // Usuario creado correctamente
            setCuentaCreada(true)
            setTimeout(() => {
               setCuentaCreada(false);
            }, 3000);
            // Redirigir al usuario
         } catch (error) {
            setMensaje(error.message.replace('GraphQL error:',''))
            
         }
      }
   })

  
   
   return (
      <>
      <Layout>
         <div className="flex justify-center" >

            <motion.div
                  className="w-full max-w-sm"
                  initial={{scale:0}}
                  animate={cuentaCreada ? 'visible' : 'hidden'}
                  variants={variants}
                  transition={{duration: .5, ease: "easeInOut"}}
               >
                  <p className="text-center border-gray-600 border-l-8 shadow-md rounded bg-green-200 text-xl font-light px-8 py-3 ">
                     Usuario creado correctamente</p>
            </motion.div>
         </div>
         <h1 className="pt-2 text-center text-2xl text-white font-light">Crear Nueva Cuenta</h1>
         <div className="flex justify-center mt-5">
            <div className="w-full max-w-sm bg-white rounded shadow-md px-8 pt-6 pb-8 mb-8">
               
               <form onSubmit={formik.handleSubmit} className="" >
                  
                  {/* Nombre Input */}
                  <InputComponent 
                     name="nombre"
                     type="text"
                     formik={formik}
                  />
                  {/* Apellido Input */}
                  <InputComponent 
                     name="apellido"
                     type="text"
                     formik={formik}
                  />


                  {/* Email Input */}
                  <InputComponent 
                     name="email"
                     type="email"
                     formik={formik}
                     mensaje={mensaje}
                     handleFocus={() => setMensaje(null) }
                  />

                  {/* Password Input  */}
                  <InputComponent 
                     name="password"
                     type="password"
                     formik={formik}
                  />

                   <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer" value="Crear Cuenta"/>
                   
               </form>
               <div className="text-sm pt-2 text-right">
                  ¿Tiene una cuenta? 
                  <Link href="/login">
                        <a className="font-bold"> Acceder aquí</a>
                  </Link>
               </div>
               
            </div>
         </div>
      </Layout>
      </>
   )
}

export default NuevaCuenta
