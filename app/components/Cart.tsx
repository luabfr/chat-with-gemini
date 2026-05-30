"use client"
import { useState } from "react"
import { useCart } from "../context/CartContext"
import NextImage from "next/image"

export default function Cart() {
	const [abierto,setAbierto] = useState(false)
	const { carrito,quitarDelCarrito,agregarAlCarrito,vaciarCarrito,totalItems,totalPrecio } = useCart()

	return (
		<>
			{/* Botón flotante */}
			<button
				onClick={() => setAbierto(true)}
				style={{
					position: "fixed",
					bottom: 24,
					right: 24,
					background: "#0070f3",
					color: "white",
					border: "none",
					borderRadius: "50%",
					width: 56,
					height: 56,
					fontSize: 22,
					cursor: "pointer",
					boxShadow: "0 4px 16px rgba(0,112,243,0.4)",
					zIndex: 100
				}}
			>
				🛒
				{totalItems > 0 && (
					<span style={{
						position: "absolute",
						top: -4,
						right: -4,
						background: "#e53e3e",
						color: "white",
						borderRadius: "50%",
						width: 20,
						height: 20,
						fontSize: 11,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontWeight: 700
					}}>
						{totalItems}
					</span>
				)}
			</button>

			{/* Panel del carrito */}
			{abierto && (
				<div style={{
					position: "fixed",
					inset: 0,
					zIndex: 200,
					display: "flex",
					justifyContent: "flex-end"
				}}>
					{/* Overlay */}
					<div
						onClick={() => setAbierto(false)}
						style={{ flex: 1,background: "rgba(0,0,0,0.3)" }}
					/>

					{/* Panel */}
					<div style={{
						width: 380,
						background: "white",
						height: "100%",
						overflowY: "auto",
						padding: 24,
						display: "flex",
						flexDirection: "column"
					}}>
						<div style={{ display: "flex",justifyContent: "space-between",alignItems: "center",marginBottom: 24 }}>
							<h2 style={{ margin: 0 }}>🛒 Carrito ({totalItems})</h2>
							<button
								onClick={() => setAbierto(false)}
								style={{ background: "none",border: "none",fontSize: 20,cursor: "pointer" }}
							>
								✕
							</button>
						</div>

						{carrito.length === 0 ? (
							<p style={{ color: "#999",textAlign: "center",marginTop: 60 }}>
								El carrito está vacío
							</p>
						) : (
							<>
									{carrito.map(item => (
										<div
											key={item.id}
											style={{
												display: "flex",
												gap: 12,
												padding: "12px 0",
												borderBottom: "1px solid #f0f0f0"
											}}
										>
											<NextImage
												src={item.thumbnail}
												alt={item.title}
												width={60}
												height={60}
												style={{
													objectFit: "contain",
													background: "#f5f5f5",
													borderRadius: 8
												}}
											/>
											<div style={{ flex: 1 }}>
												<p style={{ margin: "0 0 4px",fontSize: 14,fontWeight: 600 }}>
													{item.title}
												</p>
												<p style={{ margin: "0 0 8px",fontSize: 13,color: "#666" }}>
													${item.price} × {item.cantidad} ={" "}
													<strong>${(item.price * item.cantidad).toFixed(2)}</strong>
												</p>
												<div style={{ display: "flex",gap: 8,alignItems: "center" }}>
													<button
														onClick={() => quitarDelCarrito(item.id)}
														style={{
															width: 28,
															height: 28,
															borderRadius: 4,
															border: "1px solid #e0e0e0",
															background: "white",
															cursor: "pointer",
															fontSize: 16,
															display: "flex",
															alignItems: "center",
															justifyContent: "center"
														}}
													>
														−
													</button>
													<span style={{ fontSize: 14,minWidth: 20,textAlign: "center" }}>
														{item.cantidad}
													</span>
													<button
														onClick={() => agregarAlCarrito({
															id: item.id,
															title: item.title,
															price: item.price,
															thumbnail: item.thumbnail,
															category: item.category
														})}
														style={{
															width: 28,
															height: 28,
															borderRadius: 4,
															border: "1px solid #e0e0e0",
															background: "white",
															cursor: "pointer",
															fontSize: 16,
															display: "flex",
															alignItems: "center",
															justifyContent: "center"
														}}
													>
														+
													</button>
												</div>
											</div>
										</div>
									))}

								<div style={{ marginTop: "auto",paddingTop: 20 }}>
									<div style={{ display: "flex",justifyContent: "space-between",marginBottom: 16 }}>
										<span style={{ fontWeight: 600,fontSize: 16 }}>Total</span>
										<span style={{ fontWeight: 700,fontSize: 20 }}>${totalPrecio.toFixed(2)}</span>
									</div>
									<button style={{
										width: "100%",
										padding: 14,
										background: "#0070f3",
										color: "white",
										border: "none",
										borderRadius: 8,
										fontSize: 16,
										fontWeight: 600,
										cursor: "pointer",
										marginBottom: 8
									}}>
										Finalizar compra
									</button>
									<button
										onClick={vaciarCarrito}
										style={{
											width: "100%",
											padding: 14,
											background: "white",
											color: "#e53e3e",
											border: "1px solid #e53e3e",
											borderRadius: 8,
											fontSize: 14,
											cursor: "pointer"
										}}
									>
										Vaciar carrito
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</>
	)
}