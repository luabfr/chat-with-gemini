"use client"
import { useState,useEffect } from "react"
import { createClient } from "./supabase/client"
import { User } from "@supabase/supabase-js"

export function useUser() {
	const [user,setUser] = useState<User | null>(null)
	const [cargando,setCargando] = useState(true)

	useEffect(() => {
		const supabase = createClient()

		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user)
			setCargando(false)
		})

		const { data: listener } = supabase.auth.onAuthStateChange((_event,session) => {
			setUser(session?.user ?? null)
		})

		return () => listener.subscription.unsubscribe()
	},[])

	return { user,cargando }
}