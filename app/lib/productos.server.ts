import { Product } from "./types"
import { createClient } from "./supabase/server"

export async function getProductos(categoria?: string): Promise<Product[]> {
	const supabase = await createClient()

	let query = supabase
		.from("productos")
		.select("*")
		.eq("active",true)
		.order("id")

	if (categoria && categoria !== "todas") {
		query = query.eq("category",categoria)
	}

	const { data,error } = await query
	if (error) console.error(error)
	return data as Product[] || []
}

export async function getProducto(id: number): Promise<Product | null> {
	const supabase = await createClient()

	const { data,error } = await supabase
		.from("productos")
		.select("*")
		.eq("id",id)
		.single()

	if (error) console.error(error)
	return data as Product || null
}

export async function getProductosPorCategorias(categorias: string[]) {
	const supabase = await createClient()

	const resultados = await Promise.all(
		categorias.map(async (cat) => {
			const { data } = await supabase
				.from("productos")
				.select("*")
				.eq("category",cat)
				.eq("active",true)
				.limit(6)
			return { categoria: cat,productos: data as Product[] || [] }
		})
	)

	return resultados
}