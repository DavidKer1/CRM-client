import React, { useContext, useState, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

const ProductoResumen = ({producto}) => {

	const {cantidadProducto, actualizarTotal} = useContext(PedidoContext)
	const [cantidad, setCantidad] = useState(0)
	useEffect(() => {
		actualizarCantidad()
		actualizarTotal()
	}, [cantidad])

	const actualizarCantidad = () => {
		if(cantidad < 0) setCantidad(0)
		const nuevoProducto = {...producto, cantidad: cantidad}
		cantidadProducto(nuevoProducto)
	}
	const {nombre, precio} = producto;
	return (
		<div className="md:flex md:justify-between md:items-center mt-5">
			<div className="md:w-2/4 mb-2 md:mb-0">
				<p className="text-sm">{nombre}</p>
				<p>
					{precio.toLocaleString("en-US", {
						style: "currency",
						currency: "USD",
					})}
				</p>
			</div>
			<input
				type="number"
				placeholder="cantidad"
				className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
				onChange={ (e) => setCantidad(Number(e.target.value))}
				value={cantidad}
			/>
		</div>
	);
};

export default ProductoResumen;
