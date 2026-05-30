"use client"
import { useCart } from "../context/CartContext"

export default function AddToCartButton({ producto }: { producto: any }) {
	const { agregarAlCarrito } = useCart()

	return (
		<button
			onClick={() => agregarAlCarrito(producto)}
			style={{
				width: "100%",
				padding: "16px",
				background: "#0070f3",
				color: "white",
				border: "none",
				borderRadius: 12,
				fontSize: 16,
				fontWeight: 700,
				cursor: "pointer",
			}}
		>
			+ Agregar al carrito
		</button>
	)
}