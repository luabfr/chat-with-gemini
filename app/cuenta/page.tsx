"use client"
import { useState,useEffect } from "react"
import { createClient } from "../lib/supabase/client"

export default function PerfilPage() {
	const [nombre,setNombre] = useState("")
	const [telefono,setTelefono] = useState("")
	const [direccion,setDireccion] = useState("")
	const [email,setEmail] = useState("")
	const [guardando,setGuardando] = useState(false)
	const [mensaje,setMensaje] = useState("")
	const supabase = createClient()

	useEffect(() => {
		const cargarPerfil = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) return

			setEmail(user.email || "")
			setNombre(user.user_metadata?.full_name || "")

			const { data: profile } = await supabase
				.from("profiles")
				.select("*")
				.eq("id",user.id)
				.single()

			if (profile) {
				setNombre(profile.nombre || user.user_metadata?.full_name || "")
				setTelefono(profile.telefono || "")
				setDireccion(profile.direccion_default || "")
			}
		}

		cargarPerfil()
	},[])

	const guardar = async () => {
		setGuardando(true)
		setMensaje("")

		const { data: { user } } = await supabase.auth.getUser()
		if (!user) return

		const { error } = await supabase
			.from("profiles")
			.upsert({
				id: user.id,
				nombre,
				telefono,
				direccion_default: direccion
			})

		if (error) {
			setMensaje("Error al guardar")
		} else {
			setMensaje("✅ Perfil actualizado")
		}

		setGuardando(false)
		setTimeout(() => setMensaje(""),3000)
	}

	const inputStyle = {
		width: "100%",
		padding: "10px 14px",
		borderRadius: 8,
		border: "1px solid #e0e0e0",
		fontSize: 14,
		outline: "none",
		boxSizing: "border-box" as const,
		color: "#1a1a1a",
		background: "white"
	}

	return (
		<div style={{
			background: "white",
			border: "1px solid #e0e0e0",
			borderRadius: 12,
			padding: 32
		}}>
			<h2 style={{ margin: "0 0 24px",fontSize: 20,fontWeight: 700 }}>
				Mi perfil
			</h2>

			<div style={{ display: "flex",flexDirection: "column",gap: 16,maxWidth: 480 }}>
				<div>
					<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
						Email
					</label>
					<input
						value={email}
						disabled
						style={{ ...inputStyle,background: "#f9f9f9",color: "#999" }}
					/>
					<p style={{ margin: "4px 0 0",fontSize: 12,color: "#999" }}>
						El email no se puede modificar
					</p>
				</div>
				<div>
					<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
						Nombre completo
					</label>
					<input
						value={nombre}
						onChange={e => setNombre(e.target.value)}
						placeholder="Tu nombre"
						style={inputStyle}
					/>
				</div>
				<div>
					<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
						Teléfono
					</label>
					<input
						value={telefono}
						onChange={e => setTelefono(e.target.value)}
						placeholder="+54 11 1234 5678"
						style={inputStyle}
					/>
				</div>
				<div>
					<label style={{ fontSize: 13,fontWeight: 600,color: "#333",display: "block",marginBottom: 4 }}>
						Dirección por defecto
					</label>
					<input
						value={direccion}
						onChange={e => setDireccion(e.target.value)}
						placeholder="Av. Corrientes 1234, Buenos Aires"
						style={inputStyle}
					/>
				</div>

				{mensaje && (
					<p style={{ color: mensaje.includes("Error") ? "#e53e3e" : "#2e7d32",fontSize: 13,margin: 0 }}>
						{mensaje}
					</p>
				)}

				<button
					onClick={guardar}
					disabled={guardando}
					style={{
						padding: "12px 24px",
						background: guardando ? "#ccc" : "#0070f3",
						color: "white",
						border: "none",
						borderRadius: 8,
						fontSize: 14,
						fontWeight: 700,
						cursor: guardando ? "not-allowed" : "pointer",
						alignSelf: "flex-start"
					}}
				>
					{guardando ? "Guardando..." : "Guardar cambios"}
				</button>
			</div>
		</div>
	)
}