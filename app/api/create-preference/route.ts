import { MercadoPagoConfig,Preference } from "mercadopago"
import { createClient } from "../../lib/supabase/server"

const client = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN!
})

export async function POST(req: Request) {
	try {
		const { carrito,form,totalPrecio } = await req.json()

		const supabase = await createClient()

		// Obtener usuario autenticado (puede ser null si no hay sesión)
		const { data: { user } } = await supabase.auth.getUser()

		// 1. Guardar orden en Supabase con estado "pendiente"
		const { data: orden,error: errorOrden } = await supabase
			.from("ordenes")
			.insert({
				user_id: user?.id ?? null,
				estado: "pendiente",
				total: totalPrecio,
				nombre_cliente: form.nombre,
				email_cliente: form.email,
				direccion_envio: form.direccion,
				ciudad: form.ciudad,
			})
			.select()
			.single()

		if (errorOrden || !orden) {
			console.error("Error creando orden:",errorOrden)
			return Response.json({ error: "Error al crear la orden" },{ status: 500 })
		}

		// 2. Guardar items de la orden
		const items = carrito.map((item: {
			id: number
			name: string
			cantidad: number
			price: number
		}) => ({
			orden_id: orden.id,
			producto_id: item.id,
			nombre_producto: item.name,
			cantidad: item.cantidad,
			precio_unitario: item.price,
		}))

		const { error: errorItems } = await supabase
			.from("order_items")
			.insert(items)

		if (errorItems) {
			console.error("Error guardando items:",errorItems)
			// No bloqueamos el flujo — la orden ya existe
		}

		// 3. Crear preferencia en MercadoPago
		const preference = new Preference(client)

		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://marketchat-ten.vercel.app"

		const result = await preference.create({
			body: {
				items: carrito.map((item: {
					id: number
					name: string
					cantidad: number
					price: number
					category: string
				}) => ({
					id: String(item.id),
					title: item.name,
					quantity: item.cantidad,
					unit_price: item.price,
					currency_id: "ARS",
					category_id: item.category,
				})),
				payer: {
					name: form.nombre,
					email: form.email,
				},
				back_urls: {
					success: `${baseUrl}/checkout/success?orden_id=${orden.id}`,
					failure: `${baseUrl}/checkout/failure?orden_id=${orden.id}`,
					pending: `${baseUrl}/checkout/success?orden_id=${orden.id}&pending=true`,
				},
				auto_return: "approved",
				external_reference: orden.id,
				notification_url: `${baseUrl}/api/webhook`,
			}
		})

		// 4. Guardar el preference_id en la orden
		await supabase
			.from("ordenes")
			.update({ mp_preference_id: result.id })
			.eq("id",orden.id)

		return Response.json({
			preference_id: result.id,
			init_point: result.init_point,        // producción
			sandbox_init_point: result.sandbox_init_point,  // sandbox/testing
		})

	} catch (error) {
		console.error("Error en create-preference:",error)
		return Response.json({ error: "Error interno del servidor" },{ status: 500 })
	}
}