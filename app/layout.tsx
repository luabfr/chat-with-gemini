import { CartProvider } from "./context/CartContext"
import Cart from "./components/Cart"
import ChatSidebar from "./components/ChatSidebar"
import Navbar from "./components/Navbar"
import "./globals.css"
import Script from "next/script"  
import Clarity from '@microsoft/clarity';
import { Analytics } from "@vercel/analytics/next"
import { FavoritosProvider } from "./context/FavoritosContext"  
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const projectId = "wzudpbde88"
  Clarity.init(projectId);



  return (
    <html lang="es">
      <body style={{ background: "#ffffff",color: "#1a1a1a",margin: 0 }}>
        <Analytics />
        <CartProvider>
          <FavoritosProvider> 
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
          </FavoritosProvider>
        </CartProvider>


        {/* Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wzudpbde88");
          `}
        </Script>
        <SpeedInsights />
      </body>
    </html>
  )
}