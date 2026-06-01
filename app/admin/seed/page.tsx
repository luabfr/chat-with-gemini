"use client"
import { seedProductos } from "../../lib/seed"
import { useState } from "react"

export default function SeedPage() {
	const [estado,setEstado] = useState("")

	const ejecutar = async () => {
		setEstado("Insertando productos...")
		await seedProductos()
		setEstado("✅ Listo")
	}

	return (
		<main style={{ padding: 40 }}>
			<h1>Seed de productos</h1>
			<button onClick={ejecutar} style={{
				padding: "12px 24px",
				background: "#0070f3",
				color: "white",
				border: "none",
				borderRadius: 8,
				cursor: "pointer",
				fontSize: 16
			}}>
				Insertar productos de DummyJSON
			</button>
			{estado && <p style={{ marginTop: 16 }}>{estado}</p>}
		</main>
	)
}