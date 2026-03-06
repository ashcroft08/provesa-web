CREATE TABLE "postulaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"telefono" text NOT NULL,
	"email" text NOT NULL,
	"sucursal" text NOT NULL,
	"cv_url" text,
	"mensaje" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
