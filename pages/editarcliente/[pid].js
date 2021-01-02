import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import InputComponent from "../../components/InputComponent";
import {gql, useQuery, useMutation} from "@apollo/client";

import * as Yup from "yup";
import CargandoComponent from "../../components/CargandoComponent";

import {Formik} from "formik";
import Swal from "sweetalert2";

const OBTENER_CLIENTE = gql`
	query obtenerCliente($id: ID!) {
		obtenerCliente(id: $id) {
			nombre
			email
			apellido
			telefono
			empresa
		}
	}
`;
const ACTUALIZAR_CLIENTE = gql`
	mutation actualizarCliente($id: ID!, $input: ClienteInput) {
		actualizarCliente(id: $id, input: $input) {
			nombre
			email
		}
	}
`;
const EditarCliente = () => {
	const router = useRouter();
	const {
		query: {id},
	} = router;

	// Consultar para obtener el cliente
	const {data, loading} = useQuery(OBTENER_CLIENTE, {
		variables: {
			id,
		},
	});
	const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

	if (loading) return null;
	if (loading) return <CargandoComponent />;

	//Schema de validacion
	const schemaValidacion = () => {
		return Yup.object({
			nombre: Yup.string().required("El nombre no puede ir vacío"),
			apellido: Yup.string().required("El apellido no puede ir vacío"),
			empresa: Yup.string().required("La empresa es obligatorio"),
			email: Yup.string()
				.required("El email es obligatorio")
				.email("Email no valido"),
		});
	};

	// modifica el cliente en la base de datos
	const actualizarInfoCliente = async (valores) => {
		const {nombre, apellido, empresa, email, telefono} = valores;
		try {
			const {data} = await actualizarCliente({
				variables: {
					id,
					input: {
						nombre,
						apellido,
						empresa,
						email,
						telefono,
					},
				},
			});
			//  SWAL
			Swal.fire(
				"Actualizado",
				"El cliente se actualizo correctamente",
				"success"
			);
			//  Redireccionar
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};
	const vistaProtegida = () => {
		router.push("/login");
   };
		return (
         <>
         { data && !loading ? (
            <Layout>
               <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
               <div className="flex justify-center mt-5">
                  <div className="w-full max-w-lg">
                     <Formik
                        enableReinitialize
                        initialValues={data.obtenerCliente}
                        validationSchema={schemaValidacion}
                        onSubmit={(valores) => actualizarInfoCliente(valores)}
                     >
                        {(formik = props) => {
                           return (
                              <form
                                 onSubmit={formik.handleSubmit}
                                 className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                              >
                                 <InputComponent
                                    name="nombre"
                                    type="text"
                                    formik={formik}
                                    tipo="cliente"
                                 />
                                 <InputComponent
                                    name="apellido"
                                    type="text"
                                    formik={formik}
                                    tipo="cliente"
                                 />
                                 <InputComponent
                                    name="empresa"
                                    type="text"
                                    formik={formik}
                                    tipo="cliente"
                                 />
                                 <InputComponent
                                    name="email"
                                    type="email"
                                    formik={formik}
                                    tipo="cliente"
                                 />
                                 <InputComponent
                                    name="telefono"
                                    type="tel"
                                    formik={formik}
                                    tipo="cliente"
                                 />
                                 <input
                                    type="submit"
                                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded transition duration-500"
                                    value="Actualizar cliente"
                                 />
                              </form>
                           );
                        }}
                     </Formik>
                  </div>
               </div>
            </Layout>
         ) : (
            vistaProtegida()
         )}
         </>
		);
	
};

export default EditarCliente;
