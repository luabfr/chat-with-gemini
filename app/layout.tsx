import { CartProvider } from "./context/CartContext"
import Cart from "./components/Cart"
import ChatSidebar from "./components/ChatSidebar"
import Navbar from "./components/Navbar"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ background: "#ffffff",color: "#1a1a1a",margin: 0 }}>
        <CartProvider>
          <Navbar />
          <div style={{
            display: "flex",
            minHeight: "calc(100vh - 64px)"
          }}>
            <ChatSidebar />
            <div style={{
              flex: 1,
              minWidth: 0,
              overflowY: "auto"
            }}>
              {children}
            </div>
          </div>
          <Cart />
        </CartProvider>
      </body>
    </html>
  )
}