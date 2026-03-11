CREATE TABLE "site_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "site_config_key_unique" UNIQUE("key")
);
