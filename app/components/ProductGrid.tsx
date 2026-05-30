"use client"
import { useState,useEffect } from "react"
import ProductCard from "./ProductCard"
import { useSearchParams } from "next/navigation"


const CATEGORIAS = [
	"todas",
	"smartphones",
	"laptops",
	"fragrances",
	"skincare",
	"groceries",
	"home-decoration"
]

export default function ProductGrid() {
	const [productos,setProductos] = useState([])
	const [cargando,setCargando] = useState(true)
	
	const searchParams = useSearchParams()
	const categoriaParam = searchParams.get("categoria") || "todas"
	const buscarParam = searchParams.get("buscar") || ""
	const [categoriaActiva,setCategoriaActiva] = useState(categoriaParam)

	useEffect(() => {
		cargarProductos(categoriaActiva)
	},[])
	

	useEffect(() => {
		if (buscarParam) {
			setBusqueda(buscarParam) // si tenés un estado de búsqueda
			buscarProductos(buscarParam)
		} else {
			cargarProductos(categoriaActiva)
		}
	},[])

	const buscarProductos = async (q: string) => {
		setCargando(true)
		const res = await fetch(`https://dummyjson.com/products/search?q=${q}&limit=30`)
		const data = await res.json()
		setProductos(data.products)
		setCargando(false)
	}


	const cargarProductos = async (categoria) => {
		setCargando(true)
		const url = categoria === "todas"
			? "https://dummyjson.com/products?limit=30"
			: `https://dummyjson.com/products/category/${categoria}?limit=30`

		const res = await fetch(url)
		const data = await res.json()
		setProductos(data.products)
		setCargando(false)
	}

	const handleCategoria = (categoria) => {
		setCategoriaActiva(categoria)
		cargarProductos(categoria)
	}

	return (
		<div>
			{/* Filtros */}
			<div style={{
				display: "flex",
				gap: 8,
				flexWrap: "wrap",
				marginBottom: 24
			}}>
				{CATEGORIAS.map(cat => (
					<button
						key={cat}
						onClick={() => handleCategoria(cat)}
						style={{
							padding: "8px 16px",
							borderRadius: 20,
							border: "1px solid #e0e0e0",
							background: categoriaActiva === cat ? "#0070f3" : "white",
							color: categoriaActiva === cat ? "white" : "#333",
							cursor: "pointer",
							fontSize: 13,
							fontWeight: 500,
							textTransform: "capitalize"
						}}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Grid */}
			{cargando ? (
				<div style={{ textAlign: "center",padding: 80,color: "#999" }}>
					Cargando productos...
				</div>
			) : (
				<div style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 20
				}}>
					{productos.map(producto => (
						<ProductCard key={producto.id} producto={producto} />
					))}
				</div>
			)}
		</div>
	)
}