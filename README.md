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
├── drizzle/                  # Migraciones de base de datos
├── src/
│   ├── lib/
│   │   ├── assets/           # Recursos estáticos (favicon, etc.)
│   │   ├── components/       # Componentes reutilizables (Navbar, Admin)
│   │   ├── server/
│   │   │   ├── auth.js       # Configuración de Better Auth
│   │   │   └── db/           # Esquemas Drizzle, seeds y conexión
│   │   └── utils/            # Utilidades compartidas
│   └── routes/
│       ├── admin/            # Panel administrativo (protegido)
│       ├── login/            # Inicio de sesión
│       ├── recuperar/        # Solicitar recuperación de contraseña
│       └── restablecer-password/  # Restablecer contraseña
├── static/                   # Archivos estáticos públicos
├── .env.example              # Plantilla de variables de entorno
├── drizzle.config.js         # Configuración de Drizzle Kit
├── svelte.config.js          # Configuración de SvelteKit
└── vite.config.js            # Configuración de Vite
```

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
