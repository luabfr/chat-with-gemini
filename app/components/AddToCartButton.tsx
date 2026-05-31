"use client"
import { useCart } from "../context/CartContext"
import { useState } from "react"

export default function AddToCartButton({ producto }: { producto: any }) {
	const { agregarAlCarrito } = useCart()
	const [agregado,setAgregado] = useState(false)

	const handleClick = () => {
		agregarAlCarrito(producto)
		setAgregado(true)
		setTimeout(() => setAgregado(false),1500)
	}

	return (
		<button
			onClick={handleClick}
			style={{
				width: "100%",
				padding: "16px",
				background: agregado ? "#2e7d32" : "#0070f3",
				color: "white",
				border: "none",
				borderRadius: 12,
				fontSize: 16,
				fontWeight: 700,
				cursor: "pointer",
				transition: "background 0.3s",
			}}
			className={!agregado ? "animate-pulse-btn" : ""}
		>
			{agregado ? "✓ Agregado al carrito" : "+ Agregar al carrito"}
		</button>
	)
}