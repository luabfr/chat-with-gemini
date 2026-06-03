"use client"
import { createContext,useContext,useState,useEffect,ReactNode } from "react"
import { createClient } from "../lib/supabase/client"

interface FavoritosContextType {
	favoritos: number[]                          // array de producto_id
	toggleFavorito: (productoId: number) => Promise<void>
	esFavorito: (productoId: number) => boolean
	cargando: boolean
}

const FavoritosContext = createContext<FavoritosContextType | null>(null)

export function FavoritosProvider({ children }: { children: ReactNode }) {
	const [favoritos,setFavoritos] = useState<number[]>([])
	const [cargando,setCargando] = useState(true)
	const [userId,setUserId] = useState<string | null>(null)
	const supabase = createClient()

	// Cargar sesión y favoritos al montar
	useEffect(() => {
		const init = async () => {
			const { data, error } = await supabase.auth.getUser()
			if (error) {
				console.error("Error al obtener usuario de Supabase:", error)
				setCargando(false)
				return
			}

			const user = data?.user
			if (!user) {
				setCargando(false)
				return
			}

			setUserId(user.id)

			const { data: favoritosData, error: favoritosError } = await supabase
				.from("favoritos")
				.select("producto_id")
				.eq("user_id", user.id)

			if (favoritosError) {
				console.error("Error al cargar favoritos:", favoritosError)
				setFavoritos([])
			} else {
				setFavoritos((favoritosData || []).map(f => f.producto_id))
			}

			setCargando(false)
	}

		init()

		// Escuchar cambios de sesión (login/logout)
		const { data: listener } = supabase.auth.onAuthStateChange((_event,session) => {
			if (session?.user) {
				setUserId(session.user.id)
				// Recargar favoritos al hacer login
				supabase
					.from("favoritos")
					.select("producto_id")
					.eq("user_id", session.user.id)
					.then(({ data, error }) => {
						if (error) {
							console.error("Error al recargar favoritos:", error)
							return
						}
						setFavoritos((data || []).map(f => f.producto_id))
					})
			} else {
				setUserId(null)
				setFavoritos([])
			}
		})

		return () => listener.subscription.unsubscribe()
	},[])

	const esFavorito = (productoId: number) => favoritos.includes(productoId)

	const toggleFavorito = async (productoId: number) => {
		if (!userId) {
			return
		}

		const yaEsFavorito = esFavorito(productoId)

		// Optimistic update
		setFavoritos(prev =>
			yaEsFavorito
				? prev.filter(id => id !== productoId)
				: [...prev,productoId]
		)

		if (yaEsFavorito) {
			const { error } = await supabase
				.from("favoritos")
				.delete()
				.eq("user_id", userId)
				.eq("producto_id", productoId)

			if (error) {
				setFavoritos(prev => [...prev, productoId])
				console.error("Error al quitar favorito:", error)
			}
		} else {
			const { error } = await supabase
				.from("favoritos")
				.upsert({ user_id: userId, producto_id: productoId }, { onConflict: "user_id,producto_id" })

			if (error) {
				setFavoritos(prev => prev.filter(id => id !== productoId))
				console.error("Error al agregar favorito:", error)
			}
		}
	}

	return (
		<FavoritosContext.Provider value={{ favoritos,toggleFavorito,esFavorito,cargando }}>
			{children}
		</FavoritosContext.Provider>
	)
}

export function useFavoritos() {
	const context = useContext(FavoritosContext)
	if (!context) throw new Error("useFavoritos debe usarse dentro de FavoritosProvider")
	return context
}
