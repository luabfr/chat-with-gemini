import { createClient } from "./supabase/client"

export async function seedProductos() {
	const supabase = createClient()

	const CATEGORIAS = [
		"smartphones","laptops","beauty",
		"home-decoration","fragrances","groceries"
	]

	const resultados = await Promise.all(
		CATEGORIAS.map(cat =>
			fetch(`https://dummyjson.com/products/category/${cat}?limit=10`)
				.then(r => r.json())
				.then(d => d.products)
		)
	)

	const productos = resultados.flat().map((p: any) => ({
		nombre: p.title,
		descripcion: p.description,
		precio: p.price,
		stock: p.stock,
		categoria: p.category,
		thumbnail: p.thumbnail,
		imagenes: p.images,
		descuento: p.discountPercentage,
		rating: p.rating,
		activo: true
	}))

	const { error } = await supabase
		.from("productos")
		.insert(productos)

	if (error) console.error("Error seeding:",error)
	else console.log(`✅ ${productos.length} productos insertados`)
}