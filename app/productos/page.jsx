import ProductGrid from "../components/ProductGrid"
import Link from "next/link"


export default function ProductosPage() {
	return (
		<>
			{/* Navbar */}
			<nav style={{
				borderBottom: "1px solid #e0e0e0",
				padding: "14px 40px",
				display: "flex",
				gap: 24,
				background: "white"
			}}>
				<Link href="/" style={{ textDecoration: "none", color: "#0070f3", fontWeight: 600 }}>
					💬 Chat con Max
				</Link >
				<Link href="/productos" style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}>
					🛍️ Productos
				</Link >
			</nav>
			
			<main style={{ maxWidth: 1200,margin: "0 auto",padding: "40px 20px" }}>
				<h1 style={{ marginBottom: 4 }}>🛍️ Productos</h1>
				<p style={{ color: "#666",marginBottom: 32 }}>
					Explorá nuestro catálogo de productos
				</p>
				<ProductGrid />
			</main>
		</>
	)
}