import Layout from "../components/Layout";
import {gql, useQuery} from "@apollo/client";
import {useRouter} from "next/router";
import Link from "next/link";
import Cliente from "../components/Cliente";
import SimpleBar from "simplebar-react";
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
const Index = () => {
	// Router
	const router = useRouter();
	// Consulta de apollo
	const {data, loading} = useQuery(OBTENER_CLIENTES_USUARIO, {});

	if (loading){  return (
		<Layout >Cargando...</Layout>
	)}
	// if (loading)
	// 	return (
	// 		<div
	// 			style={{
	// 				display: "flex",
	// 				justifyContent: "center",
	// 				height: "95vh",
	// 				alignItems: "center",
	// 			}}
	// 		>
	// 			<h1
	// 				style={{
	// 					color: "#b8b8b8",
	// 					opacity: 1,
	// 				}}
	// 			>
	// 				Cargando...
	// 			</h1>
	// 		</div>
	// 	);

	const vistaProtegida = () => {
		router.push("/login");
	};

	return (
		<>
			{data.obtenerClientesVendedor && !loading ? (
				<Layout>
					<h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
					<Link href="/nuevocliente">
						<a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded hover:bg-gray-800 mb-3 uppercase text-xs transition duration-300 ease-in-out">
							Nuevo Cliente
						</a>
					</Link>
					<div 
						className="overflow-x-scroll" 
					
					>

						<table className="table-auto shadow-md mt-10 w-full w-lg">
							<thead className="bg-gray-800">
								<tr className="text-white">
									<th className="w-1/5 py-2">Nombre</th>
									<th className="w-1/5 py-2">Empresa</th>
									<th className="w-1/5 py-2">Email</th>
									<th className="w-1/5 py-2">Eliminar</th>
									<th className="w-1/5 py-2">Editar</th>

								</tr>
							</thead>
							<tbody className="bg-gray-100">
								{data.obtenerClientesVendedor.map((cliente) => (
									<Cliente key={cliente.id} cliente={cliente} />
									))}
							</tbody>
						</table>
					</div>

				</Layout>
			) : (
				vistaProtegida()
			)}
		</>
	);
};

export default Index;

