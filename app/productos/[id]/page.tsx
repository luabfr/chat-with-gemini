import NextImage from "next/image"
import Link from "next/link"
import AddToCartButton from "../../components/AddToCartButton"
import { getProducto } from "../../lib/productos.server"




export default async function ProductoDetalle({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const producto = await getProducto(Number(id))

	if (!producto) {
		return (
			<main style={{ maxWidth: 800,margin: "40px auto",padding: "0 20px",textAlign: "center" }}>
				<h1>Producto no encontrado</h1>
				<Link href="/productos" style={{ color: "#0070f3" }}>← Volver al catálogo</Link>
			</main>
		)
	}

	return (
		<main style={{ maxWidth: 1100,margin: "0 auto",padding: "40px 20px" }}>

			{/* Breadcrumb */}
			<nav style={{ marginBottom: 24,fontSize: 14,color: "#666" }}>
				<Link href="/" style={{ color: "#0070f3",textDecoration: "none" }}>Inicio</Link>
				{" / "}
				<Link href="/productos" style={{ color: "#0070f3",textDecoration: "none" }}>Productos</Link>
				{" / "}
				<Link
					href={`/productos?categoria=${producto.category}`}
					style={{ color: "#0070f3",textDecoration: "none",textTransform: "capitalize" }}
				>
					{producto.category}
				</Link>
				{" / "}
				<span style={{ color: "#333" }}>{producto.name}</span>
			</nav>

			{/* Layout principal */}
			<div style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr",
				gap: 48,
				alignItems: "start"
			}}>

				{/* Columna izquierda: imágenes */}
				<div>
					<div style={{
						position: "relative",
						height: 400,
						background: "#f5f5f5",
						borderRadius: 16,
						overflow: "hidden",
						marginBottom: 12
					}}>
						<NextImage 
							src={producto.images?.[0] || producto.thumbnail}
							alt={producto.name}
							fill
							style={{ objectFit: "contain",padding: 24 }}
							sizes="500px"
							priority
						/>
						{producto.discount > 5 && (
							<span style={{
								position: "absolute",
								top: 16,
								left: 16,
								background: "#e53e3e",
								color: "white",
								padding: "4px 10px",
								borderRadius: 20,
								fontSize: 13,
								fontWeight: 700
							}}>
								-{Math.round(producto.discount)}% OFF
							</span>
						)}
					</div>

					{producto.images?.length > 1 && (
						<div style={{ display: "flex",gap: 8,flexWrap: "wrap" }}>
							{producto.images.slice(0,5).map((img: string,i: number) => (
								<div key={i} style={{
									position: "relative",
									width: 72,
									height: 72,
									background: "#f5f5f5",
									borderRadius: 8,
									overflow: "hidden",
									border: "2px solid #e0e0e0"
								}}>
									<NextImage 
										src={img}
										alt={`${producto.name} ${i + 1}`}
										fill
										style={{ objectFit: "contain",padding: 4 }}
										sizes="72px"
									/>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Columna derecha: info */}
				<div>
					<span style={{
						fontSize: 12,
						textTransform: "uppercase",
						color: "#0070f3",
						fontWeight: 600,
						letterSpacing: 1
					}}>
						{producto.category}
					</span>

					<h1 style={{ margin: "8px 0 4px",fontSize: 28,fontWeight: 800,lineHeight: 1.2 }}>
						{producto.name}
					</h1>

					

					{/* <div style={{ display: "flex",alignItems: "center",gap: 8,marginBottom: 20 }}>
						<div style={{ display: "flex",gap: 2 }}>
							{[1,2,3,4,5].map((star) => (
								<span key={star} style={{
									color: star <= Math.round(producto.rating) ? "#f5a623" : "#e0e0e0",
									fontSize: 18
								}}>★</span>
							))}
						</div>
						<span style={{ fontSize: 14,color: "#666" }}>
							{producto.rating} · {producto.rating?.length || 0} reseñas
						</span>
					</div> */}

					<div style={{ marginBottom: 24 }}>
						<div style={{ display: "flex",alignItems: "baseline",gap: 12 }}>
							<span style={{ fontSize: 36,fontWeight: 800,color: "#1a1a1a" }}>
								${producto.price}
							</span>
							{producto.discount > 5 && (
								<span style={{ fontSize: 16,color: "#999",textDecoration: "line-through" }}>
									${(producto.price / (1 - producto.discount / 100)).toFixed(2)}
								</span>
							)}
						</div>
						{producto.discount > 5 && (
							<p style={{ margin: "4px 0 0",color: "#2e7d32",fontSize: 14,fontWeight: 600 }}>
								Ahorrás ${((producto.price / (1 - producto.discount / 100)) - producto.price).toFixed(2)}
							</p>
						)}
					</div>

					<div style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 6,
						background: producto.stock > 10 ? "#e8f5e9" : "#fff3e0",
						color: producto.stock > 10 ? "#2e7d32" : "#e65100",
						padding: "6px 12px",
						borderRadius: 20,
						fontSize: 13,
						fontWeight: 600,
						marginBottom: 24
					}}>
						{producto.stock > 10 ? "✓ En stock" : `⚠ Últimas ${producto.stock} unidades`}
					</div>

					<p style={{ color: "#444",lineHeight: 1.7,fontSize: 15,marginBottom: 32 }}>
						{producto.description}
					</p>

					<AddToCartButton producto={producto} />

					{/* {producto.tags?.length > 0 && (
						<div style={{ display: "flex",gap: 8,flexWrap: "wrap",marginTop: 24 }}>
							{producto.tags.map((tag: string) => (
								<span key={tag} style={{
									background: "#f5f5f5",
									color: "#666",
									padding: "4px 10px",
									borderRadius: 20,
									fontSize: 12
								}}>
									#{tag}
								</span>
							))}
						</div>
					)} */}
				</div>
			</div>

			{/* Reseñas */}
			{/* {producto.reviews?.length > 0 && (
				<section style={{ marginTop: 64 }}>
					<h2 style={{ fontSize: 22,fontWeight: 700,marginBottom: 24 }}>
						Reseñas ({producto.reviews.length})
					</h2>
					<div style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
						gap: 16
					}}>
						{producto.reviews.map((review: any,i: number) => (
							<div key={i} style={{
								background: "white",
								border: "1px solid #e0e0e0",
								borderRadius: 12,
								padding: 20
							}}>
								<div style={{ display: "flex",justifyContent: "space-between",marginBottom: 8 }}>
									<strong style={{ fontSize: 14 }}>{review.reviewerName}</strong>
									<div>
										{[1,2,3,4,5].map((star) => (
											<span key={star} style={{
												color: star <= review.rating ? "#f5a623" : "#e0e0e0",
												fontSize: 13
											}}>★</span>
										))}
									</div>
								</div>
								<p style={{ margin: 0,fontSize: 14,color: "#555",lineHeight: 1.6 }}>
									{review.comment}
								</p>
							</div>
						))}
					</div>
				</section>
			)} */}

		</main>
	)
}