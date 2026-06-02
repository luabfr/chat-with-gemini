"use client"
import Link from "next/link"
import { usePathname,useRouter } from "next/navigation"
import { useCart } from "../context/CartContext"
import { useState,useEffect,useRef } from "react"
import SearchResults from "./SearchResults"
import { buscarProductosCliente } from "../lib/productos"
import { Product } from "../lib/types"
import { useUser } from "../lib/useUser"
import { createClient } from "../lib/supabase/client"
import NextImage from "next/image"

export default function Navbar() {
	const pathname = usePathname()
	const router = useRouter()
	const { totalItems } = useCart()

	const [query,setQuery] = useState("")
	const [resultados,setResultados] = useState<Product[]>([])
	const [buscando,setBuscando] = useState(false)
	const [enfocado,setEnfocado] = useState(false)
	const searchRef = useRef<HTMLDivElement>(null)
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	// Cerrar resultados al hacer click fuera
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setEnfocado(false)
			}
		}
		document.addEventListener("mousedown",handleClick)
		return () => document.removeEventListener("mousedown",handleClick)
	},[])

	// Buscar con debounce
	useEffect(() => {
		if (timerRef.current) clearTimeout(timerRef.current)

		if (!query.trim()) {
			timerRef.current = setTimeout(() => {
				setResultados([])
			},0)
			return
		}

		timerRef.current = setTimeout(async () => {
			setBuscando(true)
			const data = await buscarProductosCliente(query)
			setResultados(data)
			setBuscando(false)
		},350)

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	},[query])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!query.trim()) return
		setEnfocado(false)
		setQuery("")
		router.push(`/productos?buscar=${encodeURIComponent(query)}`)
	}

	const cerrarResultados = () => {
		setEnfocado(false)
		setQuery("")
		setResultados([])
	}

	const linkStyle = (href: string) => ({
		textDecoration: "none",
		color: pathname === href ? "#0070f3" : "#333",
		fontWeight: pathname === href ? 700 : 500,
		fontSize: 15,
		padding: "4px 0",
		borderBottom: pathname === href ? "2px solid #0070f3" : "2px solid transparent",
		transition: "color 0.2s"
	})


	const { user } = useUser()
	const supabase = createClient()

	const handleLogout = async () => {
		await supabase.auth.signOut()
		router.push("/")
		router.refresh()
	}


	return (
		<header style={{
			position: "sticky",
			top: 0,
			zIndex: 50,
			background: "white",
			borderBottom: "1px solid #e0e0e0",
			boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
		}}>
			<div style={{
				maxWidth: 1200,
				margin: "0 auto",
				padding: "0 20px",
				height: 64,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: 24
			}}>

				{/* Logo */}
				<Link href="/" style={{ textDecoration: "none",flexShrink: 0 }}>
					<div style={{ display: "flex",alignItems: "center",gap: 8 }}>
						<span style={{ fontSize: 24 }}>🛒</span>
						<span style={{ fontSize: 20,fontWeight: 800,color: "#1a1a1a",letterSpacing: "-0.5px" }}>
							Market<span style={{ color: "#0070f3" }}>Chat</span>
						</span>
					</div>
				</Link>

				{/* Buscador */}
				<div ref={searchRef} style={{ flex: 1,position: "relative",maxWidth: 480 }}>
					<form onSubmit={handleSubmit}>
						<div style={{ position: "relative" }}>
							<span style={{
								position: "absolute",
								left: 14,
								top: "50%",
								transform: "translateY(-50%)",
								color: "#999",
								fontSize: 16,
								pointerEvents: "none"
							}}>
								🔍
							</span>
							<input
								value={query}
								onChange={e => setQuery(e.target.value)}
								onFocus={() => setEnfocado(true)}
								placeholder="Buscar productos..."
								style={{
									width: "100%",
									padding: "10px 16px 10px 40px",
									borderRadius: 24,
									border: enfocado ? "2px solid #0070f3" : "2px solid #e0e0e0",
									fontSize: 14,
									outline: "none",
									background: "#f9f9f9",
									boxSizing: "border-box",
									transition: "border-color 0.2s"
								}}
							/>
							{buscando && (
								<span style={{
									position: "absolute",
									right: 14,
									top: "50%",
									transform: "translateY(-50%)",
									fontSize: 12,
									color: "#999"
								}}>
									...
								</span>
							)}
						</div>
					</form>

					{/* Resultados dropdown */}
					{enfocado && query.trim() && (
						<SearchResults
							resultados={resultados}
							onClose={cerrarResultados}
						/>
					)}
				</div>

				{/* Links */}
				<nav style={{ display: "flex",gap: 24,alignItems: "center",flexShrink: 0 }}>
					<Link href="/" style={linkStyle("/")}>Inicio</Link>
					<Link href="/productos" style={linkStyle("/productos")}>Productos</Link>
				</nav>

				{/* Carrito */}
				{/* <div style={{
					display: "flex",
					alignItems: "center",
					gap: 6,
					flexShrink: 0,
					color: "#333",
					fontSize: 14,
					fontWeight: 500
				}}>
					<span style={{ fontSize: 18 }}>🛒</span>
					{totalItems > 0 && (
						<span style={{
							background: "#0070f3",
							color: "white",
							borderRadius: 20,
							padding: "1px 8px",
							fontSize: 12,
							fontWeight: 700
						}}>
							{totalItems}
						</span>
					)}
				</div> */}
				{/* Acciones derecha */}
				<div style={{ display: "flex",alignItems: "center",gap: 16,flexShrink: 0 }}>

					{/* Carrito */}
					<div style={{ display: "flex",alignItems: "center",gap: 6,color: "#333",fontSize: 14,fontWeight: 500 }}>
						<span style={{ fontSize: 18 }}>🛒</span>
						{totalItems > 0 && (
							<span style={{
								background: "#0070f3",
								color: "white",
								borderRadius: 20,
								padding: "1px 8px",
								fontSize: 12,
								fontWeight: 700
							}}>
								{totalItems}
							</span>
						)}
					</div>

					{/* Usuario */}
					{user ? (
						<div style={{ display: "flex",alignItems: "center",gap: 10 }}>
							<Link href="/cuenta" style={{ textDecoration: "none" }}>
								<div style={{
									display: "flex",
									alignItems: "center",
									gap: 8,
									padding: "6px 12px",
									borderRadius: 20,
									border: "1px solid #e0e0e0",
									cursor: "pointer"
								}}>
									{user.user_metadata?.avatar_url ? (
										<NextImage
											src={user.user_metadata.avatar_url}
											alt="avatar"
											width={24}
											height={24}
											style={{ borderRadius: "50%" }}
										/>
									) : (
										<span style={{
											width: 24,
											height: 24,
											borderRadius: "50%",
											background: "#0070f3",
											color: "white",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontSize: 12,
											fontWeight: 700
										}}>
											{user.email?.[0].toUpperCase()}
										</span>
									)}
									<span style={{ fontSize: 13,fontWeight: 600,color: "#333" }}>
										{user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
									</span>
								</div>
							</Link>
							<button
								onClick={handleLogout}
								style={{
									padding: "6px 12px",
									borderRadius: 20,
									border: "1px solid #e0e0e0",
									background: "white",
									cursor: "pointer",
									fontSize: 13,
									color: "#666"
								}}
							>
								Salir
							</button>
						</div>
					) : (
						<Link href="/login" style={{
							padding: "8px 16px",
							background: "#0070f3",
							color: "white",
							borderRadius: 20,
							textDecoration: "none",
							fontSize: 13,
							fontWeight: 600
						}}>
							Iniciar sesión
						</Link>
					)}
				</div>

			</div>
		</header>
	)
}