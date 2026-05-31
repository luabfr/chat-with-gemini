"use client"
import { useState,useEffect,useCallback } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "./ProductCard"

interface Producto {
	id: number
	title: string
	price: number
	thumbnail: string
	category: string
	rating: number
	stock: number
	discountPercentage: number
}

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
	const searchParams = useSearchParams()
	const categoriaParam = searchParams.get("categoria") || "todas"
	const buscarParam = searchParams.get("buscar") || ""

	const [productos,setProductos] = useState<Producto[]>([])
	const [cargando,setCargando] = useState(true)
	const [categoriaActiva,setCategoriaActiva] = useState(categoriaParam)

	const cargarProductos = useCallback(async (categoria: string) => {
		setCargando(true)
		const url = categoria === "todas"
			? "https://dummyjson.com/products?limit=30"
			: `https://dummyjson.com/products/category/${categoria}?limit=30`
		const res = await fetch(url)
		const data = await res.json()
		setProductos(data.products)
		setCargando(false)
	},[])

	const buscarProductos = useCallback(async (q: string) => {
		setCargando(true)
		const res = await fetch(`https://dummyjson.com/products/search?q=${q}&limit=30`)
		const data = await res.json()
		setProductos(data.products)
		setCargando(false)
	},[])

	const handleCategoria = (categoria: string) => {
		setCategoriaActiva(categoria)
		cargarProductos(categoria)
	}

	useEffect(() => {
		if (buscarParam) {
			buscarProductos(buscarParam)
		} else {
			cargarProductos(categoriaActiva)
		}
	},[buscarParam,categoriaActiva,cargarProductos,buscarProductos])

	return (
		<div>
			{/* Filtros */}
			<div style={{ display: "flex",gap: 8,flexWrap: "wrap",marginBottom: 24 }}>
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
				<div style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 20
				}}>
					{Array.from({ length: 8 }).map((_,i) => (
						<div key={i} style={{ borderRadius: 12,overflow: "hidden",background: "white",border: "1px solid #e0e0e0" }}>
							<div className="skeleton" style={{ height: 200 }} />
							<div style={{ padding: 16,display: "flex",flexDirection: "column",gap: 8 }}>
								<div className="skeleton" style={{ height: 16,width: "80%" }} />
								<div className="skeleton" style={{ height: 14,width: "50%" }} />
								<div className="skeleton" style={{ height: 20,width: "40%" }} />
								<div className="skeleton" style={{ height: 36,marginTop: 4 }} />
							</div>
						</div>
					))}
				</div>
			) : (
				<div style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: 20
				}}>
					{productos.map((producto,i) => (
						<div
							key={producto.id}
							className={`animate-fade-in delay-${Math.min(i + 1,6)}`}
							style={{ opacity: 0 }}
						>
							<ProductCard producto={producto} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}