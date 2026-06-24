# Supabase Setup

## 1. Instalar la libreria

```bash
npm install @supabase/supabase-js
```

## 2. Crear proyecto en Supabase

1. Entra a `https://supabase.com/dashboard`
2. Crea un proyecto nuevo.
3. Copia `Project URL` y `anon public key`.

## 3. Configurar variables de entorno

Duplica `.env.example` como `.env` y completa:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 4. Crear la tabla

Abre el SQL Editor de Supabase y ejecuta el contenido de `supabase/schema.sql`.

## 5. Probar el formulario

Ejecuta:

```bash
npm run dev
```

Luego abre el modal RSVP y envía una prueba.
