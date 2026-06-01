import { Product } from "./types"
import { createClient as createBrowserClient } from "./supabase/client"

// ✅ Solo usa el cliente del browser, funciona en Client y Server Components
export async function buscarProductosCliente(query: string): Promise<Product[]> {
	const supabase = createBrowserClient()

	const { data,error } = await supabase
		.from("productos")
		.select("*")
		.eq("active",true)
		.or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
		.limit(6)

	if (error) console.error(error)
	return data as Product[] || []
}