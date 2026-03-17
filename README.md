# PROVESA SCC — Sitio Web y Panel Administrativo

> Plataforma web institucional y panel de administración para **PROVESA SCC** (Sociedad Cooperativa de Consumo), construida con SvelteKit 5, TailwindCSS 4 y PostgreSQL.

---

## ✨ Características

| Módulo | Descripción |
|--------|-------------|
| **Sitio público** | Página institucional con navbar dinámico y diseño responsivo |
| **Panel administrativo** | Dashboard, gestión de candidatos, sugerencias y configuración general |
| **Personalización de tema** | Editor de colores (primario, secundario, acento, fondo) que se aplica en tiempo real al sitio |
| **Autenticación** | Inicio de sesión con correo y contraseña, rutas protegidas, cierre de sesión |
| **Recuperación de contraseña** | Flujo completo con envío de correo electrónico vía Gmail (Nodemailer) |
| **Gestión de usuarios** | Administración de usuarios desde el panel |

## 🛠️ Stack tecnológico

- **Framework:** [SvelteKit 5](https://svelte.dev/docs/kit) con Svelte 5 (runes)
- **Estilos:** [TailwindCSS 4](https://tailwindcss.com/) + plugin `@tailwindcss/forms`
- **Base de datos:** [PostgreSQL](https://www.postgresql.org/) con [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticación:** [Better Auth](https://www.better-auth.com/)
- **Correo:** [Nodemailer](https://nodemailer.com/) (servicio Gmail)
- **Testing:** [Vitest](https://vitest.dev/) (unit/component) + [Playwright](https://playwright.dev/) (E2E)
- **Linting/Formato:** ESLint + Prettier

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- PostgreSQL 15+ (local o remoto)

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/ashcroft08/provesa-web.git
cd provesa-web

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección siguiente)

# 4. Aplicar esquema a la base de datos
pnpm db:push

# 5. Ejecutar seeds iniciales (admin + tema por defecto)
pnpm db:seed

# 6. Iniciar servidor de desarrollo
pnpm dev
```

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgres://usuario:contraseña@host:5432/provesa"

# URL de origen de la aplicación
ORIGIN="http://localhost:5173"

# Secreto de Better Auth (32 caracteres, alta entropía)
# https://www.better-auth.com/docs/installation
BETTER_AUTH_SECRET=""

# Credenciales de Gmail para recuperación de contraseña
GMAIL_USER="tu-correo@gmail.com"
GMAIL_APP_PASSWORD="tu-app-password"
```

> [!NOTE]
> Para `GMAIL_APP_PASSWORD`, genera una [contraseña de aplicación](https://support.google.com/accounts/answer/185833) desde la configuración de seguridad de tu cuenta de Google.

## 📂 Estructura del proyecto

```
provesa-web/
├── drizzle/                  # Migraciones y esquema generado (introspect)
├── src/
│   ├── lib/
│   │   ├── assets/           # Recursos estáticos (favicon, etc.)
│   │   ├── components/       # Componentes de UI y lógica de negocio
│   │   ├── server/           # Lógica del lado del servidor
│   │   │   ├── auth.js       # Autenticación con Better Auth
│   │   │   ├── db/           # Esquemas Drizzle, seeds y conexión
│   │   │   ├── services/     # Capa de Negocio (validación, lógica pesada)
│   │   │   └── repositories/ # Capa de Acceso a Datos (consultas SQL/Drizzle)
│   │   └── utils/            # Utilidades compartidas
│   └── routes/
│       ├── (public)/         # Rutras públicas (Home, Nosotros, etc.)
│       ├── admin/            # Panel administrativo (protegido)
│       └── login/            # Inicio de sesión y recuperación
├── static/                   # Archivos estáticos públicos
└── ... 
```

## 🏗️ Arquitectura Técnica

El proyecto sigue el patrón **Service-Repository** para desacoplar la lógica de negocio del acceso a datos.

1.  **Repositories (`/repositories`)**: Encapsulan las consultas directas a la base de datos usando Drizzle ORM. No contienen lógica de negocio.
2.  **Services (`/services`)**: Contienen la lógica de negocio, validaciones complejas, integración con servicios externos (Cloudinary) y procesamiento de datos antes de enviarlos al repositorio.
3.  **Svelte Actions (`+page.server.js`)**: Los Actions invocan servicios y manejan la respuesta para los formularios de SvelteKit.

### 🔍 SEO y Visibilidad

Se utiliza un componente centralizado `SEO.svelte` que abstrae toda la lógica de meta-tags.

*   **Uso**: En cualquier `+page.svelte`, importa e inserta el componente.
```svelte
<SEO 
  title="Mi Página" 
  description="Descripción optimizada" 
  ogImage="url-de-cloudinary"
/>
```
*   **Social**: Maneja automáticamente Open Graph (Facebook/WhatsApp) y Twitter Cards.
*   **Canonical**: Resuelve automáticamente la URL canónica para evitar contenido duplicado.
*   **JSON-LD**: Permite inyectar datos estructurados (Schema.org) como un prop.

### 📝 Validación de Formularios

Implementamos una estrategia de validación en dos capas:

1.  **Lado del Cliente**: En componentes como `SugerenciasForm.svelte`, validamos el estado reactivo (`$state`) antes de enviar, proporcionando feedback instantáneo al usuario (ej: longitud máxima de caracteres).
2.  **Lado del Servidor**: En los Actions de SvelteKit, validamos la integridad de los datos antes de procesarlos. Se utiliza la función `fail()` para retornar errores de validación que se muestran mediante el prop `form` en el componente.

### 📦 Gestión de Productos

Los productos utilizan un esquema flexible basado en **JSONB**. Esto permite almacenar listas de características o categorías sin necesidad de múltiples tablas de union, simplificando la sincronización entre el formulario dinámico del admin y la base de datos.
Recientemente se ha optimizado el manejo de tipos en JSDoc para garantizar que las desestructuraciones de estos objetos genéricos no generen advertencias de tipos.

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera la build de producción |
| `pnpm preview` | Previsualiza la build de producción |
| `pnpm db:push` | Aplica el esquema a la base de datos |
| `pnpm db:generate` | Genera migraciones de Drizzle |
| `pnpm db:migrate` | Ejecuta migraciones pendientes |
| `pnpm db:studio` | Abre Drizzle Studio (GUI de la BD) |
| `pnpm db:seed` | Ejecuta seeds (admin + tema) |
| `pnpm test` | Ejecuta tests unitarios y E2E |
| `pnpm lint` | Verifica formato y linting |
| `pnpm format` | Formatea el código con Prettier |

## 📄 Licencia

Este proyecto es privado y de uso exclusivo de **PROVESA SCC**.
