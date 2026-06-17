// import { MercadoPagoConfig } from "mercadopago"
import { createClient } from "../../lib/supabase/server"

// const client = new MercadoPagoConfig({
// 	accessToken: process.env.MP_ACCESS_TOKEN!
// })
export async function POST(req: Request) {
	try {
		const body = await req.json()
		console.log("Webhook recibido:",JSON.stringify(body))

		if (body.type !== "payment") {
			return Response.json({ ok: true })
		}

		const paymentId = body.data?.id
		if (!paymentId) return Response.json({ ok: true })

		// Consultar el pago directamente a MP
		const mpRes = await fetch(
			`https://api.mercadopago.com/v1/payments/${paymentId}`,
			{ headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
		)
		const pagoData = await mpRes.json()
		console.log("Pago data:",JSON.stringify(pagoData))

		const ordenId = pagoData.external_reference
		const mpStatus = pagoData.status

		if (!ordenId || !mpStatus) return Response.json({ ok: true })

		const estadoMap: Record<string,string> = {
			approved: "pagado",
			pending: "pendiente",
			in_process: "pendiente",
			rejected: "cancelado",
			cancelled: "cancelado",
		}

		const nuevoEstado = estadoMap[mpStatus] ?? "pendiente"

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
		return Response.json({ ok: true })
	}
}

// MP también hace GET para validar el endpoint
export async function GET() {
	return Response.json({ ok: true })
}