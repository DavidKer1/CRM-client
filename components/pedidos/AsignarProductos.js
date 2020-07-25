import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
const OBTENER_PRODUCTOS = gql`
	query obtenerProductos {
		obtenerProductos {
			id
			nombre
			precio
			existencia
		}
	}
`;
const AsignarProductos = () => {
   // State local
   const [productos, setProductos] = useState([])

   const {agregarProductos} = useContext(PedidoContext)

   // Consultar a la base de datos
   const {data, loading} = useQuery(OBTENER_PRODUCTOS)

   useEffect(() => {
      // TODO: funcion para pasar a PedidoState
      agregarProductos(productos)
   }, [productos])

   const seleccionarProducto = (producto) => {
		if(producto===null){
			setProductos([])
		}else{
			setProductos(producto)
		}
   }
   if(loading) return null
   const {obtenerProductos} = data

	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
				2.- Selecciona o busca los productos
			</p>
			<Select
				className="mt-3"
            options={obtenerProductos}
				isMulti
				onChange={(producto) => seleccionarProducto(producto)}
				getOptionValue={(opciones) => opciones.id}
				getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.existencia} disponibles`}
				placeholder="Busque o seleccione el producto"
				noOptionsMessage={() => "No se encontraron resultados"}
			/>
		</>
	);
};

export default AsignarProductos;
