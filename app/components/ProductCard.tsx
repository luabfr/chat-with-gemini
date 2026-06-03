"use client"
import Link from "next/link"
import { useCart } from "../context/CartContext"
import NextImage from "next/image"
import { Product } from "../lib/types"
import FavoriteButton from "./FavoriteButton"

export default function ProductCard({ producto }: { producto: Product }) {
	const { agregarAlCarrito } = useCart()

	return (
		<div
			style={{
				border: "1px solid #e0e0e0",
				borderRadius: 12,
				overflow: "hidden",
				background: "white",
				transition: "transform 0.2s, box-shadow 0.2s",
				cursor: "pointer",
				position: "relative",   // necesario para el botón absoluto
			}}
			onMouseEnter={e => {
				e.currentTarget.style.transform = "translateY(-4px)"
				e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
			}}
			onMouseLeave={e => {
				e.currentTarget.style.transform = "translateY(0)"
				e.currentTarget.style.boxShadow = "none"
			}}
		>
			{/* Botón corazón — esquina superior derecha */}
			<div style={{ position: "absolute",top: 10,right: 10,zIndex: 10 }}>
				<FavoriteButton productoId={producto.id} size={18} />
			</div>

			<Link href={`/productos/${producto.id}`} style={{ textDecoration: "none",color: "inherit" }}>

				{/* Imagen */}
				<div style={{
					height: 200,
					background: "#f5f5f5",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 16
				}}>
					<NextImage
						src={producto.thumbnail}
						alt={producto.name}
						width={600}
						height={400}
						style={{
							maxHeight: "100%",
							maxWidth: "100%",
							objectFit: "contain"
						}}
					/>
				</div>

				{/* Info */}
				<div style={{ padding: 16 }}>
					{/* Categoría */}
					<span style={{
						fontSize: 11,
						textTransform: "uppercase",
						color: "#0070f3",
						fontWeight: 600,
						letterSpacing: 1
					}}>
						{producto.category}
					</span>

					{/* Nombre */}
					<h3 style={{
						margin: "6px 0 8px",
						fontSize: 15,
						fontWeight: 600,
						color: "#1a1a1a",
						lineHeight: 1.3,
						height: 40,
						overflow: "hidden"
					}}>
						{producto.name}
					</h3>

					{/* Rating */}
					<div style={{ display: "flex",alignItems: "center",gap: 4,marginBottom: 10 }}>
						<span style={{ color: "#f5a623",fontSize: 13 }}>★</span>
						<span style={{ fontSize: 13,color: "#666" }}>{producto.rating}</span>
						<span style={{ fontSize: 13,color: "#ccc",marginLeft: 4 }}>
							({producto.stock} en stock)
						</span>
					</div>

					{/* Precio y descuento */}
					<div style={{ display: "flex",alignItems: "center",justifyContent: "space-between" }}>
						<span style={{ fontSize: 20,fontWeight: 700,color: "#1a1a1a" }}>
							${producto.price}
						</span>
						{producto.discount > 0 && (
							<span style={{
								background: "#e8f5e9",
								color: "#2e7d32",
								padding: "3px 8px",
								borderRadius: 20,
								fontSize: 12,
								fontWeight: 600
							}}>
								-{Math.round(producto.discount)}% OFF
							</span>
						)}
					</div>
				</div>
			</Link>

			{/* Agregar al carrito */}
			<div style={{ padding: "0 16px 16px" }}>
				<button
					onClick={() => agregarAlCarrito(producto)}
					style={{
						width: "100%",
						padding: "10px",
						background: "#0070f3",
						color: "white",
						border: "none",
						borderRadius: 8,
						cursor: "pointer",
						fontWeight: 600,
						fontSize: 14
					}}
				>
					+ Agregar al carrito
				</button>
			</div>
		</div>
	)
}