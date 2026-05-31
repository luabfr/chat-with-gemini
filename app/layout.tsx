import { CartProvider } from "./context/CartContext"
import Cart from "./components/Cart"
import FloatingChat from "./components/FloatingChat"
import Navbar from "./components/Navbar"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ background: "#ffffff",color: "#1a1a1a",margin: 0 }}>
        <CartProvider>
          <Navbar />
          {children}
          <Cart />
          <FloatingChat />
        </CartProvider>
      </body>
    </html>
  )
}