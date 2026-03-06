CREATE TABLE "footer_branches" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "footer_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text DEFAULT '',
	"address" text DEFAULT '',
	"phone" text DEFAULT '',
	"mobile" text DEFAULT '',
	"email" text DEFAULT '',
	"facebook_url" text DEFAULT '',
	"instagram_url" text DEFAULT '',
	"tiktok_url" text DEFAULT '',
	"whatsapp_url" text DEFAULT '',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "legal_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "legal_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"highlight" text DEFAULT '',
	"description" text DEFAULT '',
	"badge" text DEFAULT '',
	"align" text DEFAULT 'left' NOT NULL,
	"highlight_color" text DEFAULT 'text-accent-yellow',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '',
	"images" jsonb DEFAULT '[]'::jsonb,
	"features" jsonb DEFAULT '[]'::jsonb,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"align" text DEFAULT 'left' NOT NULL,
	"accent_color" text DEFAULT 'primary' NOT NULL,
	"display_type" text DEFAULT 'features' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nosotros_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"badge" text DEFAULT 'Nuestra Esencia' NOT NULL,
	"title" text DEFAULT 'Más que distribuidores, somos' NOT NULL,
	"title_highlight" text DEFAULT 'socios estratégicos' NOT NULL,
	"description" text DEFAULT 'Desde 2006, Provesa SCC ha sido un pilar fundamental para el comercio en La Concordia. Descubra nuestra historia, misión y los valores que nos impulsan cada día.' NOT NULL,
	"cta_text" text DEFAULT 'Conocer Más' NOT NULL,
	"cta_link" text DEFAULT '/nosotros' NOT NULL,
	"colors" jsonb DEFAULT '{"bg":"#455dd9","accent":"#ffd100","textMain":"#ffffff","textMuted":"#bfdbfe","iconColor":"#ffd100","statBg":"rgba(255,255,255,0.08)"}'::jsonb,
	"stats" jsonb DEFAULT '[{"number":"18+","label":"Años"},{"number":"100%","label":"Seriedad"},{"number":"500+","label":"Clientes"}]'::jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nosotros_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"hero_badge" text DEFAULT 'Desde 2006' NOT NULL,
	"hero_title" text DEFAULT 'Aliados de su Crecimiento' NOT NULL,
	"hero_description" text DEFAULT 'Conozca la historia de compromiso y servicio que nos ha convertido en el distribuidor mayorista líder de la región.' NOT NULL,
	"history_title" text DEFAULT 'Nuestra Historia' NOT NULL,
	"history_paragraphs" jsonb DEFAULT '["<strong>PROVESA SCC</strong> nació en el corazón de La Concordia con una visión clara: convertirse en el puente fundamental entre los grandes productores y los comerciantes locales.","Fundada oficialmente como sociedad mercantil, iniciamos operaciones con la distribución de granos básicos. Gracias a la confianza de nuestros clientes, expandimos rápidamente nuestro portafolio para incluir una gama completa de abarrotes y productos de consumo masivo.","Hoy, con más de 18 años de trayectoria, somos sinónimo de cumplimiento y seriedad. Atendemos a cientos de negocios, desde pequeñas tiendas de barrio hasta grandes autoservicios, garantizando siempre el mejor precio y abastecimiento oportuno."]'::jsonb,
	"history_image_url" text DEFAULT 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800' NOT NULL,
	"mission_title" text DEFAULT 'Nuestra Misión' NOT NULL,
	"mission_text" text DEFAULT 'Ser el motor del comercio local, garantizando el abastecimiento eficiente de productos de consumo masivo con los más altos estándares de calidad, impulsando la rentabilidad de nuestros socios estratégicos a través de un servicio excepcional y precios competitivos.' NOT NULL,
	"vision_title" text DEFAULT 'Nuestra Visión' NOT NULL,
	"vision_text" text DEFAULT 'Consolidarnos como el grupo de distribución mayorista más confiable y moderno del país, transformando la cadena de suministro en una ventaja competitiva para cada negocio que confía en nosotros, siendo referentes de integridad y crecimiento sostenible.' NOT NULL,
	"gallery_images" jsonb DEFAULT '[{"url":"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400","alt":"Logística"},{"url":"https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=400","alt":"Almacén"},{"url":"https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=400","alt":"Distribución"},{"url":"https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=400","alt":"Equipo"}]'::jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sugerencias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" text NOT NULL,
	"nombre" text,
	"mensaje" text NOT NULL,
	"leido" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sugerencias_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"opciones" jsonb DEFAULT '["Sugerencia de Servicio","Nuevo Producto Requerido","Reclamo","Felicitación"]'::jsonb NOT NULL
);
