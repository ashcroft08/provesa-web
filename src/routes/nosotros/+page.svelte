<script>
	let { data } = $props();

	// Defaults que coinciden con lo que están en el schema
	const defaults = {
		heroBadge: 'Desde 2006',
		heroTitle: 'Aliados de su Crecimiento',
		heroDescription:
			'Conozca la historia de compromiso y servicio que nos ha convertido en el distribuidor mayorista líder de la región.',
		historyTitle: 'Nuestra Historia',
		historyParagraphs: [
			'<strong>PROVESA SCC</strong> nació en el corazón de La Concordia con una visión clara: convertirse en el puente fundamental entre los grandes productores y los comerciantes locales.',
			'Fundada oficialmente como sociedad mercantil, iniciamos operaciones con la distribución de granos básicos. Gracias a la confianza de nuestros clientes, expandimos rápidamente nuestro portafolio para incluir una gama completa de abarrotes y productos de consumo masivo.',
			'Hoy, con más de 18 años de trayectoria, somos sinónimo de cumplimiento y seriedad. Atendemos a cientos de negocios, desde pequeñas tiendas de barrio hasta grandes autoservicios, garantizando siempre el mejor precio y abastecimiento oportuno.'
		],
		historyImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
		missionTitle: 'Nuestra Misión',
		missionText:
			'Ser el motor del comercio local, garantizando el abastecimiento eficiente de productos de consumo masivo con los más altos estándares de calidad, impulsando la rentabilidad de nuestros socios estratégicos a través de un servicio excepcional y precios competitivos.',
		visionTitle: 'Nuestra Visión',
		visionText:
			'Consolidarnos como el grupo de distribución mayorista más confiable y moderno del país, transformando la cadena de suministro en una ventaja competitiva para cada negocio que confía en nosotros, siendo referentes de integridad y crecimiento sostenible.',
		galleryImages: [
			{
				url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400',
				alt: 'Logística'
			},
			{
				url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=400',
				alt: 'Almacén'
			},
			{
				url: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=400',
				alt: 'Distribución'
			},
			{
				url: 'https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=400',
				alt: 'Equipo'
			}
		]
	};

	let heroBadge = $derived(data.nosotrosPage?.heroBadge || defaults.heroBadge);
	let heroTitle = $derived(data.nosotrosPage?.heroTitle || defaults.heroTitle);
	let heroDescription = $derived(data.nosotrosPage?.heroDescription || defaults.heroDescription);
	let historyTitle = $derived(data.nosotrosPage?.historyTitle || defaults.historyTitle);

	/** @type {string[]} */
	let historyParagraphs = $derived(
		(() => {
			const raw = /** @type {string[]|null} */ (data.nosotrosPage?.historyParagraphs);
			return Array.isArray(raw) && raw.length ? raw : defaults.historyParagraphs;
		})()
	);

	let historyImageUrl = $derived(data.nosotrosPage?.historyImageUrl || defaults.historyImageUrl);
	let missionTitle = $derived(data.nosotrosPage?.missionTitle || defaults.missionTitle);
	let missionText = $derived(data.nosotrosPage?.missionText || defaults.missionText);
	let visionTitle = $derived(data.nosotrosPage?.visionTitle || defaults.visionTitle);
	let visionText = $derived(data.nosotrosPage?.visionText || defaults.visionText);

	/** @type {{url:string, alt:string}[]} */
	let galleryImages = $derived(
		(() => {
			const raw = /** @type {{url:string,alt:string}[]|null} */ (data.nosotrosPage?.galleryImages);
			return Array.isArray(raw) && raw.length ? raw : defaults.galleryImages;
		})()
	);
</script>

<svelte:head>
	<title>Nosotros - PROVESA SCC</title>
</svelte:head>

<!-- HERO SECTION -->
<header class="relative overflow-hidden bg-primary pt-32 pb-20">
	<div
		class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
	></div>
	<div class="bg-accent-yellow/20 absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl"></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6 text-center text-white">
		<span
			class="text-accent-yellow mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
			>{heroBadge}</span
		>
		<h1 class="mb-6 text-5xl font-extrabold md:text-6xl">{heroTitle}</h1>
		<p class="mx-auto max-w-2xl text-xl leading-relaxed text-blue-100">
			{heroDescription}
		</p>
	</div>
</header>

<!-- HISTORIA -->
<section class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid items-center gap-16 md:grid-cols-2">
			<div class="relative">
				<div class="bg-accent-yellow/20 absolute -inset-4 -rotate-2 rounded-3xl"></div>
				<img
					src={historyImageUrl}
					alt="Bodega Provesa"
					class="relative h-[500px] w-full rounded-3xl object-cover shadow-xl"
				/>
			</div>
			<div>
				<h2 class="mb-6 text-3xl font-extrabold text-slate-900 md:text-4xl">
					{historyTitle}
				</h2>
				<div class="space-y-6 text-lg leading-relaxed text-slate-600">
					{#each historyParagraphs as paragraph}
						<p>{@html paragraph}</p>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- MISION Y VISION -->
<section class="relative bg-white py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid items-center gap-12 md:grid-cols-2">
			<div class="order-2 md:order-1">
				<div class="space-y-12">
					<!-- Mision -->
					<div class="relative border-l-4 border-primary pl-8">
						<h3 class="mb-4 text-2xl font-black tracking-tight text-slate-900 uppercase">
							{missionTitle}
						</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							{missionText}
						</p>
					</div>

					<!-- Vision -->
					<div class="border-accent-yellow relative border-l-4 pl-8">
						<h3 class="mb-4 text-2xl font-black tracking-tight text-slate-900 uppercase">
							{visionTitle}
						</h3>
						<p class="text-lg leading-relaxed text-slate-600">
							{visionText}
						</p>
					</div>
				</div>
			</div>
			<div class="order-1 grid grid-cols-2 gap-4 md:order-2">
				{#if galleryImages.length > 0}
					<div class="space-y-4 pt-12">
						{#if galleryImages[0]}
							<div
								class="aspect-square overflow-hidden rounded-3xl border-4 border-white shadow-lg"
							>
								<img
									src={galleryImages[0].url}
									alt={galleryImages[0].alt}
									class="h-full w-full object-cover"
								/>
							</div>
						{/if}
						{#if galleryImages[1]}
							<div class="aspect-[3/4] overflow-hidden rounded-3xl border-4 border-white shadow-lg">
								<img
									src={galleryImages[1].url}
									alt={galleryImages[1].alt}
									class="h-full w-full object-cover"
								/>
							</div>
						{/if}
					</div>
					<div class="space-y-4">
						{#if galleryImages[2]}
							<div class="aspect-[3/4] overflow-hidden rounded-3xl border-4 border-white shadow-lg">
								<img
									src={galleryImages[2].url}
									alt={galleryImages[2].alt}
									class="h-full w-full object-cover"
								/>
							</div>
						{/if}
						{#if galleryImages[3]}
							<div
								class="aspect-square overflow-hidden rounded-3xl border-4 border-white shadow-lg"
							>
								<img
									src={galleryImages[3].url}
									alt={galleryImages[3].alt}
									class="h-full w-full object-cover"
								/>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
