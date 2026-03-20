<script>
	/** @type {{ 
	 *   title?: string, 
	 *   description?: string, 
	 *   ogImage?: string, 
	 *   ogType?: 'website' | 'article',
	 *   canonicalUrl?: string,
	 *   siteName?: string,
	 *   jsonLd?: any,
	 *   noindex?: boolean
	 * }} */
	let { 
		title = '', 
		description = 'Distribuidor Mayorista líder en La Concordia. Abastecimiento estratégico para su negocio con más de 18 años de trayectoria.', 
		ogImage = '/og-image.png', 
		ogType = 'website',
		canonicalUrl = '',
		siteName = 'PROVESA SCC',
		noindex = false
	} = $props();

	let fullTitle = $derived(title ? `${title} | ${siteName}` : siteName);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content={siteName} />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
		<link rel="canonical" href={canonicalUrl} />
	{/if}

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={ogImage} />

	<!-- Additional SEO -->
	<meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>
