CREATE TABLE "concursos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"title_highlight" text DEFAULT '',
	"description" text DEFAULT '',
	"image_url" text DEFAULT '',
	"badge_text" text DEFAULT 'Sorteo Activo',
	"close_date" text DEFAULT '',
	"prize_name" text DEFAULT '',
	"cta_text" text DEFAULT 'Ver Marcas Auspiciantes',
	"disclaimer" text DEFAULT '',
	"is_active" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "concursos_ganadores" (
	"id" serial PRIMARY KEY NOT NULL,
	"concurso_id" integer,
	"winner_name" text DEFAULT '' NOT NULL,
	"prize" text DEFAULT '',
	"testimonial" text DEFAULT '',
	"image_url" text DEFAULT '',
	"date_label" text DEFAULT '',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "concursos_ganadores" ADD CONSTRAINT "concursos_ganadores_concurso_id_concursos_id_fk" FOREIGN KEY ("concurso_id") REFERENCES "public"."concursos"("id") ON DELETE cascade ON UPDATE no action;