import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req) {
  const { mensaje, historial } = await req.json()

  const CATEGORIAS = [
    "smartphones", "laptops", "beauty",
    "home-decoration", "fragrances", "groceries"
  ]

  const resultados = await Promise.all(
    CATEGORIAS.map(cat =>
      fetch(`https://dummyjson.com/products/category/${cat}?limit=5`)
        .then(r => r.json())
        .then(d => d.products)
    )
  )

  const products = resultados.flat()

  const productosSimplificados = products.map(p => ({
    id: p.id,
    nombre: p.title,
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

    Cuando el usuario quiera agregar un producto al carrito,
    respondé ÚNICAMENTE con este formato JSON, sin texto adicional:
    {"accion": "agregar_carrito", "producto_id": ID, "mensaje": "Tu mensaje"}

    Para múltiples productos, uno por línea:
    {"accion": "agregar_carrito", "producto_id": 1, "mensaje": "Producto 1 agregado"}
    {"accion": "agregar_carrito", "producto_id": 2, "mensaje": "Producto 2 agregado"}

    Productos disponibles:
    ${JSON.stringify(productosSimplificados)}
  `

  // Convertir historial al formato de Groq
  const mensajes = [
    { role: "system", content: systemPrompt },
   	...historial.map((h) => ({
      role: h.role === "model" ? "assistant" : h.role,
      content: h.parts[0].text
    })),
    { role: "user", content: mensaje }
  ]

  const response = await groq.chat.completions.create({
    // model: "llama-3.1-70b-versatile",
		model: "llama-3.3-70b-versatile",
    messages: mensajes,
    temperature: 0.7,
    max_tokens: 1024
  })

  const respuesta = response.choices[0].message.content

  return Response.json({ respuesta })
}