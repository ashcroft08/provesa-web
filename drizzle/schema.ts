import { pgTable, serial, text, integer, index, timestamp, unique, boolean, foreignKey, jsonb, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const task = pgTable("task", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	priority: integer().default(1).notNull(),
});

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const themeConfig = pgTable("theme_config", {
	id: serial().primaryKey().notNull(),
	primaryColor: text("primary_color").default('#1565C0').notNull(),
	secondaryColor: text("secondary_color").default('#FFD100').notNull(),
	accentColor: text("accent_color").default('#E4002B').notNull(),
	backgroundColor: text("background_color").default('#FAFAF7').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().default(').notNull(),
	description: text().default('),
	images: jsonb().default([]),
	features: jsonb().default([]),
	categories: jsonb().default([]),
	align: text().default('left').notNull(),
	accentColor: text("accent_color").default('primary').notNull(),
	displayType: text("display_type").default('features').notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const postulaciones = pgTable("postulaciones", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nombre: text().notNull(),
	telefono: text().notNull(),
	email: text().notNull(),
	sucursal: text().notNull(),
	cvUrl: text("cv_url"),
	mensaje: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const footerBranches = pgTable("footer_branches", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	address: text().default('),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const nosotrosConfig = pgTable("nosotros_config", {
	id: serial().primaryKey().notNull(),
	badge: text().default('Nuestra Esencia').notNull(),
	title: text().default('Más que distribuidores, somos').notNull(),
	titleHighlight: text("title_highlight").default('socios estratégicos').notNull(),
	description: text().default('Desde 2006, Provesa SCC ha sido un pilar fundamental para el comercio en La Concordia. Descubra nuestra historia, misión y los valores que nos impulsan cada día.').notNull(),
	ctaText: text("cta_text").default('Conocer Más').notNull(),
	ctaLink: text("cta_link").default('/nosotros').notNull(),
	colors: jsonb().default({"bg":"#455dd9","accent":"#ffd100","statBg":"rgba(255,255,255,0.08)","textMain":"#ffffff","iconColor":"#ffd100","textMuted":"#bfdbfe"}),
	stats: jsonb().default([{"label":"Años","number":"18+"},{"label":"Seriedad","number":"100%"},{"label":"Clientes","number":"500+"}]),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const empleoSucursales = pgTable("empleo_sucursales", {
	id: serial().primaryKey().notNull(),
	nombre: text().notNull(),
	activa: boolean().default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const legalPages = pgTable("legal_pages", {
	id: serial().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().default(').notNull(),
	content: text().default(').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("legal_pages_slug_unique").on(table.slug),
]);

export const heroSlides = pgTable("hero_slides", {
	id: serial().primaryKey().notNull(),
	imageUrl: text("image_url").notNull(),
	title: text().default(').notNull(),
	highlight: text().default('),
	description: text().default('),
	badge: text().default('),
	align: text().default('left').notNull(),
	highlightColor: text("highlight_color").default('text-accent-yellow'),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const sugerencias = pgTable("sugerencias", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tipo: text().notNull(),
	nombre: text(),
	mensaje: text().notNull(),
	leido: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const sugerenciasConfig = pgTable("sugerencias_config", {
	id: serial().primaryKey().notNull(),
	opciones: jsonb().default(["Sugerencia de Servicio","Nuevo Producto Requerido","Reclamo","Felicitación"]).notNull(),
});

export const siteConfig = pgTable("site_config", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	value: text().notNull(),
}, (table) => [
	unique("site_config_key_unique").on(table.key),
]);

export const concursosGanadores = pgTable("concursos_ganadores", {
	id: serial().notNull(),
	concursoId: integer("concurso_id"),
	winnerName: text("winner_name").default(').notNull(),
	prize: text().default('),
	testimonial: text().default('),
	imageUrl: text("image_url").default('),
	dateLabel: text("date_label").default('),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.concursoId],
			foreignColumns: [concursos.id],
			name: "concursos_ganadores_concurso_id_concursos_id_fk"
		}).onDelete("cascade"),
]);

export const concursos = pgTable("concursos", {
	id: serial().notNull(),
	title: text().default(').notNull(),
	titleHighlight: text("title_highlight").default('),
	description: text().default('),
	imageUrl: text("image_url").default('),
	badgeText: text("badge_text").default('Sorteo Activo'),
	closeDate: text("close_date").default('),
	prizeName: text("prize_name").default('),
	ctaText: text("cta_text").default('Ver Marcas Auspiciantes'),
	disclaimer: text().default('),
	isActive: boolean("is_active").default(false).notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const footerInfo = pgTable("footer_info", {
	id: serial().primaryKey().notNull(),
	description: text().default('),
	address: text().default('),
	phone: text().default('),
	mobile: text().default('),
	email: text().default('),
	facebookUrl: text("facebook_url").default('),
	instagramUrl: text("instagram_url").default('),
	tiktokUrl: text("tiktok_url").default('),
	whatsappUrl: text("whatsapp_url").default('),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const nosotrosPage = pgTable("nosotros_page", {
	id: serial().primaryKey().notNull(),
	heroBadge: text("hero_badge").default('Desde 2006').notNull(),
	heroTitle: text("hero_title").default('Aliados de su Crecimiento').notNull(),
	heroDescription: text("hero_description").default('Conozca la historia de compromiso y servicio que nos ha convertido en el distribuidor mayorista líder de la región.').notNull(),
	historyTitle: text("history_title").default('Nuestra Historia').notNull(),
	historyParagraphs: jsonb("history_paragraphs").default(["<strong>PROVESA SCC</strong> nació en el corazón de La Concordia con una visión clara: convertirse en el puente fundamental entre los grandes productores y los comerciantes locales.","Fundada oficialmente como sociedad mercantil, iniciamos operaciones con la distribución de granos básicos. Gracias a la confianza de nuestros clientes, expandimos rápidamente nuestro portafolio para incluir una gama completa de abarrotes y productos de consumo masivo.","Hoy, con más de 18 años de trayectoria, somos sinónimo de cumplimiento y seriedad. Atendemos a cientos de negocios, desde pequeñas tiendas de barrio hasta grandes autoservicios, garantizando siempre el mejor precio y abastecimiento oportuno."]),
	historyImageUrl: text("history_image_url").default('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800').notNull(),
	missionTitle: text("mission_title").default('Nuestra Misión').notNull(),
	missionText: text("mission_text").default('Ser el motor del comercio local, garantizando el abastecimiento eficiente de productos de consumo masivo con los más altos estándares de calidad, impulsando la rentabilidad de nuestros socios estratégicos a través de un servicio excepcional y precios competitivos.').notNull(),
	visionTitle: text("vision_title").default('Nuestra Visión').notNull(),
	visionText: text("vision_text").default('Consolidarnos como el grupo de distribución mayorista más confiable y moderno del país, transformando la cadena de suministro en una ventaja competitiva para cada negocio que confía en nosotros, siendo referentes de integridad y crecimiento sostenible.').notNull(),
	galleryImages: jsonb("gallery_images").default([{"alt":"Logística","url":"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400"},{"alt":"Almacén","url":"https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=400"},{"alt":"Distribución","url":"https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=400"},{"alt":"Equipo","url":"https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=400"}]),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const pageViews = pgTable("page_views", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	path: text().notNull(),
	count: integer().default(0).notNull(),
	lastVisit: timestamp("last_visit", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("page_views_path_unique").on(table.path),
]);
