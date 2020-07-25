import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

   
const inputClassName= "shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
const labelClassName= "block text-gray-700 text-sm font-medium mb-2 capitalize";
const errorClassName= "text-xs mb-4 text-red-700 pl-2 block h-1";

const InputComponent = ({
   name,
   type,
	formik,
	mensaje,
	handleFocus,
	tipo='usuario',
	...rest
}) => {
	

	const variants = {
		visible: { opacity: 1, transition: { duration: .2} },
  		hidden: { opacity: 0 }
	}
	return (
		<>
			<div className="mb-2">
				<label htmlFor={name} className={labelClassName}>
					{name}
				</label>
				<input
					id={name}
					type={type}
					className={inputClassName}
					placeholder={`${name.charAt(0).toUpperCase() + name.slice(1)} del ${tipo}`}
					autoComplete="off"
					value={formik.values[name]}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					onFocus={handleFocus}
					{...rest}
				/>
			</div>
			<div className={errorClassName}>
					<motion.div
						variants={variants}
						animate={mensaje ||formik.touched[name] && formik.errors[name] ? 'visible' : 'hidden'}
					>
						{mensaje || formik.errors[name]}
					</motion.div>
			</div>
        
		</>
	);
};

export default InputComponent;


// {mensaje || formik.touched[name] && formik.errors[name] ? (
// 	<motion.div
// 		initial={{opacity: 0}}
// 		animate={{opacity: 1}}
// 		exit={{opacity: 0}}
// 		transition={{duration: 0.2}}
// 	>
// 		{mensaje || formik.errors[name]}
// 	</motion.div>
// ) : null}