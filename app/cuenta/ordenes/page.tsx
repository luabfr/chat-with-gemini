import { createClient } from "../../lib/supabase/server"
import { redirect } from "next/navigation"

export default async function OrdenesPage() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()
	if (!user) redirect("/login")

	const { data: ordenes } = await supabase
		.from("ordenes")
		.select(`*, order_items(*)`)
		.eq("user_id",user.id)
		.order("created_at",{ ascending: false })

	const estadoColor: Record<string,string> = {
		pendiente: "#f5a623",
		pagado: "#0070f3",
		enviado: "#7c3aed",
		entregado: "#2e7d32",
		cancelado: "#e53e3e"
	}

	return (
		<div style={{
			background: "white",
			border: "1px solid #e0e0e0",
			borderRadius: 12,
			padding: 32
		}}>
			<h2 style={{ margin: "0 0 24px",fontSize: 20,fontWeight: 700 }}>
				Mis órdenes
			</h2>

			{!ordenes || ordenes.length === 0 ? (
				<div style={{ textAlign: "center",padding: "60px 0",color: "#999" }}>
					<p style={{ fontSize: 40,margin: "0 0 12px" }}>📦</p>
					<p style={{ fontSize: 15,fontWeight: 600,color: "#333",margin: "0 0 8px" }}>
						Todavía no tenés órdenes
					</p>
					<p style={{ fontSize: 13,margin: 0 }}>
						Cuando hagas una compra va a aparecer acá
					</p>
				</div>
			) : (
				<div style={{ display: "flex",flexDirection: "column",gap: 16 }}>
					{ordenes.map((orden) => (
						<div key={orden.id} style={{
							border: "1px solid #e0e0e0",
							borderRadius: 12,
							padding: 20
						}}>
							<div style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 12
							}}>
								<div>
									<p style={{ margin: 0,fontSize: 13,color: "#666" }}>
										Orden #{orden.id.slice(0,8).toUpperCase()}
									</p>
									<p style={{ margin: "2px 0 0",fontSize: 12,color: "#999" }}>
										{new Date(orden.created_at).toLocaleDateString("es-AR",{
											day: "numeric",
											month: "long",
											year: "numeric"
										})}
									</p>
								</div>
								<div style={{ display: "flex",alignItems: "center",gap: 12 }}>
									<span style={{
										background: `${estadoColor[orden.estado]}20`,
										color: estadoColor[orden.estado],
										padding: "4px 12px",
										borderRadius: 20,
										fontSize: 12,
										fontWeight: 700,
										textTransform: "capitalize"
									}}>
										{orden.estado}
									</span>
									<span style={{ fontWeight: 700,fontSize: 16 }}>
										${orden.total.toFixed(2)}
									</span>
								</div>
							</div>

							<div style={{ fontSize: 13,color: "#666" }}>
								{orden.order_items?.length} producto{orden.order_items?.length !== 1 ? "s" : ""}
								{orden.direccion_envio && ` · ${orden.direccion_envio}, ${orden.ciudad}`}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}