"use client"
import { useState } from "react"
import { useRouter,usePathname } from "next/navigation"
import { useFavoritos } from "../context/FavoritosContext"
import { createClient } from "../lib/supabase/client"

interface FavoriteButtonProps {
	productoId: number
	size?: number          // tamaño del ícono en px (default 20)
	style?: React.CSSProperties
}

export default function FavoriteButton({ productoId,size = 20,style }: FavoriteButtonProps) {
	const { esFavorito,toggleFavorito,cargando } = useFavoritos()
	const [animando,setAnimando] = useState(false)
	const router = useRouter()
	const pathname = usePathname()
	const supabase = createClient()

	const activo = esFavorito(productoId)

	const handleClick = async (e: React.MouseEvent) => {
		e.preventDefault()   // evitar navegación si está dentro de un <Link>
		e.stopPropagation()

		if (cargando) return

		const { data, error } = await supabase.auth.getUser()
		if (error || !data?.user) {
			console.error("No se pudo validar la sesión antes de agregar favorito:", error)
			router.push(`/login?redirect=${pathname}`)
			return
		}

		setAnimando(true)
		setTimeout(() => setAnimando(false),300)

		await toggleFavorito(productoId)
	}

	return (
		<button
			onClick={handleClick}
			title={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
			disabled={cargando}
			style={{
				background: "rgba(255,255,255,0.92)",
				border: "none",
				borderRadius: "50%",
				width: size + 16,
				height: size + 16,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: cargando ? "not-allowed" : "pointer",
				boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
				transition: "transform 0.15s ease, box-shadow 0.15s ease",
				transform: animando ? "scale(1.35)" : "scale(1)",
				flexShrink: 0,
				opacity: cargando ? 0.75 : 1,
				...style,
			}}
			onMouseEnter={e => {
				if (!animando && !cargando) e.currentTarget.style.transform = "scale(1.12)"
				e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)"
			}}
			onMouseLeave={e => {
				if (!animando) e.currentTarget.style.transform = "scale(1)"
				e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)"
			}}
		>
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill={activo ? "#e53935" : "none"}
				stroke={activo ? "#e53935" : "#666"}
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
			>
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		</button>
	)
}
