"use client"
import { useState } from "react"
import { useCart } from "../context/CartContext"

interface Mensaje {
	rol: string
	texto: string
}

interface HistorialItem {
	role: string
	parts: { text: string }[]
}

export default function FloatingChat() {
	const [abierto,setAbierto] = useState(false)
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
							const resProducto = await fetch(`https://dummyjson.com/products/${accion.producto_id}`)
							const producto = await resProducto.json()
							agregarAlCarrito(producto)
							mensajesAccion.push(accion.mensaje)
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
		<>
			{/* Burbuja flotante */}
			<button
				onClick={() => setAbierto(!abierto)}
				style={{
					position: "fixed",
					bottom: 24,
					left: 24,
					width: 56,
					height: 56,
					borderRadius: "50%",
					background: "#0070f3",
					color: "white",
					border: "none",
					fontSize: 24,
					cursor: "pointer",
					boxShadow: "0 4px 16px rgba(0,112,243,0.4)",
					zIndex: 100,
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				{abierto ? "✕" : "💬"}
			</button>

			{/* Panel del chat */}
			{abierto && (
				<div style={{
					position: "fixed",
					bottom: 92,
					left: 24,
					width: 360,
					height: 500,
					background: "white",
					borderRadius: 16,
					boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
					zIndex: 100,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					border: "1px solid #e0e0e0"
				}}>

					{/* Header */}
					<div style={{
						padding: "16px 20px",
						borderBottom: "1px solid #f0f0f0",
						background: "#0070f3",
						color: "white"
					}}>
						<p style={{ margin: 0,fontWeight: 700,fontSize: 15 }}>💬 Max - Asistente</p>
						<p style={{ margin: 0,fontSize: 12,opacity: 0.8 }}>
							Preguntame sobre productos o pedime que agregue al carrito
						</p>
					</div>

					{/* Mensajes */}
					<div style={{
						flex: 1,
						overflowY: "auto",
						padding: 16,
						display: "flex",
						flexDirection: "column",
						gap: 8
					}}>
						{mensajes.length === 0 && (
							<div style={{ color: "#999",fontSize: 13,textAlign: "center",marginTop: 40 }}>
								<p>👋 Hola, soy Max</p>
								<p>Puedo ayudarte a encontrar productos o agregarlos al carrito</p>
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
									background: m.rol === "usuario" ? "#0070f3" : "#f5f5f5",
									color: m.rol === "usuario" ? "white" : "#333",
									padding: "8px 12px",
									borderRadius: m.rol === "usuario" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
									maxWidth: "80%",
									fontSize: 13,
									lineHeight: 1.5,
									whiteSpace: "pre-wrap"
								}}>
									{m.texto}
								</span>
							</div>
						))}

						{cargando && (
							<div style={{ display: "flex",justifyContent: "flex-start" }}>
								<span style={{
									background: "#f5f5f5",
									padding: "8px 12px",
									borderRadius: "18px 18px 18px 4px",
									fontSize: 13,
									color: "#999"
								}}>
									Max está escribiendo...
								</span>
							</div>
						)}
					</div>

					{/* Input */}
					<div style={{
						padding: "12px 16px",
						borderTop: "1px solid #f0f0f0",
						display: "flex",
						gap: 8
					}}>
						<input
							value={mensaje}
							onChange={e => setMensaje(e.target.value)}
							onKeyDown={e => e.key === "Enter" && enviar()}
							placeholder="Escribí tu pregunta..."
							disabled={cargando}
							style={{
								flex: 1,
								padding: "8px 12px",
								borderRadius: 20,
								border: "1px solid #e0e0e0",
								fontSize: 13,
								outline: "none"
							}}
						/>
						<button
							onClick={enviar}
							disabled={cargando}
							style={{
								padding: "8px 14px",
								background: cargando ? "#ccc" : "#0070f3",
								color: "white",
								border: "none",
								borderRadius: 20,
								cursor: cargando ? "not-allowed" : "pointer",
								fontSize: 13,
								fontWeight: 600
							}}
						>
							→
						</button>
					</div>
				</div>
			)}
		</>
	)
}