# PROVESA SCC — Sitio Web y Panel Administrativo

> Plataforma web institucional y panel de administración para **PROVESA SCC** (Sociedad Cooperativa de Consumo), construida con SvelteKit 5, TailwindCSS 4 y PostgreSQL.

---

## ✨ Características

| Módulo | Descripción |
|--------|-------------|
| **Sitio público** | Página institucional con navbar dinámico, hero slider, catálogo de productos, sección "Nosotros" y formulario de sugerencias |
| **Panel administrativo** | Dashboard con métricas en tiempo real, gestión de productos, sliders, concursos, sugerencias, postulaciones, páginas legales y configuración |
| **Gestión de productos** | CRUD completo con soporte de diámetros (relación muchos-a-muchos) y carga de imágenes vía Cloudinary |
| **Concursos** | Creación y administración de concursos con fechas, premios y estados |
| **Empleo** | Página de ofertas de empleo con postulaciones y gestión de sucursales |
| **Personalización de tema** | Editor de colores (primario, secundario, acento, fondo) que se aplica en tiempo real |
| **Footer dinámico** | Configuración editable de redes sociales, horarios y datos de contacto |
| **Sección Nosotros** | Página pública con contenido administrable (misión, visión, valores, historia) |
| **Páginas legales** | Gestión dinámica de páginas de privacidad y términos de servicio |
| **Autenticación** | Login con correo/contraseña, rutas protegidas, rate limiting y sesiones de 1 hora |
| **Recuperación de contraseña** | Flujo completo con envío de correo vía Gmail (Nodemailer) |
| **Analytics** | Tracking automático de vistas de páginas públicas |
| **SEO** | Componente `<SEO>` reutilizable con meta tags dinámicos y `robots.txt` |
| **Tutorial interactivo** | Onboarding guiado en el admin con [Driver.js](https://driverjs.com/) |

## 🛠️ Stack tecnológico

- **Framework:** [SvelteKit 5](https://svelte.dev/docs/kit) con Svelte 5 (runes)
- **Estilos:** [TailwindCSS 4](https://tailwindcss.com/) + plugin `@tailwindcss/forms`
- **Base de datos:** [PostgreSQL](https://www.postgresql.org/) con [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticación:** [Better Auth](https://www.better-auth.com/)
- **Imágenes:** [Cloudinary](https://cloudinary.com/) (carga y transformación de imágenes)
- **Correo:** [Nodemailer](https://nodemailer.com/) (servicio Gmail)
- **Iconos:** [Lucide Svelte](https://lucide.dev/)
- **Tutorial:** [Driver.js](https://driverjs.com/) (onboarding guiado)
- **Testing:** [Vitest](https://vitest.dev/) (unit/component) + [Playwright](https://playwright.dev/) (E2E)
- **Linting/Formato:** ESLint + Prettier

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas:

```
Componentes Svelte  →  Server Actions (+page.server.js)  →  Services  →  Repositories  →  Drizzle ORM  →  PostgreSQL
```

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **Componentes** | `src/lib/components/` | UI y lógica de presentación |
| **Rutas** | `src/routes/` | Páginas y server actions (load/actions) |
| **Servicios** | `src/lib/server/services/` | Lógica de negocio (12 servicios) |
| **Repositorios** | `src/lib/server/repositories/` | Acceso a datos vía Drizzle (11 repositorios) |
| **Esquemas** | `src/lib/server/db/schemas/` | Definiciones de tablas PostgreSQL (15 esquemas) |

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- PostgreSQL 15+ (local o remoto)
- Cuenta de [Cloudinary](https://cloudinary.com/) (para carga de imágenes)

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
BETTER_AUTH_SECRET=""

# Credenciales de Gmail para recuperación de contraseña
GMAIL_USER="tu-correo@gmail.com"
GMAIL_APP_PASSWORD="tu-app-password"

# Cloudinary (carga de imágenes)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Seed del usuario administrador
ADMIN_NAME="Administrador"
ADMIN_EMAIL="admin@provesa.com"
ADMIN_PASSWORD=""
```

> [!NOTE]
> Para `GMAIL_APP_PASSWORD`, genera una [contraseña de aplicación](https://support.google.com/accounts/answer/185833) desde la configuración de seguridad de tu cuenta de Google.

> [!NOTE]
> Las credenciales de Cloudinary se obtienen desde el [dashboard de Cloudinary](https://console.cloudinary.com/).

## 📂 Estructura del proyecto

```
provesa-web/
├── drizzle/                          # Migraciones de base de datos
├── e2e/                              # Tests end-to-end (Playwright)
├── src/
│   ├── hooks.server.js               # Middleware: analytics + autenticación
│   ├── lib/
│   │   ├── assets/                   # Recursos estáticos (favicon, logo)
│   │   ├── components/
│   │   │   ├── admin/                # 14 componentes del panel administrativo
│   │   │   │   ├── AdminSidebar.svelte
│   │   │   │   ├── DashboardTab.svelte
│   │   │   │   ├── ProductosTab.svelte
│   │   │   │   ├── SlidersTab.svelte
│   │   │   │   ├── ConcursosTab.svelte
│   │   │   │   ├── SugerenciasTab.svelte
│   │   │   │   ├── PostulacionesTab.svelte
│   │   │   │   ├── NosotrosTab.svelte
│   │   │   │   ├── NosotrosPageTab.svelte
│   │   │   │   ├── FooterTab.svelte
│   │   │   │   ├── PersonalizacionTab.svelte
│   │   │   │   ├── ConfiguracionTab.svelte
│   │   │   │   ├── PaginasLegalesTab.svelte
│   │   │   │   └── PlaceholderTab.svelte
│   │   │   ├── Footer.svelte         # Footer dinámico con redes sociales
│   │   │   ├── HeroSlider.svelte     # Carrusel principal de imágenes
│   │   │   ├── Navbar.svelte         # Barra de navegación responsiva
│   │   │   ├── NosotrosTeaser.svelte # Preview de la sección "Nosotros"
│   │   │   ├── ProductSection.svelte # Catálogo de productos
│   │   │   ├── RedesSociales.svelte  # Barra flotante de redes sociales
│   │   │   ├── SEO.svelte            # Componente de meta tags
│   │   │   └── SugerenciasForm.svelte# Formulario de sugerencias
│   │   ├── server/
│   │   │   ├── auth.js               # Configuración de Better Auth
│   │   │   ├── cloudinary.js         # Configuración de Cloudinary
│   │   │   ├── db/
│   │   │   │   ├── index.js          # Conexión a PostgreSQL
│   │   │   │   ├── schema.js         # Re-exporta todos los esquemas
│   │   │   │   ├── schemas/          # 15 archivos de esquemas Drizzle
│   │   │   │   └── seeds/            # Seeds (admin + tema por defecto)
│   │   │   ├── repositories/         # 11 repositorios de acceso a datos
│   │   │   └── services/             # 12 servicios de lógica de negocio
│   │   └── utils/                    # Utilidades compartidas
│   └── routes/
│       ├── +page.svelte              # Página principal (Home)
│       ├── admin/                    # Panel administrativo (protegido)
│       ├── api/upload/               # Endpoint de carga de imágenes
│       ├── concursos/                # Página de concursos
│       ├── empleo/                   # Página de empleo y postulaciones
│       ├── login/                    # Inicio de sesión
│       ├── nosotros/                 # Página "Nosotros"
│       ├── politicas/                # Políticas (privacidad y términos)
│       ├── recuperar/                # Solicitar recuperación de contraseña
│       └── restablecer-password/     # Restablecer contraseña con token
├── static/                           # Archivos estáticos (favicon .ico, robots.txt)
├── .env.example                      # Plantilla de variables de entorno
├── drizzle.config.js                 # Configuración de Drizzle Kit
├── svelte.config.js                  # Configuración de SvelteKit
└── vite.config.js                    # Configuración de Vite + Tailwind + testing
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
| `pnpm db:seed` | Ejecuta seeds (admin + tema por defecto) |
| `pnpm auth:schema` | Regenera el esquema de Better Auth |
| `pnpm test` | Ejecuta tests unitarios y E2E |
| `pnpm test:unit` | Ejecuta solo tests unitarios (Vitest) |
| `pnpm test:e2e` | Ejecuta solo tests E2E (Playwright) |
| `pnpm lint` | Verifica formato y linting |
| `pnpm format` | Formatea el código con Prettier |
| `pnpm check` | Ejecuta svelte-check para validación de tipos |

## 📄 Licencia

Este proyecto es privado y de uso exclusivo de **PROVESA SCC**.
