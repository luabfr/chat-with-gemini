"use client"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "./context/CartContext"

export default function Home() {
  const [mensaje,setMensaje] = useState("")
  // const [mensajes,setMensajes] = useState([])
  // const [historial,setHistorial] = useState([])
  const [mensajes,setMensajes] = useState<{ rol: string; texto: string }[]>([])
  const [historial,setHistorial] = useState<{ role: string; parts: { text: string }[] }[]>([])
  const [cargando,setCargando] = useState(false)

  const { agregarAlCarrito,carrito } = useCart()

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

      let textoRespuesta = data.respuesta

      try {
        // Buscar todos los JSONs en la respuesta con regex
        const matches = data.respuesta.match(/\{[^}]+\}/g)

        if (matches && matches.length > 0) {
          const mensajes: string[] = []

          for (const match of matches) {
            const accion = JSON.parse(match)
            if (accion.accion === "agregar_carrito") {
              const resProducto = await fetch(`https://dummyjson.com/products/${accion.producto_id}`)
              const producto = await resProducto.json()
              agregarAlCarrito(producto)
              mensajes.push(accion.mensaje)
            }
          }

          // Unir todos los mensajes en uno solo
          if (mensajes.length > 0) {
            textoRespuesta = mensajes.join(" ")
          }
        }
      } catch {
        // Era texto normal, no hacemos nada
      }

      // Agregar respuesta de la IA a la UI
        setMensajes([...nuevosMensajes,{ rol: "ia",texto: textoRespuesta }])

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
      <>
    {/* Navbar */}
    <nav style={{
      borderBottom: "1px solid #e0e0e0",
      padding: "14px 40px",
      display: "flex",
      gap: 24,
      background: "white"
    }}>
      <Link href="/" style={{ textDecoration: "none", color: "#0070f3", fontWeight: 600 }}>
        💬 Chat con Max
      </Link >
      <Link href="/productos" style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}>
        🛍️ Productos
      </Link >
    </nav>

    <main style={{ maxWidth: 650, margin: "40px auto", padding: "0 20px" }}>

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
            <em>&quot;¿Qué productos tienen disponibles?&quot;</em><br />
            <em>&quot;Buscame algo de electrónica&quot;</em><br />
            <em>&quot;¿Cuál es el producto más barato?&quot;</em>
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
  </>
  )
}