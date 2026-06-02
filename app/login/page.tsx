"use client"
import { useState } from "react"
import { createClient } from "../lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
	const [email,setEmail] = useState("")
	const [password,setPassword] = useState("")
	const [error,setError] = useState("")
	const [cargando,setCargando] = useState(false)
	const router = useRouter()
	const supabase = createClient()

	const searchParams = useSearchParams()
	const redirect = searchParams.get("redirect") || "/"

	const handleLogin = async () => {
		if (!email || !password) {
			setError("Completá todos los campos")
			return
		}
		setCargando(true)
		setError("")

		const { error } = await supabase.auth.signInWithPassword({ email,password })

		if (error) {
			setError("Email o contraseña incorrectos")
			setCargando(false)
			return
		}

		// router.push("/")
		router.push(redirect)
		router.refresh()
	}

	const handleGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`
			}
		})
	}

	const inputStyle = {
		width: "100%",
		padding: "12px 16px",
		borderRadius: 8,
		border: "1px solid #e0e0e0",
		fontSize: 14,
		outline: "none",
		boxSizing: "border-box" as const,
		color: "#1a1a1a",
		background: "white"
	}

	return (
		<main style={{
			maxWidth: 420,
			margin: "80px auto",
			padding: "0 20px"
		}}>
			<div style={{
				background: "white",
				border: "1px solid #e0e0e0",
				borderRadius: 16,
				padding: 40
			}}>
				<h1 style={{ margin: "0 0 8px",fontSize: 24,fontWeight: 800 }}>
					Iniciar sesión
				</h1>
				<p style={{ margin: "0 0 32px",color: "#666",fontSize: 14 }}>
					¿No tenés cuenta?{" "}
					<Link href="/registro" style={{ color: "#0070f3",fontWeight: 600 }}>
						Registrate
					</Link>
				</p>

				{/* Google */}
				<button
					onClick={handleGoogle}
					style={{
						width: "100%",
						padding: "12px 16px",
						borderRadius: 8,
						border: "1px solid #e0e0e0",
						background: "white",
						cursor: "pointer",
						fontSize: 14,
						fontWeight: 600,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 10,
						marginBottom: 24,
						color: "#1a1a1a"
					}}
				>
					<svg width="18" height="18" viewBox="0 0 18 18">
						<path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
						<path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
						<path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
						<path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z" />
					</svg>
					Continuar con Google
				</button>

				<div style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					marginBottom: 24
				}}>
					<div style={{ flex: 1,height: 1,background: "#e0e0e0" }} />
					<span style={{ color: "#999",fontSize: 13 }}>o</span>
					<div style={{ flex: 1,height: 1,background: "#e0e0e0" }} />
				</div>

				{/* Email/Password */}
				<div style={{ display: "flex",flexDirection: "column",gap: 16 }}>
					<div>
						<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							onKeyDown={e => e.key === "Enter" && handleLogin()}
							placeholder="tu@email.com"
							style={inputStyle}
						/>
					</div>
					<div>
						<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
							Contraseña
						</label>
						<input
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							onKeyDown={e => e.key === "Enter" && handleLogin()}
							placeholder="••••••••"
							style={inputStyle}
						/>
					</div>

					{error && (
						<p style={{ color: "#e53e3e",fontSize: 13,margin: 0 }}>{error}</p>
					)}

					<button
						onClick={handleLogin}
						disabled={cargando}
						style={{
							width: "100%",
							padding: 14,
							background: cargando ? "#ccc" : "#0070f3",
							color: "white",
							border: "none",
							borderRadius: 8,
							fontSize: 15,
							fontWeight: 700,
							cursor: cargando ? "not-allowed" : "pointer"
						}}
					>
						{cargando ? "Ingresando..." : "Iniciar sesión"}
					</button>
				</div>
			</div>
		</main>
	)
}