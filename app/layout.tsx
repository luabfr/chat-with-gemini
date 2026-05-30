import { CartProvider } from "./context/CartContext"
import Cart from "./components/Cart"
import FloatingChat from "./components/FloatingChat"
import Navbar from "./components/Navbar"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
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