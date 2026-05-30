"use client"
import NextImage from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function HomeProductCard({ producto }: { producto: any }) {
	const [hovered,setHovered] = useState(false)
	

	return (
		<Link href={`/productos/${producto.id}`} style={{ textDecoration: "none",color: "inherit" }}>
			<div
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				style={{
					minWidth: 200,
					background: "white",
					border: "1px solid #e0e0e0",
					borderRadius: 12,
					overflow: "hidden",
					flexShrink: 0,
					transition: "transform 0.2s, box-shadow 0.2s",
					transform: hovered ? "translateY(-4px)" : "translateY(0)",
					boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "none",
				}}
			>
			<div style={{
				height: 160,
				background: "#f5f5f5",
				position: "relative"
			}}>
				<NextImage
					src={producto.thumbnail}
					alt={producto.title}
					fill
					style={{ objectFit: "contain",padding: 12 }}
					sizes="200px"
				/>
			</div>

			<div style={{ padding: 12 }}>
				<p style={{
					margin: "0 0 4px",
					fontSize: 13,
					fontWeight: 600,
					color: "#1a1a1a",
					overflow: "hidden",
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					lineHeight: 1.4,
					height: 36
				}}>
					{producto.title}
				</p>

				<div style={{ display: "flex",alignItems: "center",gap: 4,margin: "6px 0" }}>
					<span style={{ color: "#f5a623",fontSize: 12 }}>★</span>
					<span style={{ fontSize: 12,color: "#666" }}>{producto.rating}</span>
				</div>

				<div style={{ display: "flex",alignItems: "center",justifyContent: "space-between" }}>
					<span style={{ fontSize: 18,fontWeight: 700 }}>${producto.price}</span>
					{producto.discountPercentage > 5 && (
						<span style={{
							background: "#e8f5e9",
							color: "#2e7d32",
							padding: "2px 6px",
							borderRadius: 20,
							fontSize: 11,
							fontWeight: 600
						}}>
							-{Math.round(producto.discountPercentage)}%
						</span>
					)}
				</div>
			</div>
			</div>
		</Link>
	)
}