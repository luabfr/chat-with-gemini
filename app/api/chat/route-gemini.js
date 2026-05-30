import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  const { mensaje, historial } = await req.json()

  // 1. Traer productos de DummyJSON
  // ✅ Ahora: traemos de cada categoría específica
  const CATEGORIAS = [
    "smartphones",
    "laptops",
    "skincare",
    "home-decoration",
    "fragrances",
    "groceries"
  ]

  const resultados = await Promise.all(
    CATEGORIAS.map(cat =>
      fetch(`https://dummyjson.com/products/category/${cat}?limit=5`)
        .then(r => r.json())
        .then(d => d.products)
    )
  )

  const products = resultados.flat()


  // 2. Simplificar los productos para no gastar tokens de más
  const productosSimplificados = products.map(p => ({
    id: p.id,
    nombre: p.title,
    precio: p.price,
    categoria: p.category,
    descripcion: p.description,
    stock: p.stock,
    rating: p.rating
  }))

  // 3. Armar el modelo con personalidad
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",  // 20 tokens de contexto, 8 de respuesta
    // model: "gemini-1.5-flash-8b",  // 8 tokens de contexto, 4 de respuesta
    
    
    systemInstruction: `
        Sos Max, un asistente de ecommerce amable y útil.
        Respondé siempre en español.

        Productos disponibles:
        ${JSON.stringify(productosSimplificados)}

        IMPORTANTE: Cuando el usuario quiera agregar un producto al carrito,
        respondé ÚNICAMENTE con este formato JSON, sin texto adicional:
        {"accion": "agregar_carrito", "producto_id": ID_DEL_PRODUCTO, "mensaje": "Tu mensaje al usuario"}

        Para cualquier otra consulta respondé normalmente en texto.
    `
  })

  // 4. Iniciar chat con historial
  const chat = model.startChat({
    history: historial || []
  })

  // 5. Enviar mensaje y obtener respuesta
  const result = await chat.sendMessage(mensaje)
  const respuesta = result.response.text()

  return Response.json({ respuesta })
}