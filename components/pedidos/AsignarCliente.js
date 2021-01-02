import React, { useEffect, useState, useContext } from 'react'
import Select from "react-select/";
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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
const AsignarCliente = () => {
   const [cliente, setCliente] = useState([]);
   const {agregarCliente} = useContext(PedidoContext)
   const seleccionarCliente = (cliente) => {
      setCliente(cliente)
   };
	useEffect(() => {
      agregarCliente(cliente)
	}, [cliente]);
   
   // Consultar la base de datos
   const {data, loading} = useQuery(OBTENER_CLIENTES_USUARIO)
   // Resultados de la consulta
   if( loading ) return null
   const {obtenerClientesVendedor} = data
   return ( 
      <>
         <p className="my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
         <Select
            className="mt-3"
            options={obtenerClientesVendedor}
            onChange={(cliente) => seleccionarCliente(cliente)}
            getOptionValue={ opciones => opciones.id}
            getOptionLabel={ opciones => opciones.nombre}
            placeholder="Busque o seleccione el cliente"
            noOptionsMessage={() => "No se encontraron resultados"}
         />
      </>
   )
}

export default AsignarCliente
