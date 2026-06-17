"use client"
import { useState } from "react"
// import { useRouter } from "next/navigation"
import Link from "next/link"
import NextImage from "next/image"
import { useCart } from "../context/CartContext"

type Paso = "carrito" | "datos"

export default function Checkout() {
	const { carrito,totalItems,totalPrecio } = useCart()
	const [paso,setPaso] = useState<Paso>("carrito")
	const [form,setForm] = useState({
		nombre: "",
		email: "",
		direccion: "",
		ciudad: "",
	})
	const [errores,setErrores] = useState<Record<string,string>>({})
	const [cargando,setCargando] = useState(false)
	// const router = useRouter()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form,[e.target.name]: e.target.value })
		setErrores({ ...errores,[e.target.name]: "" })
	}

	const validar = () => {
		const nuevosErrores: Record<string,string> = {}
		if (!form.nombre.trim()) nuevosErrores.nombre = "Requerido"
		if (!form.email.includes("@")) nuevosErrores.email = "Email inválido"
		if (!form.direccion.trim()) nuevosErrores.direccion = "Requerido"
		if (!form.ciudad.trim()) nuevosErrores.ciudad = "Requerido"
		setErrores(nuevosErrores)
		return Object.keys(nuevosErrores).length === 0
	}

	const pagarConMP = async () => {
		if (!validar()) return
		setCargando(true)

		try {
			const res = await fetch("/api/create-preference",{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ carrito,form,totalPrecio }),
			})

			const data = await res.json()

			if (!res.ok || data.error) {
				alert("Hubo un error al iniciar el pago. Intentá de nuevo.")
				setCargando(false)
				return
			}

			// En sandbox usamos sandbox_init_point, en producción init_point
			const url = process.env.NODE_ENV === "production"
				? data.init_point
				: data.sandbox_init_point

			// Redirigir a MercadoPago
			window.location.href = url

		} catch (error) {
			console.error("Error al crear preferencia:",error)
			alert("Hubo un error. Intentá de nuevo.")
			setCargando(false)
		}
	}

	if (carrito.length === 0) {
		return (
			<main style={{ maxWidth: 600,margin: "80px auto",padding: "0 20px",textAlign: "center" }}>
				<p style={{ fontSize: 48,marginBottom: 16 }}>🛒</p>
				<h1 style={{ marginBottom: 8 }}>Tu carrito está vacío</h1>
				<p style={{ color: "#666",marginBottom: 32 }}>Agregá productos antes de continuar</p>
				<Link href="/productos" style={{
					display: "inline-block",
					padding: "12px 28px",
					background: "#0070f3",
					color: "white",
					borderRadius: 8,
					textDecoration: "none",
					fontWeight: 600
				}}>
					Ver productos
				</Link>
			</main>
		)
	}

	const inputStyle = (campo: string) => ({
		width: "100%",
		padding: "10px 14px",
		borderRadius: 8,
		border: `1px solid ${errores[campo] ? "#e53e3e" : "#e0e0e0"}`,
		fontSize: 14,
		outline: "none",
		boxSizing: "border-box" as const,
		marginTop: 4
	})

	return (
		<main style={{ maxWidth: 1000,margin: "0 auto",padding: "40px 20px" }}>
			<h1 style={{ marginBottom: 32,fontSize: 28,fontWeight: 800 }}>Checkout</h1>

			{/* Indicador de pasos */}
			<div style={{ display: "flex",alignItems: "center",marginBottom: 40,gap: 0 }}>
				{(["carrito","datos"] as Paso[]).map((p,i) => (
					<div key={p} style={{ display: "flex",alignItems: "center",flex: i < 1 ? 1 : 0 }}>
						<div style={{
							width: 32,
							height: 32,
							borderRadius: "50%",
							background: paso === p ? "#0070f3" : (paso === "datos" && p === "carrito") ? "#e8f5e9" : "#f0f0f0",
							color: paso === p ? "white" : "#666",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 13,
							fontWeight: 700,
							flexShrink: 0
						}}>
							{(paso === "datos" && p === "carrito") ? "✓" : i + 1}
						</div>
						<span style={{
							marginLeft: 8,
							fontSize: 13,
							fontWeight: paso === p ? 700 : 400,
							color: paso === p ? "#0070f3" : "#666",
							whiteSpace: "nowrap"
						}}>
							{p === "carrito" ? "Resumen" : "Tus datos"}
						</span>
						{i < 1 && (
							<div style={{ flex: 1,height: 1,background: "#e0e0e0",margin: "0 12px" }} />
						)}
					</div>
				))}
			</div>

			<div style={{ display: "grid",gridTemplateColumns: "1fr 360px",gap: 32,alignItems: "start" }}>

				{/* Columna izquierda */}
				<div>
					{paso === "carrito" && (
						<div>
							<h2 style={{ fontSize: 18,fontWeight: 700,marginBottom: 16 }}>
								Productos ({totalItems})
							</h2>
							<div style={{
								background: "white",
								border: "1px solid #e0e0e0",
								borderRadius: 12,
								overflow: "hidden",
								marginBottom: 24
							}}>
								{carrito.map((item,i) => (
									<div key={item.id} style={{
										display: "flex",
										gap: 16,
										padding: 16,
										borderBottom: i < carrito.length - 1 ? "1px solid #f0f0f0" : "none",
										alignItems: "center"
									}}>
										<div style={{
											position: "relative",
											width: 64,
											height: 64,
											background: "#f5f5f5",
											borderRadius: 8,
											flexShrink: 0,
											overflow: "hidden"
										}}>
											<NextImage
												src={item.thumbnail}
												alt={item.name}
												fill
												style={{ objectFit: "contain",padding: 4 }}
												sizes="64px"
											/>
										</div>
										<div style={{ flex: 1 }}>
											<p style={{ margin: "0 0 4px",fontWeight: 600,fontSize: 14 }}>{item.name}</p>
											<p style={{ margin: 0,fontSize: 13,color: "#666" }}>
												Cantidad: {item.cantidad}
											</p>
										</div>
										<span style={{ fontWeight: 700,fontSize: 15 }}>
											${(item.price * item.cantidad).toFixed(2)}
										</span>
									</div>
								))}
							</div>
							<button
								onClick={() => setPaso("datos")}
								style={{
									width: "100%",
									padding: 14,
									background: "#0070f3",
									color: "white",
									border: "none",
									borderRadius: 8,
									fontSize: 16,
									fontWeight: 700,
									cursor: "pointer"
								}}
							>
								Continuar →
							</button>
						</div>
					)}

					{paso === "datos" && (
						<div>
							<h2 style={{ fontSize: 18,fontWeight: 700,marginBottom: 20 }}>
								Datos de envío
							</h2>

							<div style={{
								background: "white",
								border: "1px solid #e0e0e0",
								borderRadius: 12,
								padding: 24,
								marginBottom: 24
							}}>
								<h3 style={{ margin: "0 0 16px",fontSize: 15,fontWeight: 700 }}>📦 Envío</h3>
								<div style={{ display: "grid",gap: 12 }}>
									<div>
										<label style={{ fontSize: 13,fontWeight: 600,color: "#333" }}>Nombre completo</label>
										<input name="nombre" value={form.nombre} onChange={handleChange} style={inputStyle("nombre")} placeholder="Juan Pérez" />
										{errores.nombre && <p style={{ color: "#e53e3e",fontSize: 12,margin: "4px 0 0" }}>{errores.nombre}</p>}
									</div>
									<div>
										<label style={{ fontSize: 13,fontWeight: 600,color: "#333" }}>Email</label>
										<input name="email" value={form.email} onChange={handleChange} style={inputStyle("email")} placeholder="juan@email.com" />
										{errores.email && <p style={{ color: "#e53e3e",fontSize: 12,margin: "4px 0 0" }}>{errores.email}</p>}
									</div>
									<div>
										<label style={{ fontSize: 13,fontWeight: 600,color: "#333" }}>Dirección</label>
										<input name="direccion" value={form.direccion} onChange={handleChange} style={inputStyle("direccion")} placeholder="Av. Corrientes 1234" />
										{errores.direccion && <p style={{ color: "#e53e3e",fontSize: 12,margin: "4px 0 0" }}>{errores.direccion}</p>}
									</div>
									<div>
										<label style={{ fontSize: 13,fontWeight: 600,color: "#333" }}>Ciudad</label>
										<input name="ciudad" value={form.ciudad} onChange={handleChange} style={inputStyle("ciudad")} placeholder="Buenos Aires" />
										{errores.ciudad && <p style={{ color: "#e53e3e",fontSize: 12,margin: "4px 0 0" }}>{errores.ciudad}</p>}
									</div>
								</div>
							</div>

							{/* Info MP */}
							<div style={{
								background: "#f0f7ff",
								border: "1px solid #bfdbfe",
								borderRadius: 12,
								padding: "14px 18px",
								marginBottom: 24,
								display: "flex",
								alignItems: "center",
								gap: 12,
								fontSize: 13,
								color: "#1e40af"
							}}>
								<span style={{ fontSize: 20 }}>🔒</span>
								<span>El pago se procesa de forma segura a través de <strong>MercadoPago</strong>. Aceptamos tarjetas, débito y más.</span>
							</div>

							<div style={{ display: "flex",gap: 12 }}>
								<button
									onClick={() => setPaso("carrito")}
									disabled={cargando}
									style={{
										flex: 1,
										padding: 14,
										background: "white",
										color: "#333",
										border: "1px solid #e0e0e0",
										borderRadius: 8,
										fontSize: 15,
										fontWeight: 600,
										cursor: cargando ? "not-allowed" : "pointer"
									}}
								>
									← Volver
								</button>
								<button
									onClick={pagarConMP}
									disabled={cargando}
									style={{
										flex: 2,
										padding: 14,
										background: cargando ? "#93c5fd" : "#009ee3",  // azul MP
										color: "white",
										border: "none",
										borderRadius: 8,
										fontSize: 15,
										fontWeight: 700,
										cursor: cargando ? "not-allowed" : "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: 8,
										transition: "background 0.2s"
									}}
								>
									{cargando ? (
										<>
											<span style={{
												width: 16,height: 16,
												border: "2px solid rgba(255,255,255,0.4)",
												borderTopColor: "white",
												borderRadius: "50%",
												display: "inline-block",
												animation: "spin 0.8s linear infinite"
											}} />
											Iniciando pago...
										</>
									) : (
										<>Pagar con MercadoPago</>
									)}
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Resumen lateral */}
				<div style={{
					background: "white",
					border: "1px solid #e0e0e0",
					borderRadius: 12,
					padding: 24,
					position: "sticky",
					top: 80
				}}>
					<h3 style={{ margin: "0 0 16px",fontSize: 16,fontWeight: 700 }}>Resumen</h3>
					<div style={{ display: "flex",justifyContent: "space-between",marginBottom: 8,fontSize: 14,color: "#666" }}>
						<span>Productos ({totalItems})</span>
						<span>${totalPrecio.toFixed(2)}</span>
					</div>
					<div style={{ display: "flex",justifyContent: "space-between",marginBottom: 8,fontSize: 14,color: "#666" }}>
						<span>Envío</span>
						<span style={{ color: "#2e7d32",fontWeight: 600 }}>Gratis</span>
					</div>
					<div style={{
						borderTop: "1px solid #e0e0e0",
						marginTop: 16,
						paddingTop: 16,
						display: "flex",
						justifyContent: "space-between"
					}}>
						<span style={{ fontWeight: 700,fontSize: 16 }}>Total</span>
						<span style={{ fontWeight: 800,fontSize: 20,color: "#0070f3" }}>
							${totalPrecio.toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		</main>
	)
}