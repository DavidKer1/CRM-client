import React from "react";
import {gql, useMutation} from "@apollo/client";
import Swal from 'sweetalert2'
import Router from "next/router";


const ELIMINAR_PRODUCTO = gql`
	mutation eliminarProducto($id: ID!) {
		eliminarProducto(id: $id)
	}
`;
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

const Producto = ({producto}) => {
	const {id,nombre, existencia, precio} = producto;
   const [eliminarProducto] =  useMutation(ELIMINAR_PRODUCTO, {
      update(cache){
         // Obtener una copia del objeto de cache
         const {obtenerProductos} = cache.readQuery({query: OBTENER_PRODUCTOS})

         // Reescribir el cache
         cache.writeQuery({
            query: OBTENER_PRODUCTOS,
            data: {
               obtenerProductos: obtenerProductos.filter(productoActual=> productoActual.id !== id)
            }
         })
      }
   })

   const eliminarProductoAlerta = id => {
      Swal.fire({
         title: '¿Deseas eliminar a este producto?',
         text: "Esta acción no se puede eliminar",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Si, Eliminar',
         cancelButtonText: "Cancelar"
       }).then(async (result) => {
         if (result.value) {
            try {
               // Eliminar por ID
               const {data} = await eliminarProducto({
                  variables: {
                     id
                  }
               })
               // console.log(data);
               Swal.fire(
                  'Eliminado',
                  data.eliminarProducto,
                  'success'
               )
            } catch (error) {
               console.log(error);
            }
         }
       })
   }

   const editarProducto = id => {
      Router.push({
         pathname:'/editarproducto/[id]',
         query: {id}
      })
   }
	return (
		<tr>
			<td className="border px-4 py-2">{nombre}</td>
			<td className="border px-4 py-2">{existencia}</td>
			<td className="border px-4 py-2">{precio.toLocaleString('en-US',{
            style: 'currency',
            currency: 'USD'
         })}</td>
			<td className="border px-4 py-2">
				<button
					type="button"
					className="flex justify-center item-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-red-800 uppercase transition duration-500"
					onClick={() => eliminarProductoAlerta(id)}
				>
					Eliminar
					<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
						<path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z"></path>
					</svg>
				</button>
			</td>
			<td className="border px-4 py-2">
				<button
					type="button"
					className="flex justify-center item-center bg-green-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-green-800 uppercase transition duration-500"
					onClick={() => editarProducto(id)}
				>
					Editar
					<svg fill="currentColor" className="w-5 h-5 ml-2" viewBox="0 0 20 20">
						<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
					</svg>
				</button>
			</td>
		</tr>
	);
};

export default Producto;
