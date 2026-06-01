import Link from "next/link"
import HomeProductCard from "./components/HomeProductCard"
import { getProductosPorCategorias } from "./lib/productos.server"
// import { getProducto } from "../../lib/productos.server"

const CATEGORIAS = [
  { id: "smartphones",label: "📱 Smartphones" },
  { id: "laptops",label: "💻 Laptops" },
  { id: "beauty",label: "✨ Beauty" },
  { id: "home-decoration",label: "🏠 Decoración" },
]

export default async function Home() {
  const secciones = await getProductosPorCategorias(CATEGORIAS.map(c => c.id))

  return (
    <main style={{ maxWidth: 1200,margin: "0 auto",padding: "40px 20px" }}>
      <div style={{
        background: "linear-gradient(135deg, #0070f3, #00c6ff)",
        borderRadius: 16,
        padding: "48px 40px",
        marginBottom: 48,
        color: "white"
      }}>
        <h1 style={{ margin: "0 0 8px",fontSize: 36,fontWeight: 800 }}>
          Bienvenido a MarketChat
        </h1>
        <p style={{ margin: "0 0 24px",fontSize: 18,opacity: 0.9 }}>
          Explorá miles de productos. Preguntale a Max si necesitás ayuda.
        </p>
        <Link href="/productos" style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "white",
          color: "#0070f3",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 700,
          fontSize: 15
        }}>
          Ver catálogo completo →
        </Link>
      </div>

      {secciones.map((seccion) => {
        const cat = CATEGORIAS.find(c => c.id === seccion.categoria)
        return (
          <section key={seccion.categoria} style={{ marginBottom: 48 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16
            }}>
              <h2 style={{ margin: 0,fontSize: 22,fontWeight: 700 }}>
                {cat?.label || seccion.categoria}
              </h2>
              <Link
                href={`/productos?categoria=${seccion.categoria}`}
                style={{ fontSize: 14,color: "#0070f3",textDecoration: "none",fontWeight: 500 }}
              >
                Ver todos →
              </Link>
            </div>
            <div style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 12,
              scrollbarWidth: "thin"
            }}>
              {seccion.productos.map((producto) => (
                <HomeProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}