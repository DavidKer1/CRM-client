import React, { useEffect } from "react";
import Layout from "../components/Layout";
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
   Legend,
   ResponsiveContainer
} from "recharts";
import {gql, useQuery} from "@apollo/client";
import { useRouter } from "next/router";

const MEJORES_CLIENTES = gql`
query mejoresClientes{
   mejoresClientes{
     total
     cliente{
       nombre
       empresa
     }
   }
 }
`;
const mejoresclientes = () => {
   const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES)
   const router = useRouter()
   useEffect(() => {
      startPolling(1000)
      return () => {
         stopPolling()
      }
   }, [startPolling, stopPolling])
   if(loading) return <Layout>Cargando...</Layout>
   

   const {mejoresClientes} = data

   const clienteGrafica = []
   mejoresClientes.map( (cliente, index) => {
      clienteGrafica[index] = {
         ...cliente.cliente[0],
         total: cliente.total
      }
   })
   const vistaProtegida = () => {
		router.push("/login");
	};
   return (
      <>
      {mejoresClientes && !loading ? (
         <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Vendedores</h1>
            <ResponsiveContainer width={'99%'} height={550}> 
            <BarChart
               className="mt-10"
               width={600}
               height={500}
               data={clienteGrafica}
               margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
               }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="nombre" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Bar dataKey="total" fill="#103d69" />
            </BarChart>
            </ResponsiveContainer>
         </Layout>
         ) : (
            vistaProtegida()
         )}
      </>
   )
}

export default mejoresclientes
