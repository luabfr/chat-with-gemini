# 🛒 Gemini Chat Ecommerce

Una app de ecommerce con asistente de IA integrado, construida con Next.js y Google Gemini.

---

## ¿Qué hace?

Emula una tienda online estilo MercadoLibre donde el usuario puede explorar productos y hablarle a un asistente de IA llamado **Max** que entiende lenguaje natural y puede realizar acciones reales dentro de la tienda.

---

## Features

- 🛍️ **Catálogo de productos** con grilla visual, imágenes, precios, rating y stock
- 🏷️ **Filtros por categoría** (smartphones, laptops, skincare, etc.)
- 🛒 **Carrito de compras** con panel deslizable, contador de items y total
- 💬 **Asistente de IA flotante (Max)** disponible en todas las pantallas
- 🤖 **Chat con memoria** — Max recuerda el contexto de la conversación
- ➕ **Acciones desde el chat** — Max puede agregar productos al carrito por pedido del usuario

---

## Stack

| Tecnología | Uso |
|---|---|
| [Next.js 14](https://nextjs.org/) | Framework frontend |
| [Google Gemini 2.5 Flash](https://aistudio.google.com/) | Modelo de IA |
| [DummyJSON](https://dummyjson.com/) | API de productos |
| React Context | Estado global del carrito |
| Vercel | Deploy |

---

## Cómo funciona el asistente

Max usa **Google Gemini 2.5 Flash** con un system prompt que le da acceso al catálogo completo de productos. Cuando el usuario pide agregar algo al carrito, Gemini devuelve una acción estructurada en JSON que el frontend procesa:

```json
{
  "accion": "agregar_carrito",
  "producto_id": 3,
  "mensaje": "¡iPhone agregado a tu carrito!"
}
```

El frontend detecta la acción, busca el producto en DummyJSON y lo agrega al carrito automáticamente.

---

## Ejemplos de uso del chat

- *"¿Qué productos tienen disponibles?"*
- *"Mostrame algo de electrónica barato"*
- *"¿Cuál tiene mejor rating?"*
- *"Agregame el laptop al carrito"*
- *"Quiero comprar los últimos 3 productos que me mostraste"*

---

## Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/luabfr/chat-with-gemini.git
cd gemini-chat

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editá .env.local y agregá tu API key de Google Gemini

# Correr en desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en el browser.

---

## Variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto:

```bash
GEMINI_API_KEY=tu_api_key_de_google_gemini
```

Conseguí tu API key gratis en [aistudio.google.com](https://aistudio.google.com/).

---

## Estructura del proyecto

```
gemini-chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # Endpoint que llama a Gemini
│   ├── components/
│   │   ├── FloatingChat.tsx      # Burbuja flotante del asistente
│   │   ├── Cart.tsx              # Carrito deslizable
│   │   ├── ProductCard.tsx       # Tarjeta de producto
│   │   └── ProductGrid.tsx       # Grilla con filtros por categoría
│   ├── context/
│   │   └── CartContext.tsx       # Estado global del carrito
│   ├── productos/
│   │   └── page.tsx              # Página del catálogo
│   ├── layout.tsx                # Layout global (carrito + chat)
│   └── page.tsx                  # Página de inicio
├── .env.local                    # Variables de entorno (no se sube a Git)
└── README.md
```

---

## Arquitectura

```
[Usuario en Next.js]
        ↓
  FloatingChat (cliente)
        ↓
  /api/chat (Next.js API Route)
        ↓
  Google Gemini 2.5 Flash
  + contexto de productos de DummyJSON
        ↓
  Respuesta de texto o acción JSON
        ↓
  Actualiza UI / agrega al carrito
```

---

## Roadmap

- [ ] Conectar backend propio con Strapi
- [ ] Página de detalle de producto
- [ ] Historial de carrito persistente (localStorage)
- [ ] Checkout simulado
- [ ] Autenticación de usuarios

---

## Licencia

MIT