import Layout from "../components/Layout";
import Link from "next/link";
import {gql, useQuery} from "@apollo/client";
import Pedido from "../components/Pedido";
import { Router, useRouter } from "next/router";

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
			pedido {
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
const Pedidos = () => {
	const router = useRouter()
	const {loading, data} = useQuery(OBTENER_PEDIDOS)
	if (loading){  return (
		<Layout >Cargando...</Layout>
	)}
	const vistaProtegida = () => {
		router.push("/login");
	};
	return (
		<>
		{data.obtenerPedidosVendedor && !loading ? (
			<Layout>
				<h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
				<Link href="/nuevopedido">
					<a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded hover:bg-gray-800 mb-3 uppercase text-xs transition duration-300 ease-in-out">
						Nuevo Pedido
					</a>
				</Link>

				{
					data.obtenerPedidosVendedor.length === 0 
					?(
						<p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
					)
					:(
						data.obtenerPedidosVendedor.map(pedido => (
							<Pedido key={pedido.id} pedido={pedido}/>
						))
					)

				}
				
			</Layout>
			) : (
				vistaProtegida()
			)}
		</>
	);
};

export default Pedidos;
