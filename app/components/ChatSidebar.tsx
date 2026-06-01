"use client"
import { useState } from "react"
import { useCart } from "../context/CartContext"
import { createClient } from "../lib/supabase/client"

interface Mensaje {
	rol: string
	texto: string
}

interface HistorialItem {
	role: string
	parts: { text: string }[]
}

export default function ChatSidebar() {
	const [mensaje,setMensaje] = useState("")
	const [mensajes,setMensajes] = useState<Mensaje[]>([])
	const [historial,setHistorial] = useState<HistorialItem[]>([])
	const [cargando,setCargando] = useState(false)
	const { agregarAlCarrito } = useCart()

	const enviar = async () => {
		if (!mensaje.trim() || cargando) return

		const mensajeUsuario = mensaje
		setMensaje("")
		setCargando(true)

		const nuevosMensajes = [...mensajes,{ rol: "usuario",texto: mensajeUsuario }]
		setMensajes(nuevosMensajes)

		try {
			const res = await fetch("/api/chat",{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ mensaje: mensajeUsuario,historial })
			})

			const data = await res.json()
			let textoRespuesta = data.respuesta

			try {
				const matches = data.respuesta.match(/\{[^}]+\}/g)
				if (matches && matches.length > 0) {
					const mensajesAccion: string[] = []
					for (const match of matches) {
						const accion = JSON.parse(match)
						if (accion.accion === "agregar_carrito") {
							// ← ahora trae de Supabase en lugar de DummyJSON
							const supabase = createClient()
							const { data: producto } = await supabase
								.from("productos")
								.select("*")
								.eq("id",accion.producto_id)
								.single()

							if (producto) {
								agregarAlCarrito(producto)
								mensajesAccion.push(accion.mensaje)
							}
						}
					}
					if (mensajesAccion.length > 0) textoRespuesta = mensajesAccion.join(" ")
				}
			} catch { }

			const respuestaFinal = [...nuevosMensajes,{ rol: "ia",texto: textoRespuesta }]
			setMensajes(respuestaFinal)
			setHistorial([
				...historial,
				{ role: "user",parts: [{ text: mensajeUsuario }] },
				{ role: "model",parts: [{ text: textoRespuesta }] }
			])

		} catch {
			setMensajes([...nuevosMensajes,{ rol: "ia",texto: "Hubo un error. Intentá de nuevo." }])
		}

		setCargando(false)
	}

	return (
		<aside style={{
			width: "33.333%",
			minWidth: 300,
			maxWidth: 420,
			height: "calc(100vh - 64px)",
			position: "sticky",
			top: 64,
			background: "linear-gradient(160deg, #0a0a1a 0%, #0d1b3e 50%, #0a1628 100%)",
			display: "flex",
			flexDirection: "column",
			flexShrink: 0,
			borderRight: "1px solid rgba(255,255,255,0.06)"
		}}>

			{/* Header */}
			<div style={{
				padding: "20px 20px 16px",
				borderBottom: "1px solid rgba(255,255,255,0.08)",
				background: "rgba(255,255,255,0.03)"
			}}>
				<div style={{ display: "flex",alignItems: "center",gap: 12 }}>
					<div style={{
						width: 42,
						height: 42,
						borderRadius: "50%",
						background: "linear-gradient(135deg, #0070f3, #00c6ff)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 20,
						boxShadow: "0 0 16px rgba(0,112,243,0.5)"
					}}>
						🤖
					</div>
					<div>
						<p style={{ margin: 0,fontWeight: 700,fontSize: 15,color: "white" }}>
							Max
							<span style={{
								marginLeft: 8,
								fontSize: 10,
								background: "rgba(0,112,243,0.3)",
								color: "#60a5fa",
								padding: "2px 8px",
								borderRadius: 20,
								fontWeight: 500,
								letterSpacing: 0.5
							}}>
								IA
							</span>
						</p>
						<p style={{ margin: 0,fontSize: 12,color: "#4ade80" }}>
							● Asistente activo
						</p>
					</div>
				</div>
			</div>

			{/* Mensajes */}
			<div style={{
				flex: 1,
				overflowY: "auto",
				padding: 16,
				display: "flex",
				flexDirection: "column",
				gap: 10
			}}>
				{mensajes.length === 0 && (
					<div style={{ textAlign: "center",marginTop: 32 }}>
						<div style={{
							width: 64,
							height: 64,
							borderRadius: "50%",
							background: "linear-gradient(135deg, #0070f3, #00c6ff)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 28,
							margin: "0 auto 16px",
							boxShadow: "0 0 32px rgba(0,112,243,0.4)"
						}}>
							🤖
						</div>
						<p style={{ fontSize: 20,fontWeight: 700,color: "white",margin: "0 0 6px" }}>
							Hola, soy Max
						</p>
						<p style={{ fontSize: 16,color: "rgba(255,255,255,0.5)",margin: "0 0 24px",lineHeight: 1.6 }}>
							Tu asistente de compras con IA. <br />
							Preguntame sobre productos o pedime que agregue al carrito.
						</p>

						{/* Sugerencias */}
						{[
							"¿Qué productos tienen?",
							"Buscame el iPhone mas barato",
							"Haceme una receta con $50 con los productos que tengas",
						].map(sugerencia => (
							<button
								key={sugerencia}
								onClick={() => setMensaje(sugerencia)}
								style={{
									display: "block",
									width: "100%",
									padding: "9px 14px",
									marginBottom: 8,
									background: "rgba(255,255,255,0.05)",
									border: "1px solid rgba(255,255,255,0.1)",
									borderRadius: 20,
									fontSize: 12,
									color: "#93c5fd",
									cursor: "pointer",
									textAlign: "left",
									transition: "background 0.2s"
								}}
								onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
								onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
							>
								💬 {sugerencia}
							</button>
						))}
					</div>
				)}

				{mensajes.map((m,i) => (
					<div
						key={i}
						style={{
							display: "flex",
							justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start"
						}}
					>
						<span style={{
							background: m.rol === "usuario"
								? "linear-gradient(135deg, #0070f3, #0056d6)"
								: "rgba(255,255,255,0.08)",
							color: "white",
							padding: "10px 14px",
							borderRadius: m.rol === "usuario" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
							maxWidth: "85%",
							fontSize: 13,
							lineHeight: 1.6,
							whiteSpace: "pre-wrap",
							border: m.rol === "ia" ? "1px solid rgba(255,255,255,0.1)" : "none",
							boxShadow: m.rol === "usuario" ? "0 2px 12px rgba(0,112,243,0.4)" : "none"
						}}>
							{m.texto}
						</span>
					</div>
				))}

				{cargando && (
					<div style={{ display: "flex",justifyContent: "flex-start",gap: 6,padding: "4px 0" }}>
						{[0,1,2].map(i => (
							<div
								key={i}
								style={{
									width: 8,
									height: 8,
									borderRadius: "50%",
									background: "#0070f3",
									animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
								}}
							/>
						))}
					</div>
				)}
			</div>

			{/* Input */}
			<div style={{
				padding: "12px 16px",
				borderTop: "1px solid rgba(255,255,255,0.08)",
				background: "rgba(255,255,255,0.03)",
				display: "flex",
				gap: 8,
				alignItems: "center"
			}}>
				<input
					value={mensaje}
					onChange={e => setMensaje(e.target.value)}
					onKeyDown={e => e.key === "Enter" && enviar()}
					placeholder="Preguntale algo a Max..."
					disabled={cargando}
					style={{
						flex: 1,
						padding: "10px 16px",
						borderRadius: 24,
						border: "1px solid rgba(255,255,255,0.15)",
						fontSize: 13,
						outline: "none",
						background: "rgba(255,255,255,0.08)",
						color: "white",
						caretColor: "#0070f3"
					}}
				/>
				<button
					onClick={enviar}
					disabled={cargando}
					style={{
						width: 40,
						height: 40,
						borderRadius: "50%",
						background: cargando ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0070f3, #00c6ff)",
						color: "white",
						border: "none",
						cursor: cargando ? "not-allowed" : "pointer",
						fontSize: 16,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexShrink: 0,
						boxShadow: cargando ? "none" : "0 2px 12px rgba(0,112,243,0.5)"
					}}
				>
					→
				</button>
			</div>
		</aside>
	)
}