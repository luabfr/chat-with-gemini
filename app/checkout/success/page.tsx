"use client"
import { useEffect,useState,useRef,Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "../../context/CartContext"

// export default function CheckoutSuccess() {
function CheckoutSuccessContent() {
	const searchParams = useSearchParams()
	const ordenId = searchParams.get("orden_id")
	const pending = searchParams.get("pending")
	const { vaciarCarrito } = useCart()
	
	const vaciado = useRef(false)

	useEffect(() => {
		if (!vaciado.current) {
			vaciado.current = true
			vaciarCarrito()
		}
	},[])

	const esPendiente = pending === "true"

	return (
		<main style={{ maxWidth: 600,margin: "80px auto",padding: "0 20px",textAlign: "center" }}>
			<div style={{
				background: "white",
				border: "1px solid #e0e0e0",
				borderRadius: 16,
				padding: 48
			}}>
				<p style={{ fontSize: 64,margin: "0 0 16px" }}>
					{esPendiente ? "⏳" : "✅"}
				</p>
				<h1 style={{ margin: "0 0 8px",fontSize: 28 }}>
					{esPendiente ? "Pago en proceso" : "¡Pago exitoso!"}
				</h1>
				<p style={{ color: "#666",marginBottom: 8,fontSize: 15 }}>
					{esPendiente
						? "Tu pago está siendo procesado. Te notificaremos cuando se confirme."
						: "Tu pedido fue confirmado y está siendo preparado."
					}
				</p>

				{ordenId && (
					<div style={{
						background: "#f9f9f9",
						borderRadius: 8,
						padding: "10px 16px",
						marginBottom: 24,
						fontSize: 13,
						color: "#666",
						display: "inline-block"
					}}>
						Orden <strong style={{ color: "#333",fontFamily: "monospace" }}>#{ordenId.slice(0,8).toUpperCase()}</strong>
					</div>
				)}

				<div style={{
					background: esPendiente ? "#fffbeb" : "#f0fdf4",
					border: `1px solid ${esPendiente ? "#fde68a" : "#bbf7d0"}`,
					borderRadius: 8,
					padding: 16,
					marginBottom: 32,
					fontSize: 14,
					color: esPendiente ? "#92400e" : "#166534",
					textAlign: "left"
				}}>
					<p style={{ margin: "0 0 4px" }}>
						📦 Entrega estimada: 3-5 días hábiles
					</p>
					<p style={{ margin: 0 }}>
						{esPendiente
							? "🔔 Te avisaremos por email cuando el pago se acredite."
							: "📧 Vas a recibir un email con los detalles del pedido."
						}
					</p>
				</div>

				<div style={{ display: "flex",gap: 12,justifyContent: "center" }}>
					<Link
						href="/cuenta/ordenes"
						style={{
							display: "inline-block",
							padding: "12px 24px",
							background: "white",
							color: "#0070f3",
							border: "1px solid #0070f3",
							borderRadius: 8,
							textDecoration: "none",
							fontWeight: 600,
							fontSize: 14
						}}
					>
						Ver mis órdenes
					</Link>
					<Link
						href="/"
						style={{
							display: "inline-block",
							padding: "12px 24px",
							background: "#0070f3",
							color: "white",
							borderRadius: 8,
							textDecoration: "none",
							fontWeight: 600,
							fontSize: 14
						}}
					>
						Volver al inicio
					</Link>
				</div>
			</div>
		</main>
	)
}


// Y el export default pasa a ser el wrapper:
export default function Page() {
	return (
		<Suspense>
			<CheckoutSuccessContent />
		</Suspense>
	)
}