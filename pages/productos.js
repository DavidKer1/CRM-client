import Layout from '../components/Layout'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Producto from '../components/Producto'

const OBTENER_PRODUCTOS = gql`
query obtenerProductos {
  obtenerProductos{
    id
    nombre
    precio
    existencia
  }
}
`
const Productos = () => {
  const {data, loading} = useQuery(OBTENER_PRODUCTOS,{})
  if (loading){  return (
		<Layout >Cargando...</Layout>
	)}
  return (
    <>
      <Layout>
         <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
         <Link href="/nuevoproducto">
         <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded hover:bg-gray-800 mb-3 uppercase text-xs transition duration-300 ease-in-out">
            Nuevo Producto
						</a>
         </Link>
         <div className="overflow-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="py-2 w-1/5">Nombre</th>
                <th className="py-2 w-1/5">Existencia</th>
                <th className="py-2 w-1/5">Precio</th>
                <th className="py-2 w-1/5">Eliminar</th>
                <th className="py-2 w-1/5">Editar</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {data.obtenerProductos.map((producto)=>(
                <Producto key={producto.id} producto={producto}/>
              ))}
            </tbody>
          </table>
          </div>
      </Layout>
    </>
  )
}

export default Productos
