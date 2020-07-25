import React, { useEffect } from 'react'
import { useQuery,gql } from "@apollo/client";
import { useRouter } from "next/router";
const OBTENER_USUARIO = gql`
   query obtenerUsuario{
      obtenerUsuario{
      id
      nombre
      apellido
      }
   }
`;

const Header = () => {
   const router = useRouter()
   // Query de apollo
   const {data, loading, client} = useQuery(OBTENER_USUARIO)

   // Proteger que no accedamos antes de obtener resultados
   if(loading) return null

   if(!loading && !data.obtenerUsuario){
      router.replace('/login')
   }


   const cerrarSesion = () => {
      localStorage.removeItem('token')
      // Borrar el caché
      client.clearStore()
      // Redirigir
      router.replace('/login')
   }

   const vistaProtegida = () => {
		router.push("/login");
   };
   // const {nombre, apellido} = data.obtenerUsuario
   return (
      <>
      {data.obtenerUsuario && !loading ? (
         <div className="flex justify-between mb-6" >

            <p className="mr-2">
               Hola, {data.obtenerUsuario.nombre} {data.obtenerUsuario.apellido}
            </p>
            <button onClick={() => cerrarSesion()} type="button" className="bg-blue-800 w-1/3 sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md">Cerrar Sesión</button>
         </div>
      ) : vistaProtegida() }
      </>
   )
   
}

export default Header
