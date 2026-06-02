"use client"
import { useState } from "react"
import { createClient } from "../lib/supabase/client"
// import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegistroPage() {
	const [nombre,setNombre] = useState("")
	const [email,setEmail] = useState("")
	const [password,setPassword] = useState("")
	const [confirmar,setConfirmar] = useState("")
	const [error,setError] = useState("")
	const [exito,setExito] = useState(false)
	const [cargando,setCargando] = useState(false)
	// const router = useRouter()
	const supabase = createClient()

	const handleRegistro = async () => {
		setError("")

		if (!nombre || !email || !password || !confirmar) {
			setError("Completá todos los campos")
			return
		}
		if (password !== confirmar) {
			setError("Las contraseñas no coinciden")
			return
		}
		if (password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres")
			return
		}

		setCargando(true)

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: nombre }
			}
		})

		if (error) {
			setError(error.message)
			setCargando(false)
			return
		}

		setExito(true)
		setCargando(false)
	}

	const handleGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
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

	if (exito) {
		return (
			<main style={{ maxWidth: 420,margin: "80px auto",padding: "0 20px" }}>
				<div style={{
					background: "white",
					border: "1px solid #e0e0e0",
					borderRadius: 16,
					padding: 40,
					textAlign: "center"
				}}>
					<p style={{ fontSize: 48,margin: "0 0 16px" }}>📬</p>
					<h1 style={{ margin: "0 0 8px",fontSize: 22,fontWeight: 800 }}>
						Revisá tu email
					</h1>
					<p style={{ color: "#666",fontSize: 14,marginBottom: 24,lineHeight: 1.6 }}>
						Te enviamos un link de confirmación a <strong>{email}</strong>.
						Hacé click en el link para activar tu cuenta.
					</p>
					<Link href="/login" style={{
						display: "inline-block",
						padding: "12px 28px",
						background: "#0070f3",
						color: "white",
						borderRadius: 8,
						textDecoration: "none",
						fontWeight: 600
					}}>
						Ir al login
					</Link>
				</div>
			</main>
		)
	}

	return (
		<main style={{ maxWidth: 420,margin: "80px auto",padding: "0 20px" }}>
			<div style={{
				background: "white",
				border: "1px solid #e0e0e0",
				borderRadius: 16,
				padding: 40
			}}>
				<h1 style={{ margin: "0 0 8px",fontSize: 24,fontWeight: 800 }}>
					Crear cuenta
				</h1>
				<p style={{ margin: "0 0 32px",color: "#666",fontSize: 14 }}>
					¿Ya tenés cuenta?{" "}
					<Link href="/login" style={{ color: "#0070f3",fontWeight: 600 }}>
						Iniciá sesión
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
					Registrarse con Google
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

				<div style={{ display: "flex",flexDirection: "column",gap: 16 }}>
					<div>
						<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
							Nombre completo
						</label>
						<input
							type="text"
							value={nombre}
							onChange={e => setNombre(e.target.value)}
							placeholder="Juan Pérez"
							style={inputStyle}
						/>
					</div>
					<div>
						<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
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
							placeholder="Mínimo 6 caracteres"
							style={inputStyle}
						/>
					</div>
					<div>
						<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
							Confirmar contraseña
						</label>
						<input
							type="password"
							value={confirmar}
							onChange={e => setConfirmar(e.target.value)}
							onKeyDown={e => e.key === "Enter" && handleRegistro()}
							placeholder="Repetí tu contraseña"
							style={inputStyle}
						/>
					</div>

					{error && (
						<p style={{ color: "#e53e3e",fontSize: 13,margin: 0 }}>{error}</p>
					)}

					<button
						onClick={handleRegistro}
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
						{cargando ? "Creando cuenta..." : "Crear cuenta"}
					</button>
				</div>
			</div>
		</main>
	)
}