import React, { useContext, useState } from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import PedidoContext from "../context/pedidos/PedidoContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NUEVO_PEDIDO = gql`
	mutation nuevoPedido($input: PedidoInput) {
	nuevoPedido(input: $input){
		id
	}
}
`

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
			pedido {
				id
				cantidad
				nombre
			}
			total
			estado
			cliente {
				id
				telefono
				nombre
				apellido
				email
			}
		}
	}
`;
// FramerMotion variants
const variants = {
	hidden: { opacity: 0, scale:0, height: 0},
	visible: { opacity: 1 , scale: 1, height: 50},
}
const nuevopedido = () => {
	const router = useRouter() 	
	const {cliente, productos, total} = useContext(PedidoContext)
	const [mensaje, setMensaje] = useState(null)
	const {loading} = useQuery(OBTENER_PEDIDOS)
	// Mutation para crear un nuevo pedido
	const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
		update(cache, {data: {nuevoPedido}}){
			const {obtenerPedidosVendedor} = cache.readQuery({query: OBTENER_PEDIDOS})
			cache.writeQuery({
				query: OBTENER_PEDIDOS,
				data: {
					obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
				}
			})
		}
	})

	const validarPedido = () => {
		return !productos.every(producto => producto.cantidad > 0 ) || total=== 0 || cliente.length === 0? " opacity-50 cursor-not-allowed " : "" 
	}
	const desactivarBoton = () => {
		return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? true : false
	}

	const crearNuevoPedido = async () => {
		// Remover lo no deseado de productos
		const pedido = productos.map(({__typename,existencia, ...producto}) => producto )
		const {id} = cliente;
		try {
			const {data} = await nuevoPedido({
				variables: {
					input: {
						cliente: id,
						total,
						pedido
					}
				}
			});

			// Redireccionar
			router.push('/pedidos')
			// Mostrar alerta
			Swal.fire(
				'Correcto',
				'El pedido se registro correctamente',
				'success'
			)
		} catch (error) {
			setMensaje(error.message.replace('GraphQL error: ' , ''));
			console.log(error);
			setTimeout(() => {
				setMensaje(null)
			}, 3000);
		}
	}


	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<motion.div 
						className="bg-red-500 text-white w-full text-center mb-3"
						initial='hidden'
						animate={mensaje ? 'visible' : 'hidden'}
						variants={variants}
						transition={{  duration: .5, ease: 'easeInOut' }}
					>
						<p className="text-white text-center pt-3 ">
						{mensaje}
						</p>
					</motion.div>
					<motion.div
						
					>
					

						<AsignarCliente />
						<AsignarProductos />
						<ResumenPedido />
						<Total />
						<button
							type="button"
							className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
							onClick={() => crearNuevoPedido() }
							disabled={desactivarBoton()}
							>Registrar Pedido</button>
					</motion.div>
				</div>
			</div>
		</Layout>
	);
};

export default nuevopedido;
