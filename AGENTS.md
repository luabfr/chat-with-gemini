<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MarketChat - Contexto del proyecto para continuar desarrollo

## Descripción
Ecommerce con asistente de IA integrado. El usuario puede explorar productos, usar un chat con IA para consultas y agregar productos al carrito mediante lenguaje natural.

**URL producción:** https://marketchat-ten.vercel.app/

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| Base de datos | Supabase (PostgreSQL) |
| IA | Groq API (Llama 3.3 70B) |
| Deploy | Vercel |
| Analytics | Microsoft Clarity |

---

## Variables de entorno (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://mwwapuvrdujucwrsinaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iFtPr-PU6NfkoL_TEpzGCQ_ZKhwRyWx
GROQ_API_KEY=gsk_... (key de Groq)
```

---

## Estructura de carpetas

```
app/
├── api/
│   └── chat/
│       └── route.js              # Endpoint Groq + productos de Supabase
├── auth/
│   └── callback/
│       └── route.ts              # Callback OAuth Google
├── components/
│   ├── AddToCartButton.tsx       # Botón con feedback visual
│   ├── Cart.tsx                  # Panel carrito deslizable
│   ├── ChatSidebar.tsx           # Asistente Max (sidebar izquierdo)
│   ├── HomeProductCard.tsx       # Tarjeta para home
│   ├── Navbar.tsx                # Navbar sticky con buscador y sesión
│   ├── ProductCard.tsx           # Tarjeta para catálogo
│   ├── ProductGrid.tsx           # Grilla con filtros y skeleton
│   └── SearchResults.tsx        # Dropdown resultados buscador
├── context/
│   └── CartContext.tsx           # Estado global del carrito
├── cuenta/
│   ├── layout.tsx                # Layout con sidebar de navegación
│   ├── page.tsx                  # Perfil del usuario
│   ├── ordenes/
│   │   └── page.tsx              # Historial de compras
│   └── favoritos/
│       └── page.tsx              # Placeholder (pendiente)
├── checkout/
│   └── page.tsx                  # Checkout con validación (simulado)
├── lib/
│   ├── productos.ts              # Funciones cliente (browser)
│   ├── productos.server.ts       # Funciones servidor (SSR)
│   ├── seed.ts                   # Ya no se usa
│   ├── types.ts                  # Interfaces TypeScript
│   ├── useUser.ts                # Hook de sesión
│   └── supabase/
│       ├── client.ts             # Cliente browser
│       └── server.ts             # Cliente servidor
├── login/
│   └── page.tsx                  # Login email + Google OAuth
├── productos/
│   ├── page.tsx                  # Catálogo completo
│   └── [id]/
│       └── page.tsx              # Detalle de producto
├── registro/
│   └── page.tsx                  # Registro email + Google OAuth
├── layout.tsx                    # Layout global (Navbar, Cart, ChatSidebar)
├── page.tsx                      # Home con productos destacados
└── globals.css                   # Animaciones y estilos globales
middleware.ts                     # Protección de rutas + renovación sesión
```

---

## Base de datos Supabase

### Tablas creadas

```sql
-- Perfiles de usuario
profiles (
  id UUID PRIMARY KEY,  -- mismo que auth.users
  nombre TEXT,
  avatar_url TEXT,
  telefono TEXT,
  direccion_default TEXT,
  created_at TIMESTAMP
)

-- Productos (40 cargados desde DummyJSON)
productos (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price DECIMAL,
  stock INTEGER,
  category TEXT,
  thumbnail TEXT,
  images TEXT[],
  discount DECIMAL,
  rating DECIMAL,
  active BOOLEAN,
  created_at TIMESTAMP
)

-- Órdenes
ordenes (
  id UUID PRIMARY KEY,
  user_id UUID,
  estado TEXT,  -- pendiente|pagado|enviado|entregado|cancelado
  total DECIMAL,
  nombre_cliente TEXT,
  email_cliente TEXT,
  direccion_envio TEXT,
  ciudad TEXT,
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  created_at TIMESTAMP
)

-- Items de cada orden
order_items (
  id SERIAL PRIMARY KEY,
  orden_id UUID,
  producto_id INTEGER,
  nombre_producto TEXT,
  cantidad INTEGER,
  precio_unitario DECIMAL
)

