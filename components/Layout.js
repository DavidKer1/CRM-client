import React from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import Header from "./Header";



const Layout = ({children}) => {
	const router = useRouter()

   

 
	return (
		<>
			<Head>
				<title>CRM - Administración de clientes</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
					integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
					crossorigin="anonymous"
				/>
				<link
					href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
					rel="stylesheet"
				/>
				 <link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css"
				/>
			</Head>
			{
				router.pathname === '/login' || router.pathname === '/nuevacuenta' 
				? (
					<div className="bg-gray-800 min-h-screen flex flex-col justify-center">
						<div>
							{children}
						</div>
					</div>
				)
				:(<div className="bg-blue-100 min-h-screen">
							<div className="flex flex-col sm:flex-row min-h-screen">
								<Sidebar />
								<main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
									<Header />
									{children}

								</main>
						</div>
				</div>)
         }
			
		</>
	);
};

export default Layout;
