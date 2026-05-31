import { Suspense } from "react"
import ProductGrid from "../components/ProductGrid"
import Link from "next/link"


export default function ProductosPage() {
	return (
		<>

			
			<main style={{ maxWidth: 1200,margin: "0 auto",padding: "40px 20px" }}>
				<h1 style={{ marginBottom: 4 }}>🛍️ Productos</h1>
				<p style={{ color: "#666",marginBottom: 32 }}>
					Explorá nuestro catálogo de productos
				</p>
				<Suspense fallback={<p>Cargando...</p>}>
					<ProductGrid />
				</Suspense>
			</main>
		</>
	)
}