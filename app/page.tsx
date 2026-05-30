import Image from "next/image"
import Link from "next/link"
import HomeProductCard from "./components/HomeProductCard"

const CATEGORIAS = [
  { id: "smartphones",label: "📱 Smartphones" },
  { id: "laptops",label: "💻 Laptops" },
  { id: "skincare",label: "✨ Skincare" },
  { id: "home-decoration",label: "🏠 Decoración" },
]

async function getProductosPorCategoria(categoria: string) {
  const res = await fetch(
    `https://dummyjson.com/products/category/${categoria}?limit=6`,
    { next: { revalidate: 3600 } }
  )
  const data = await res.json()
  return data.products
}

export default async function Home() {
  const secciones = await Promise.all(
    CATEGORIAS.map(async (cat) => ({
      ...cat,
      productos: await getProductosPorCategoria(cat.id)
    }))
  )

  return (
    <main style={{ maxWidth: 1200,margin: "0 auto",padding: "40px 20px" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0070f3, #00c6ff)",
        borderRadius: 16,
        padding: "48px 40px",
        marginBottom: 48,
        color: "white"
      }}>
        <h1 style={{ margin: "0 0 8px",fontSize: 36,fontWeight: 800 }}>
          🛒 Mi Tienda
        </h1>
        <p style={{ margin: "0 0 24px",fontSize: 18,opacity: 0.9 }}>
          Explorá miles de productos. Preguntale a Max si necesitás ayuda.
        </p>
        <Link
          href="/productos"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "white",
            color: "#0070f3",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15
          }}
        >
          Ver catálogo completo →
        </Link>
      </div>

      {/* Secciones por categoría */}
      {secciones.map((seccion) => (
        <section key={seccion.id} style={{ marginBottom: 48 }}>

          {/* Header de sección */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16
          }}>
            <h2 style={{ margin: 0,fontSize: 22,fontWeight: 700 }}>
              {seccion.label}
            </h2>
            <Link
              href={`/productos?categoria=${seccion.id}`}
              style={{
                fontSize: 14,
                color: "#0070f3",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Ver todos →
            </Link>
          </div>

          {/* Scroll horizontal */}
          <div style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingBottom: 12,
            scrollbarWidth: "thin",
          }}>
            {seccion.productos.map((producto: any) => (
              <HomeProductCard key={producto.id} producto={producto} />  // ← reemplazá la tarjeta inline
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}