-- Favoritos
favoritos (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  producto_id INTEGER,
  created_at TIMESTAMP,
  UNIQUE(user_id, producto_id)
)
```

### RLS configurado en todas las tablas

- `productos` → SELECT público para todos (anon + authenticated)
- `ordenes` → usuarios ven y crean solo sus propias órdenes
- `order_items` → usuarios ven solo los de sus órdenes
- `favoritos` → usuarios ven, agregan y eliminan solo los suyos
- `profiles` → usuarios ven y editan solo su propio perfil

### Trigger automático
Al crear un usuario en auth.users, se crea automáticamente su perfil en profiles.

---

## Tipo Product (app/lib/types.ts)

```ts
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  thumbnail: string
  images: string[]
  discount: number
  rating: number
  active: boolean
}
```

### Tipo CartProduct (app/context/CartContext.tsx)

```ts
export interface CartProduct {
  id: number
  name: string
  price: number
  thumbnail: string
  category: string
}
```

---

## Autenticación

- Email/password con confirmación de email
- Google OAuth configurado y funcionando
- Middleware protege `/cuenta/*` y `/checkout`
- Si no hay sesión redirige a `/login?redirect=/ruta-original`
- Después del login redirige al destino original
- `/login` y `/registro` redirigen a home si ya hay sesión

---

## Asistente Max (ChatSidebar)

- Sidebar fijo a la izquierda (1/3 del layout)
- Conectado a Groq API con modelo `llama-3.3-70b-versatile`
- Conoce el catálogo real de Supabase
- Tiene memoria de conversación (historial)
- Puede agregar productos al carrito via JSON estructurado:
  `{"accion": "agregar_carrito", "producto_id": ID, "mensaje": "texto"}`
- Al agregar, busca el producto en Supabase y lo agrega al CartContext

---

## Features implementadas ✅

- Home con productos destacados por categoría (scroll horizontal)
- Catálogo con filtros por categoría
- Buscador en tiempo real con debounce (350ms)
- Página de detalle de producto con galería
- Skeleton loader en catálogo
- Animaciones fade in escalonado
- Carrito con panel deslizable, contador con bounce
- Checkout con formulario, validación y confirmación simulada
- Asistente Max con IA, memoria y acciones sobre el carrito
- Login con email/password y Google OAuth
- Registro con email/password y Google OAuth
- Sección /cuenta con perfil editable e historial de órdenes
- Protección de rutas con redirect
- Microsoft Clarity para analytics
- Deploy en Vercel con variables de entorno

---

## Lo que falta construir 🔲

### Alta prioridad
```
1. Favoritos
   - Botón corazón en ProductCard y HomeProductCard
   - Toggle: agregar/quitar de favoritos en Supabase
   - Página /cuenta/favoritos con la lista real
   - Max puede agregar/quitar favoritos por pedido del usuario

2. Checkout real con Supabase
   - Al confirmar, guardar la orden en tabla ordenes
   - Guardar los items en order_items
   - El historial en /cuenta/ordenes muestra órdenes reales

3. MercadoPago
   - Instalar SDK de MercadoPago
   - Crear preferencia de pago al confirmar checkout
   - Webhook para confirmar pago y actualizar estado de orden
   - Pantalla de éxito/error post-pago

4. Panel /admin
   - Ruta protegida solo para admin
   - CRUD de productos (crear, editar, desactivar)
   - Lista de órdenes con cambio de estado
   - Estadísticas básicas
```

### Media prioridad
```
5. Carrito persistente
   - Si el usuario está logueado, sincronizar carrito con Supabase
   - Al hacer login, recuperar el carrito guardado

6. Max mejorado con contexto de usuario
   - "¿Cuál fue mi última compra?"
   - "Agregame de nuevo lo que compré el mes pasado"
   - "Guardame este en favoritos"

7. Página de detalle mejorada
   - Productos relacionados
   - Reviews reales de usuarios
```

### Nice to have
```
8. Filtros avanzados (precio, rating, descuento)
9. Modo mobile optimizado
10. Emails transaccionales (confirmación de orden, envío)
11. Sistema de reviews
```

---

## Convenciones del proyecto

- **Campos en inglés**: name, price, category, description, discount, active, images
- **Archivos TS/TSX**: todos los componentes y páginas
- **route.js**: la API route del chat es .js (no .ts) para evitar conflictos
- **Dos clientes Supabase**:
  - `lib/supabase/client.ts` → Client Components ("use client")
  - `lib/supabase/server.ts` → Server Components y API Routes
- **Dos archivos de productos**:
  - `lib/productos.ts` → funciones para client components
  - `lib/productos.server.ts` → funciones para server components
- **useSearchParams** siempre dentro de `<Suspense>`
- **Imágenes** siempre con `NextImage` (no `Image`) para evitar conflicto con DOM

---

## Comandos útiles

```bash
npm run dev          # desarrollo local
npm run typecheck    # chequeo de tipos antes del push
npm run lint         # ESLint
git add . && git commit -m "mensaje" && git push
vercel --prod        # deploy manual
```

---

## Próximo paso sugerido

Arrancar con **Favoritos** porque:
1. Es completamente independiente de MercadoPago
2. Mejora mucho la UX
3. Prepara la tabla que ya existe en Supabase
4. Permite que Max también pueda gestionar favoritos

Después **Checkout real con Supabase** y luego **MercadoPago**.

