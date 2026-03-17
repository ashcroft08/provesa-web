<script>
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
		title = 'PROVESA SCC - Distribuidor Mayorista Líder',
		description = 'Distribuidor mayorista líder en productos de consumo masivo. Calidad, servicio y los mejores precios para su negocio.',
		ogTitle = '',
		ogDescription = '',
		ogImage = 'https://res.cloudinary.com/provesa/image/upload/v1/assets/og-image-default.jpg',
		ogType = 'website',
		canonical = '',
		twitterHandle = '@provesascc',
		jsonLd = null
	} = $props();

	let finalCanonical = $derived(canonical || (page?.url?.href || ''));
	let finalTitle = $derived(title.includes('PROVESA') ? title : `${title} | PROVESA SCC`);
	let currentOgTitle = $derived(ogTitle || finalTitle);
	let currentOgDescription = $derived(ogDescription || description);
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
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`}
	{/if}
</svelte:head>
