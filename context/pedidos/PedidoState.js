import React, {useReducer, Children} from 'react'
import PedidoContext from './PedidoContext'
import PedidoReducer from './PedidoReducer';
import { 
   SELECCIONAR_CLIENTE,
   SELECCIONAR_PRODUCTO,
   CANTIDAD_PRODUCTO,
   ACTUALIZAR_TOTAL
} from "../../types";


const PedidoState = ( {children}) => {
   // State de pedidos
   const initialState = {
      cliente: {},
      productos: [],
      total: 0
   }

   const [state, dispatch] = useReducer(PedidoReducer, initialState)
   
   // Modifica el cliente
   const agregarCliente = cliente => {
      // console.log(cliente);
      dispatch({
         type: SELECCIONAR_CLIENTE,
         payload: cliente 
      })
   }

   // Agregar productos
   const agregarProductos = productosSeleccionados => {
      let nuevoState;
      if(state.productos.length > 0){
         // Tomar del segundo arreglo para asignarlo al prinero
         nuevoState = productosSeleccionados.map(producto => {
            const nuevoObjeto = state.productos.find(productoState => productoState.id === producto.id)
            return {...producto, ...nuevoObjeto}
         })
      }else {
         nuevoState = productosSeleccionados
      }
      dispatch({
         type: SELECCIONAR_PRODUCTO,
         payload: nuevoState
      })
   }

   // Modifica las cantidades de los productos
   const cantidadProducto = nuevoProducto => {
      dispatch({
         type: CANTIDAD_PRODUCTO,
         payload: nuevoProducto
      })
   }

   const actualizarTotal = () => {
      dispatch({
         type: ACTUALIZAR_TOTAL
      })
   }
   return (
      <PedidoContext.Provider
         value={{
            cliente: state.cliente,
            productos: state.productos,
            total: state.total,
            agregarProductos,
            agregarCliente,
            cantidadProducto,
            actualizarTotal
         }}
      >
         {children}
      </PedidoContext.Provider>
   )
}

export default PedidoState;