"use client"
import { useEffect,useState } from "react"
import Link from "next/link"
import NextImage from "next/image"
import { createClient } from "../../lib/supabase/client"
import { useFavoritos } from "../../context/FavoritosContext"
import { useCart } from "../../context/CartContext"
import { Product } from "../../lib/types"

export default function FavoritosPage() {
	const { favoritos,toggleFavorito } = useFavoritos()
	const { agregarAlCarrito } = useCart()
	const [productos,setProductos] = useState<Product[]>([])
	const [cargando,setCargando] = useState(true)
	const supabase = createClient()

	useEffect(() => {
		const cargarProductosFavoritos = async () => {
			if (favoritos.length === 0) {
				setProductos([])
				setCargando(false)
				return
			}

			const { data,error } = await supabase
				.from("productos")
				.select("*")
				.in("id",favoritos)
				.eq("active",true)

			if (!error && data) setProductos(data)
			setCargando(false)
		}

		cargarProductosFavoritos()
	},[favoritos])

	if (cargando) {
		return (
			<div style={{ padding: 32 }}>
				<h2 style={{ fontSize: 22,fontWeight: 700,marginBottom: 24 }}>Mis favoritos</h2>
				<div style={{ display: "grid",gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",gap: 20 }}>
					{[1,2,3].map(i => (
						<div key={i} style={{
							height: 300,
							background: "#f5f5f5",
							borderRadius: 12,
							animation: "pulse 1.5s ease-in-out infinite"
						}} />
					))}
				</div>
			</div>
		)
	}

	if (favoritos.length === 0) {
		return (
			<div style={{ padding: 32,textAlign: "center" }}>
				<div style={{ fontSize: 64,marginBottom: 16 }}>🤍</div>
				<h2 style={{ fontSize: 22,fontWeight: 700,marginBottom: 8 }}>Todavía no tenés favoritos</h2>
				<p style={{ color: "#666",marginBottom: 24 }}>
					Explorá el catálogo y guardá los productos que más te gusten.
				</p>
				<Link
					href="/productos"
					style={{
						display: "inline-block",
						padding: "12px 28px",
						background: "#0070f3",
						color: "white",
						borderRadius: 8,
						textDecoration: "none",
						fontWeight: 600,
						fontSize: 15
					}}
				>
					Ver catálogo
				</Link>
			</div>
		)
	}

	return (
		<div style={{ padding: 32 }}>
			<div style={{ display: "flex",alignItems: "center",justifyContent: "space-between",marginBottom: 24 }}>
				<h2 style={{ fontSize: 22,fontWeight: 700,margin: 0 }}>
					Mis favoritos
					<span style={{
						marginLeft: 10,
						fontSize: 14,
						fontWeight: 500,
						color: "#666",
						background: "#f0f0f0",
						padding: "2px 10px",
						borderRadius: 20
					}}>
						{favoritos.length}
					</span>
				</h2>
			</div>

			<div style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
				gap: 20
			}}>
				{productos.map(producto => (
					<div
						key={producto.id}
						style={{
							border: "1px solid #e0e0e0",
							borderRadius: 12,
							overflow: "hidden",
							background: "white",
							position: "relative",
							transition: "box-shadow 0.2s"
						}}
						onMouseEnter={e => {
							e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
						}}
						onMouseLeave={e => {
							e.currentTarget.style.boxShadow = "none"
						}}
					>
						{/* Botón quitar favorito */}
						<button
							onClick={() => toggleFavorito(producto.id)}
							title="Quitar de favoritos"
							style={{
								position: "absolute",
								top: 10,
								right: 10,
								zIndex: 10,
								background: "rgba(255,255,255,0.92)",
								border: "none",
								borderRadius: "50%",
								width: 36,
								height: 36,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
							}}
						>
							<svg width={18} height={18} viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth={2}>
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
							</svg>
						</button>

						<Link href={`/productos/${producto.id}`} style={{ textDecoration: "none",color: "inherit" }}>
							<div style={{
								height: 180,
								background: "#f5f5f5",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: 16
							}}>
								<NextImage
									src={producto.thumbnail}
									alt={producto.name}
									width={400}
									height={300}
									style={{ maxHeight: "100%",maxWidth: "100%",objectFit: "contain" }}
								/>
							</div>

							<div style={{ padding: "12px 16px 8px" }}>
								<span style={{
									fontSize: 11,
									textTransform: "uppercase",
									color: "#0070f3",
									fontWeight: 600,
									letterSpacing: 1
								}}>
									{producto.category}
								</span>
								<h3 style={{
									margin: "4px 0 8px",
									fontSize: 14,
									fontWeight: 600,
									color: "#1a1a1a",
									lineHeight: 1.3,
									height: 36,
									overflow: "hidden"
								}}>
									{producto.name}
								</h3>
								<div style={{ display: "flex",alignItems: "center",justifyContent: "space-between" }}>
									<span style={{ fontSize: 18,fontWeight: 700 }}>${producto.price}</span>
									{producto.discount > 0 && (
										<span style={{
											background: "#e8f5e9",
											color: "#2e7d32",
											padding: "2px 8px",
											borderRadius: 20,
											fontSize: 11,
											fontWeight: 600
										}}>
											-{Math.round(producto.discount)}% OFF
										</span>
									)}
								</div>
							</div>
						</Link>

						<div style={{ padding: "0 16px 16px" }}>
							<button
								onClick={() => agregarAlCarrito(producto)}
								style={{
									width: "100%",
									padding: "9px",
									background: "#0070f3",
									color: "white",
									border: "none",
									borderRadius: 8,
									cursor: "pointer",
									fontWeight: 600,
									fontSize: 13
								}}
							>
								+ Agregar al carrito
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}