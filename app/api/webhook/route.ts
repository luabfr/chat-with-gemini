import { MercadoPagoConfig,Payment } from "mercadopago"
import { createClient } from "../../lib/supabase/server"

const client = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN!
})

export async function POST(req: Request) {
	try {
		const body = await req.json()

		// MP manda distintos tipos de notificaciones
		// Solo nos interesan las de "payment"
		if (body.type !== "payment") {
			return Response.json({ ok: true })
		}

		const paymentId = body.data?.id
		if (!paymentId) return Response.json({ ok: true })

		// Consultar el pago a MP para obtener el estado real
		const payment = new Payment(client)
		const pagoData = await payment.get({ id: paymentId })

		const ordenId = pagoData.external_reference
		const mpStatus = pagoData.status  // approved | pending | rejected | cancelled

		if (!ordenId) return Response.json({ ok: true })

		// Mapear estado de MP a estado interno
		const estadoMap: Record<string,string> = {
			approved: "pagado",
			pending: "pendiente",
			in_process: "pendiente",
			rejected: "cancelado",
			cancelled: "cancelado",
		}

		const nuevoEstado = estadoMap[mpStatus ?? ""] ?? "pendiente"

		const supabase = await createClient()

		await supabase
			.from("ordenes")
			.update({
				estado: nuevoEstado,
				mp_payment_id: String(paymentId),
			})
			.eq("id",ordenId)

		return Response.json({ ok: true })

	} catch (error) {
		console.error("Error en webhook:",error)
		// Siempre devolver 200 a MP para que no reintente indefinidamente
		return Response.json({ ok: true })
	}
}

// MP también hace GET para validar el endpoint
export async function GET() {
	return Response.json({ ok: true })
}