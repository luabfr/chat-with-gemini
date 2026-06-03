import Groq from "groq-sdk"
import { createClient } from "../../lib/supabase/server"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { mensaje, historial } = await req.json()

  const supabase = await createClient()

  // Traer productos
  const { data: products } = await supabase
    .from("productos")
    .select("id, name, price, category, description, stock, rating")
    .eq("active", true)
    .limit(60)

  const productosSimplificados = (products || []).map(p => ({
    id: p.id,
    nombre: p.name,
    precio: p.price,
    categoria: p.category,
    descripcion: p.description,
    stock: p.stock,
    rating: p.rating
  }))

  const systemPrompt = `
Sos Max, un asistente de ecommerce amable y útil.
Respondé siempre en español, de forma clara y concisa.
Solo respondés preguntas relacionadas a los productos disponibles.
Cuando recomiendes un producto mencioná nombre, precio y por qué lo recomendás.

ACCIONES DISPONIBLES — respondé ÚNICAMENTE con el JSON correspondiente, sin texto adicional:

1. Agregar al carrito:
{"accion": "agregar_carrito", "producto_id": ID, "mensaje": "Tu mensaje"}

2. Agregar a favoritos:
{"accion": "agregar_favorito", "producto_id": ID, "mensaje": "Tu mensaje"}

3. Quitar de favoritos:
{"accion": "quitar_favorito", "producto_id": ID, "mensaje": "Tu mensaje"}

Para múltiples productos, uno por línea (mismo formato).

Usá la acción correcta según lo que pida el usuario:
- "agregame al carrito" → agregar_carrito
- "guardame en favoritos" / "marcame como favorito" → agregar_favorito
- "quitame de favoritos" / "sacame de favoritos" → quitar_favorito

Productos disponibles:
${JSON.stringify(productosSimplificados)}
  `

  const mensajes = [
    { role: "system", content: systemPrompt },
    ...historial.map((h) => ({
      role: h.role === "model" ? "assistant" : h.role,
      content: h.parts[0].text
    })),
    { role: "user", content: mensaje }
  ]

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: mensajes,
    temperature: 0.7,
    max_tokens: 1024
  })

  const respuesta = response.choices[0].message.content
  return Response.json({ respuesta })
}