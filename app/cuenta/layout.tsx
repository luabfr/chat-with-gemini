import { createClient } from "../lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CuentaLayout({
	children
}: {
	children: React.ReactNode
}) {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) redirect("/login")

	return (
		<div style={{ maxWidth: 1100,margin: "0 auto",padding: "40px 20px" }}>
			<h1 style={{ margin: "0 0 32px",fontSize: 28,fontWeight: 800 }}>
				Mi cuenta
			</h1>
			<div style={{ display: "grid",gridTemplateColumns: "220px 1fr",gap: 32,alignItems: "start" }}>

				{/* Sidebar */}
				<aside style={{
					background: "white",
					border: "1px solid #e0e0e0",
					borderRadius: 12,
					overflow: "hidden",
					position: "sticky",
					top: 80
				}}>
					{/* Avatar */}
					<div style={{
						padding: "24px 20px",
						borderBottom: "1px solid #f0f0f0",
						background: "#fafafa"
					}}>
						<div style={{
							width: 48,
							height: 48,
							borderRadius: "50%",
							background: "#0070f3",
							color: "white",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 20,
							fontWeight: 700,
							marginBottom: 8
						}}>
							{user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()}
						</div>
						<p style={{ margin: 0,fontWeight: 700,fontSize: 14,color: "#1a1a1a" }}>
							{user.user_metadata?.full_name || "Usuario"}
						</p>
						<p style={{ margin: 0,fontSize: 12,color: "#666" }}>
							{user.email}
						</p>
					</div>

					{/* Links */}
					{[
						{ href: "/cuenta",label: "👤 Mi perfil" },
						{ href: "/cuenta/ordenes",label: "📦 Mis órdenes" },
						{ href: "/cuenta/favoritos",label: "❤️ Favoritos" },
					].map(({ href,label }) => (
						<Link
							key={href}
							href={href}
							style={{
								display: "block",
								padding: "14px 20px",
								textDecoration: "none",
								color: "#333",
								fontSize: 14,
								fontWeight: 500,
								borderBottom: "1px solid #f0f0f0",
								transition: "background 0.15s"
							}}
						>
							{label}
						</Link>
					))}
				</aside>

				{/* Contenido */}
				<div>{children}</div>
			</div>
		</div>
	)
}