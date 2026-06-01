"use client"
import NextImage from "next/image"
import Link from "next/link"
import { Product } from "../lib/types"

// interface Producto {
// 	id: number
// 	title: string
// 	price: number
// 	thumbnail: string
// 	category: string
// }

export default function SearchResults({
	resultados,
	onClose
}: {
	resultados: Product[]
	onClose: () => void
}) {
	if (resultados.length === 0) return null

	return (
		<div style={{
			position: "absolute",
			top: "calc(100% + 8px)",
			left: 0,
			right: 0,
			background: "white",
			border: "1px solid #e0e0e0",
			borderRadius: 12,
			boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
			zIndex: 200,
			overflow: "hidden",
			maxHeight: 400,
			overflowY: "auto"
		}}>
			{resultados.map((producto) => (
				<Link
					key={producto.id}
					href={`/productos/${producto.id}`}
					onClick={onClose}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						padding: "10px 16px",
						textDecoration: "none",
						color: "inherit",
						borderBottom: "1px solid #f5f5f5",
						transition: "background 0.15s"
					}}
					onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
					onMouseLeave={e => (e.currentTarget.style.background = "white")}
				>
					<div style={{
						position: "relative",
						width: 48,
						height: 48,
						background: "#f5f5f5",
						borderRadius: 8,
						flexShrink: 0,
						overflow: "hidden"
					}}>
						<NextImage
							src={producto.thumbnail}
							alt={producto.name}
							fill
							style={{ objectFit: "contain",padding: 4 }}
							sizes="48px"
						/>
					</div>
					<div style={{ flex: 1,minWidth: 0 }}>
						<p style={{
							margin: 0,
							fontSize: 14,
							fontWeight: 600,
							color: "#1a1a1a",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis"
						}}>
							{producto.name}
						</p>
						<p style={{ margin: 0,fontSize: 12,color: "#666",textTransform: "capitalize" }}>
							{producto.category}
						</p>
					</div>
					<span style={{ fontSize: 15,fontWeight: 700,color: "#0070f3",flexShrink: 0 }}>
						${producto.price}
					</span>
				</Link>
			))}
		</div>
	)
}