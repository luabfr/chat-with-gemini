"use client"
import { useState } from "react"

export default function Home() {
  const [mensaje,setMensaje] = useState("")
  const [mensajes,setMensajes] = useState([])
  const [historial,setHistorial] = useState([])
  const [cargando,setCargando] = useState(false)

  const enviar = async () => {
    if (!mensaje.trim() || cargando) return

    const mensajeUsuario = mensaje
    setMensaje("")
    setCargando(true)

    // Agregar mensaje del usuario a la UI
    const nuevosMensajes = [
      ...mensajes,
      { rol: "usuario",texto: mensajeUsuario }
    ]
    setMensajes(nuevosMensajes)

    try {
      const res = await fetch("/api/chat",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: mensajeUsuario,
          historial: historial
        })
      })

      const data = await res.json()

      // Agregar respuesta de la IA a la UI
      setMensajes([
        ...nuevosMensajes,
        { rol: "ia",texto: data.respuesta }
      ])

      // Actualizar historial para la próxima llamada
      setHistorial([
        ...historial,
        {
          role: "user",
          parts: [{ text: mensajeUsuario }]
        },
        {
          role: "model",
          parts: [{ text: data.respuesta }]
        }
      ])

    } catch (error) {
      setMensajes([
        ...nuevosMensajes,
        { rol: "ia",texto: "Hubo un error. Intentá de nuevo." }
      ])
    }

    setCargando(false)
  }

  return (
    <main style={{ maxWidth: 650,margin: "40px auto",padding: "0 20px" }}>

      <h1 style={{ marginBottom: 4 }}>🛒 Asistente de tienda</h1>
      <p style={{ color: "#666",marginBottom: 20 }}>
        Preguntame sobre productos, precios o categorías
      </p>

      {/* Área de mensajes */}
      <div style={{
        border: "1px solid #e0e0e0",
        borderRadius: 12,
        padding: 16,
        minHeight: 400,
        maxHeight: 500,
        overflowY: "auto",
        marginBottom: 16,
        background: "#fafafa"
      }}>
        {mensajes.length === 0 && (
          <p style={{ color: "#999",textAlign: "center",marginTop: 80 }}>
            Escribí algo para empezar. Por ejemplo:<br />
            <em>"¿Qué productos tienen disponibles?"</em><br />
            <em>"Buscame algo de electrónica"</em><br />
            <em>"¿Cuál es el producto más barato?"</em>
          </p>
        )}

        {mensajes.map((m,i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.rol === "usuario" ? "flex-end" : "flex-start",
              marginBottom: 12
            }}
          >
            <span style={{
              background: m.rol === "usuario" ? "#0070f3" : "#ffffff",
              color: m.rol === "usuario" ? "white" : "#333",
              padding: "10px 14px",
              borderRadius: m.rol === "usuario" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              maxWidth: "75%",
              lineHeight: 1.5,
              border: m.rol === "ia" ? "1px solid #e0e0e0" : "none",
              whiteSpace: "pre-wrap"
            }}>
              {m.texto}
            </span>
          </div>
        ))}

        {cargando && (
          <div style={{ display: "flex",justifyContent: "flex-start" }}>
            <span style={{
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              padding: "10px 14px",
              borderRadius: "18px 18px 18px 4px",
              color: "#999"
            }}>
              Max está escribiendo...
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex",gap: 8 }}>
        <input
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          onKeyDown={e => e.key === "Enter" && enviar()}
          placeholder="Escribí tu pregunta..."
          disabled={cargando}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 24,
            border: "1px solid #e0e0e0",
            fontSize: 15,
            outline: "none"
          }}
        />
        <button
          onClick={enviar}
          disabled={cargando}
          style={{
            padding: "12px 20px",
            background: cargando ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 24,
            cursor: cargando ? "not-allowed" : "pointer",
            fontSize: 15
          }}
        >
          Enviar
        </button>
      </div>
    </main>
  )
}