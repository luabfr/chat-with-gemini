"use client"
import { createContext,useContext,useState,ReactNode } from "react"

interface Producto {
	id: number
	title: string
	price: number
	thumbnail: string
	category: string
}

interface ItemCarrito extends Producto {
	cantidad: number
}

interface CartContextType {
	carrito: ItemCarrito[]
	agregarAlCarrito: (producto: Producto) => void
	quitarDelCarrito: (id: number) => void
	vaciarCarrito: () => void
	totalItems: number
	totalPrecio: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
	const [carrito,setCarrito] = useState<ItemCarrito[]>([])

	const agregarAlCarrito = (producto: Producto) => {
		setCarrito(prev => {
			const existe = prev.find(item => item.id === producto.id)
			if (existe) {
				return prev.map(item =>
					item.id === producto.id
						? { ...item,cantidad: item.cantidad + 1 }
						: item
				)
			}
			return [...prev,{ ...producto,cantidad: 1 }]
		})
	}

	const quitarDelCarrito = (id: number) => {
		setCarrito(prev => {
			const existe = prev.find(item => item.id === id)
			if (existe && existe.cantidad > 1) {
				return prev.map(item =>
					item.id === id ? { ...item,cantidad: item.cantidad - 1 } : item
				)
			}
			return prev.filter(item => item.id !== id)
		})
	}

	const vaciarCarrito = () => setCarrito([])

	const totalItems = carrito.reduce((acc,item) => acc + item.cantidad,0)
	const totalPrecio = carrito.reduce((acc,item) => acc + item.price * item.cantidad,0)

	return (
		<CartContext.Provider value={{
			carrito,
			agregarAlCarrito,
			quitarDelCarrito,
			vaciarCarrito,
			totalItems,
			totalPrecio
		}}>
			{children}
		</CartContext.Provider>
	)
}

export function useCart() {
	const context = useContext(CartContext)
	if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
	return context
}