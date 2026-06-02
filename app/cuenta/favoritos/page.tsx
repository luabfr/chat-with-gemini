export default function FavoritosPage() {
	return (
		<div style={{
			background: "white",
			border: "1px solid #e0e0e0",
			borderRadius: 12,
			padding: 32,
			textAlign: "center"
		}}>
			<p style={{ fontSize: 40,margin: "0 0 12px" }}>❤️</p>
			<h2 style={{ margin: "0 0 8px",fontSize: 20,fontWeight: 700 }}>
				Favoritos
			</h2>
			<p style={{ color: "#666",fontSize: 14 }}>
				Próximamente podés guardar tus productos favoritos acá
			</p>
		</div>
	)
}