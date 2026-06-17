"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

// export default function CheckoutFailure() {
function CheckoutFailureContent() {
	const searchParams = useSearchParams()
	const ordenId = searchParams.get("orden_id")

	return (
		<main style={{ maxWidth: 600,margin: "80px auto",padding: "0 20px",textAlign: "center" }}>
			<div style={{
				background: "white",
				border: "1px solid #e0e0e0",
				borderRadius: 16,
				padding: 48
			}}>
				<p style={{ fontSize: 64,margin: "0 0 16px" }}>❌</p>
				<h1 style={{ margin: "0 0 8px",fontSize: 28 }}>El pago no se completó</h1>
				<p style={{ color: "#666",marginBottom: 24,fontSize: 15 }}>
					No se realizó ningún cargo. Podés intentarlo de nuevo o elegir otro método de pago.
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
					background: "#fef2f2",
					border: "1px solid #fecaca",
					borderRadius: 8,
					padding: 16,
					marginBottom: 32,
					fontSize: 14,
					color: "#991b1b",
					textAlign: "left"
				}}>
					<p style={{ margin: "0 0 4px" }}>Posibles motivos:</p>
					<ul style={{ margin: "8px 0 0",paddingLeft: 20 }}>
						<li>Fondos insuficientes</li>
						<li>Tarjeta rechazada por el banco</li>
						<li>Cancelaste el pago manualmente</li>
					</ul>
				</div>

				<div style={{ display: "flex",gap: 12,justifyContent: "center" }}>
					<Link
						href="/checkout"
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
						Reintentar pago
					</Link>
					<Link
						href="/productos"
						style={{
							display: "inline-block",
							padding: "12px 24px",
							background: "white",
							color: "#333",
							border: "1px solid #e0e0e0",
							borderRadius: 8,
							textDecoration: "none",
							fontWeight: 600,
							fontSize: 14
						}}
					>
						Ver productos
					</Link>
				</div>
			</div>
		</main>
	)
}


export default function Page() {
	return (
		<Suspense>
			<CheckoutFailureContent />
		</Suspense>
	)
}