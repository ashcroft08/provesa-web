<script>
	/**
	 * @component SEO
	 * Componente central para la gestión de meta-tags dinámicos, Open Graph y JSON-LD.
	 * Se utiliza en cada página (+page.svelte) para inyectar metadatos en el <head>.
	 */
	import { page } from '$app/state';

	/** @type {{ 
     *   title?: string, 
     *   description?: string, 
     *   ogTitle?: string, 
     *   ogDescription?: string, 
     *   ogImage?: string, 
     *   ogType?: string,
     *   canonical?: string,
     *   twitterHandle?: string,
     *   jsonLd?: any
     * }} */
	let {
		/** @type {string} Título de la página. Se sufija automáticamente con " | PROVESA SCC" si no lo contiene. */
		title = 'PROVESA SCC - Distribuidor Mayorista Líder',
		/** @type {string} Meta-descripción para resultados de búsqueda. */
		description = 'Distribuidor mayorista líder en productos de consumo masivo. Calidad, servicio y los mejores precios para su negocio.',
		/** @type {string} Título específico para redes sociales (opcional). */
		ogTitle = '',
		/** @type {string} Descripción específica para redes sociales (opcional). */
		ogDescription = '',
		/** @type {string} URL de la imagen que aparecerá al compartir (Cloudinary recomendado). */
		ogImage = 'https://res.cloudinary.com/provesa/image/upload/v1/assets/og-image-default.jpg',
		/** @type {string} Tipo de contenido (website, article, etc). */
		ogType = 'website',
		/** @type {string} URL canónica. Si no se provee, se usa la URL actual del navegador. */
		canonical = '',
		/** @type {string} Handle de Twitter con @. */
		twitterHandle = '@provesascc',
		/** @type {any} Objeto para Datos Estructurados (Schema.org). */
		jsonLd = null
	} = $props();

	// Lógica de resolución de metadatos
	let finalCanonical = $derived(canonical || (page?.url?.href || ''));
	let finalTitle = $derived(title.includes('PROVESA') ? title : `${title} | PROVESA SCC`);
	let currentOgTitle = $derived(ogTitle || finalTitle);
	let currentOgDescription = $derived(ogDescription || description);

	/** 
	 * @type {string} Inyectar JSON-LD de forma segura escapando caracteres < para evitar XSS 
	 */
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{finalTitle}</title>
	<meta name="title" content={finalTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={finalCanonical} />
	<meta property="og:title" content={currentOgTitle} />
	<meta property="og:description" content={currentOgDescription} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={finalCanonical} />
	<meta property="twitter:title" content={currentOgTitle} />
	<meta property="twitter:description" content={currentOgDescription} />
	<meta property="twitter:image" content={ogImage} />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:creator" content={twitterHandle} />

	<link rel="canonical" href={finalCanonical} />

	{#if jsonLd}
		<script type="application/ld+json">
			{@html JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
		</script>
	{/if}
</svelte:head>
