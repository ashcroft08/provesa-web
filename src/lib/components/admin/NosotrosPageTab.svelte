<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { nosotrosPage, formResult } = $props();

	let isSubmitting = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');
	let showPreview = $state(false);

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

	// Estado editable
	let heroBadge = $state('');
	let heroTitle = $state('');
	let heroDescription = $state('');
	let historyTitle = $state('');
	/** @type {string[]} */
	let historyParagraphs = $state([]);
	let historyImageUrl = $state('');
	let missionTitle = $state('');
	let missionText = $state('');
	let visionTitle = $state('');
	let visionText = $state('');
	/** @type {{url:string, alt:string}[]} */
	let galleryImages = $state([]);

	// Sincronizar con datos del servidor
	$effect(() => {
		const src = nosotrosPage;
		const hp = /** @type {string[]|null} */ (src?.historyParagraphs);
		const gi = /** @type {{url:string,alt:string}[]|null} */ (src?.galleryImages);

		heroBadge = src?.heroBadge || defaults.heroBadge;
		heroTitle = src?.heroTitle || defaults.heroTitle;
		heroDescription = src?.heroDescription || defaults.heroDescription;
		historyTitle = src?.historyTitle || defaults.historyTitle;
		historyParagraphs =
			Array.isArray(hp) && hp.length ? hp.map((p) => p) : [...defaults.historyParagraphs];
		historyImageUrl = src?.historyImageUrl || defaults.historyImageUrl;
		missionTitle = src?.missionTitle || defaults.missionTitle;
		missionText = src?.missionText || defaults.missionText;
		visionTitle = src?.visionTitle || defaults.visionTitle;
		visionText = src?.visionText || defaults.visionText;
		galleryImages =
			Array.isArray(gi) && gi.length
				? gi.map((g) => ({ ...g }))
				: defaults.galleryImages.map((g) => ({ ...g }));
	});

	// ── Upload a Cloudinary ──────────────────────────────
	/**
	 * Sube un archivo a Cloudinary via /api/upload
	 * @param {File} file
	 * @returns {Promise<string|undefined>} URL de la imagen subida
	 */
	async function uploadFile(file) {
		isUploading = true;
		uploadError = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			const data = await res.json();
			if (!res.ok) {
				uploadError = data.error || 'Error al subir';
				return;
			}
			return data.url;
		} catch {
			uploadError = 'Error de conexión al subir la imagen';
		} finally {
			isUploading = false;
		}
	}

	/** @param {Event} e */
	async function handleHistoryImageSelect(e) {
		const file = /** @type {HTMLInputElement} */ (e.target)?.files?.[0];
		if (!file) return;
		const url = await uploadFile(file);
		if (url) historyImageUrl = url;
	}

	/** @param {DragEvent} e */
	async function handleHistoryImageDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (!file) return;
		const url = await uploadFile(file);
		if (url) historyImageUrl = url;
	}

	/**
	 * @param {Event} e
	 * @param {number} index
	 */
	async function handleGalleryImageSelect(e, index) {
		const file = /** @type {HTMLInputElement} */ (e.target)?.files?.[0];
		if (!file) return;
		const url = await uploadFile(file);
		if (url) {
			galleryImages[index] = { ...galleryImages[index], url };
			galleryImages = [...galleryImages]; // trigger reactivity
		}
	}

	function addParagraph() {
		historyParagraphs = [...historyParagraphs, ''];
	}
	/** @param {number} i */
	function removeParagraph(i) {
		historyParagraphs = historyParagraphs.filter((_, j) => j !== i);
	}
	function addGalleryImage() {
		if (galleryImages.length < 4) {
			galleryImages = [...galleryImages, { url: '', alt: '' }];
		}
	}
	/** @param {number} i */
	function removeGalleryImage(i) {
		galleryImages = galleryImages.filter((_, j) => j !== i);
	}
	function resetToDefaults() {
		heroBadge = defaults.heroBadge;
		heroTitle = defaults.heroTitle;
		heroDescription = defaults.heroDescription;
		historyTitle = defaults.historyTitle;
		historyParagraphs = [...defaults.historyParagraphs];
		historyImageUrl = defaults.historyImageUrl;
		missionTitle = defaults.missionTitle;
		missionText = defaults.missionText;
		visionTitle = defaults.visionTitle;
		visionText = defaults.visionText;
		galleryImages = defaults.galleryImages.map((g) => ({ ...g }));
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Página Nosotros</h3>
				<p class="mt-1 text-sm text-slate-500">
					Edita el contenido de la página /nosotros (hero, historia, misión, visión y galería).
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (showPreview = true)}
					class="flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/10"
				>
					<span class="material-icons text-sm">visibility</span> Vista Previa
				</button>
				<a
					href="/nosotros"
					target="_blank"
					class="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
				>
					<span class="material-icons text-sm">open_in_new</span> Ver Página
				</a>
				<button
					onclick={resetToDefaults}
					class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
				>
					<span class="material-icons mr-1 align-middle text-xs">restart_alt</span> Restaurar
				</button>
			</div>
		</div>

		{#if formResult?.nosotrosPageUpdated}
			<div
				class="mb-6 flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700"
			>
				<span class="material-icons text-sm">check_circle</span>
				Contenido de la página guardado correctamente.
			</div>
		{/if}

		{#if uploadError}
			<div
				class="mb-6 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600"
			>
				<span class="material-icons text-sm">error</span>
				{uploadError}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateNosotrosPage"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<!-- ═══ HERO ═══ -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<p
					class="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
				>
					<span class="material-icons text-sm text-primary">flag</span> Hero / Encabezado
				</p>
				<div class="space-y-4">
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="npHeroBadge" class="mb-1 block text-xs font-bold text-slate-600"
								>Etiqueta superior</label
							>
							<input
								type="text"
								id="npHeroBadge"
								bind:value={heroBadge}
								placeholder="Desde 2006"
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
						</div>
						<div>
							<label for="npHeroTitle" class="mb-1 block text-xs font-bold text-slate-600"
								>Título principal</label
							>
							<input
								type="text"
								id="npHeroTitle"
								bind:value={heroTitle}
								placeholder="Aliados de su Crecimiento"
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
						</div>
					</div>
					<div>
						<label for="npHeroDesc" class="mb-1 block text-xs font-bold text-slate-600"
							>Descripción del hero</label
						>
						<textarea
							id="npHeroDesc"
							rows="2"
							bind:value={heroDescription}
							maxlength="300"
							class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
						></textarea>
						<p class="mt-1 text-[10px] text-slate-400">{heroDescription.length}/300</p>
					</div>
				</div>
			</div>

			<!-- ═══ HISTORIA ═══ -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<p
					class="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
				>
					<span class="material-icons text-sm text-primary">auto_stories</span> Nuestra Historia
				</p>
				<div class="space-y-4">
					<div>
						<label for="npHistTitle" class="mb-1 block text-xs font-bold text-slate-600"
							>Título de sección</label
						>
						<input
							type="text"
							id="npHistTitle"
							bind:value={historyTitle}
							placeholder="Nuestra Historia"
							class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
						/>
					</div>

					<!-- Imagen de historia con upload Cloudinary -->
					<div>
						<p class="mb-2 text-xs font-bold text-slate-600">Imagen de la sección</p>
						{#if historyImageUrl}
							<div class="relative overflow-hidden rounded-2xl">
								<img
									src={historyImageUrl}
									alt="Preview historia"
									class="h-44 w-full object-cover"
								/>
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
								>
									<label
										class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-white"
									>
										<span class="material-icons text-sm">swap_horiz</span>
										Cambiar imagen
										<input
											type="file"
											accept="image/*"
											class="hidden"
											onchange={handleHistoryImageSelect}
										/>
									</label>
								</div>
							</div>
						{:else}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 transition-all hover:border-primary hover:bg-primary/5"
								ondragover={(e) => e.preventDefault()}
								ondrop={handleHistoryImageDrop}
								onclick={() => document.getElementById('npHistImgFile')?.click()}
								onkeydown={() => {}}
								role="button"
								tabindex="0"
							>
								{#if isUploading}
									<div class="flex items-center gap-3">
										<div
											class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
										></div>
										<span class="text-sm font-bold text-primary">Subiendo imagen...</span>
									</div>
								{:else}
									<span class="material-icons mb-2 text-4xl text-slate-300">cloud_upload</span>
									<p class="text-sm font-bold text-slate-500">Arrastra o haz clic para subir</p>
									<p class="mt-1 text-xs text-slate-400">JPG, PNG, WebP · Máx 10MB</p>
								{/if}
							</div>
							<input
								type="file"
								id="npHistImgFile"
								accept="image/*"
								class="hidden"
								onchange={handleHistoryImageSelect}
							/>
						{/if}
					</div>

					<div>
						<div class="mb-2 flex items-center justify-between">
							<p class="text-xs font-bold text-slate-600">Párrafos</p>
							<button
								type="button"
								onclick={addParagraph}
								class="text-xs font-bold text-primary hover:underline"
							>
								+ Agregar párrafo
							</button>
						</div>
						<div class="space-y-3">
							{#each historyParagraphs as paragraph, i}
								<div class="flex gap-2">
									<textarea
										rows="3"
										bind:value={historyParagraphs[i]}
										placeholder="Contenido del párrafo (acepta HTML básico como <strong>)"
										class="flex-1 rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
									></textarea>
									{#if historyParagraphs.length > 1}
										<button
											type="button"
											onclick={() => removeParagraph(i)}
											class="self-start rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400"
										>
											<span class="material-icons text-sm">close</span>
										</button>
									{/if}
								</div>
							{/each}
						</div>
						<p class="mt-2 text-[10px] text-slate-400">
							Puedes usar HTML básico como &lt;strong&gt; para negritas.
						</p>
					</div>
				</div>
			</div>

			<!-- ═══ MISIÓN Y VISIÓN ═══ -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<p
					class="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
				>
					<span class="material-icons text-sm text-primary">flag_circle</span> Misión y Visión
				</p>
				<div class="space-y-6">
					<div class="rounded-xl bg-[#F8FAFC] p-4">
						<div class="mb-3 flex items-center gap-2 border-l-4 border-primary pl-3">
							<span class="text-xs font-black tracking-wide text-slate-700 uppercase">Misión</span>
						</div>
						<div class="space-y-3">
							<input
								type="text"
								bind:value={missionTitle}
								placeholder="Nuestra Misión"
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm font-bold focus:ring-primary/20"
							/>
							<textarea
								rows="4"
								bind:value={missionText}
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:ring-primary/20"
							></textarea>
						</div>
					</div>

					<div class="rounded-xl bg-[#F8FAFC] p-4">
						<div class="mb-3 flex items-center gap-2 border-l-4 border-amber-400 pl-3">
							<span class="text-xs font-black tracking-wide text-slate-700 uppercase">Visión</span>
						</div>
						<div class="space-y-3">
							<input
								type="text"
								bind:value={visionTitle}
								placeholder="Nuestra Visión"
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm font-bold focus:ring-primary/20"
							/>
							<textarea
								rows="4"
								bind:value={visionText}
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:ring-primary/20"
							></textarea>
						</div>
					</div>
				</div>
			</div>

			<!-- ═══ GALERÍA ═══ -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<div class="mb-4 flex items-center justify-between">
					<p
						class="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase"
					>
						<span class="material-icons text-sm text-primary">photo_library</span> Galería de Imágenes
					</p>
					{#if galleryImages.length < 4}
						<button
							type="button"
							onclick={addGalleryImage}
							class="text-xs font-bold text-primary hover:underline"
						>
							+ Agregar (máx 4)
						</button>
					{/if}
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					{#each galleryImages as img, i}
						<div class="rounded-xl border border-slate-100 bg-[#F8FAFC] p-3">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-[10px] font-bold text-slate-400">Imagen {i + 1}</span>
								{#if galleryImages.length > 1}
									<button
										type="button"
										onclick={() => removeGalleryImage(i)}
										class="text-slate-300 hover:text-red-400"
									>
										<span class="material-icons text-sm">close</span>
									</button>
								{/if}
							</div>
							{#if galleryImages[i].url}
								<div class="relative mb-2 overflow-hidden rounded-lg">
									<img
										src={galleryImages[i].url}
										alt={galleryImages[i].alt || 'Preview'}
										class="h-24 w-full object-cover"
									/>
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
									>
										<label
											class="flex cursor-pointer items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-white"
										>
											<span class="material-icons text-xs">cloud_upload</span>
											{isUploading ? 'Subiendo...' : 'Cambiar'}
											<input
												type="file"
												accept="image/*"
												class="hidden"
												onchange={(e) => handleGalleryImageSelect(e, i)}
											/>
										</label>
									</div>
								</div>
							{:else}
								<label
									class="mb-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white p-6 transition-all hover:border-primary hover:bg-primary/5"
								>
									{#if isUploading}
										<div class="flex items-center gap-2">
											<div
												class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
											></div>
											<span class="text-xs font-bold text-primary">Subiendo...</span>
										</div>
									{:else}
										<span class="material-icons mb-1 text-2xl text-slate-300">cloud_upload</span>
										<p class="text-[10px] font-bold text-slate-500">Clic para subir</p>
									{/if}
									<input
										type="file"
										accept="image/*"
										class="hidden"
										onchange={(e) => handleGalleryImageSelect(e, i)}
									/>
								</label>
							{/if}
							<div class="mt-1">
								<input
									type="text"
									bind:value={galleryImages[i].alt}
									placeholder="Texto alt de la imagen"
									class="w-full rounded-lg border-slate-200 bg-white p-2 text-xs focus:ring-primary/20"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Hidden JSON -->
			<input type="hidden" name="heroBadge" value={heroBadge} />
			<input type="hidden" name="heroTitle" value={heroTitle} />
			<input type="hidden" name="heroDescription" value={heroDescription} />
			<input type="hidden" name="historyTitle" value={historyTitle} />
			<input
				type="hidden"
				name="historyParagraphs"
				value={JSON.stringify(historyParagraphs.filter((p) => p.trim()))}
			/>
			<input type="hidden" name="historyImageUrl" value={historyImageUrl} />
			<input type="hidden" name="missionTitle" value={missionTitle} />
			<input type="hidden" name="missionText" value={missionText} />
			<input type="hidden" name="visionTitle" value={visionTitle} />
			<input type="hidden" name="visionText" value={visionText} />
			<input
				type="hidden"
				name="galleryImages"
				value={JSON.stringify(galleryImages.filter((g) => g.url))}
			/>

			<button
				type="submit"
				disabled={isSubmitting || isUploading}
				class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
			>
				{isSubmitting ? 'Guardando...' : 'Guardar Página Nosotros'}
				<span class="material-icons text-sm">save</span>
			</button>
		</form>
	</div>

	<!-- Modal Vista Previa -->
	{#if showPreview}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			in:fade={{ duration: 150 }}
			class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
			onclick={(e) => {
				if (e.target === e.currentTarget) showPreview = false;
			}}
		>
			<div
				in:slide={{ duration: 250 }}
				class="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-8 py-4 backdrop-blur-sm"
				>
					<div class="flex items-center gap-3">
						<span class="material-icons text-primary">preview</span>
						<h3 class="text-lg font-black text-slate-900">Vista Previa - Nosotros</h3>
						<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
							>En tiempo real</span
						>
					</div>
					<button
						onclick={() => (showPreview = false)}
						class="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50"
					>
						<span class="material-icons text-sm">close</span>
						Cerrar
					</button>
				</div>

				<div class="nosotros-preview">
					<!-- Hero -->
					<header class="relative overflow-hidden bg-primary pt-16 pb-12">
						<div
							class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
						></div>
						<div
							class="bg-accent-yellow/20 absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl"
						></div>
						<div class="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
							<span
								class="text-accent-yellow mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
								>{heroBadge}</span
							>
							<h1 class="mb-4 text-3xl font-extrabold md:text-4xl">{heroTitle}</h1>
							<p class="mx-auto max-w-xl text-sm leading-relaxed text-blue-100">
								{heroDescription}
							</p>
						</div>
					</header>

					<!-- Historia -->
					<section class="bg-white py-12">
						<div class="mx-auto max-w-5xl px-6">
							<div class="grid items-center gap-8 md:grid-cols-2">
								<div class="relative">
									<div class="bg-accent-yellow/20 absolute -inset-3 -rotate-2 rounded-2xl"></div>
									{#if historyImageUrl}
										<img
											src={historyImageUrl}
											alt="Bodega Provesa"
											class="relative h-64 w-full rounded-2xl object-cover shadow-lg"
										/>
									{:else}
										<div
											class="relative flex h-64 items-center justify-center rounded-2xl bg-slate-100"
										>
											<span class="material-icons text-4xl text-slate-300">image</span>
										</div>
									{/if}
								</div>
								<div>
									<h2 class="mb-4 text-2xl font-extrabold text-slate-900">{historyTitle}</h2>
									<div class="space-y-3 text-sm leading-relaxed text-slate-600">
										{#each historyParagraphs as paragraph}
											{#if paragraph.trim()}
												<p>{@html paragraph}</p>
											{/if}
										{/each}
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Misión y Visión -->
					<section class="bg-white py-12">
						<div class="mx-auto max-w-5xl px-6">
							<div class="grid items-center gap-8 md:grid-cols-2">
								<div class="order-2 md:order-1">
									<div class="space-y-8">
										<div class="relative border-l-4 border-primary pl-6">
											<h3 class="mb-2 text-lg font-black tracking-tight text-slate-900 uppercase">
												{missionTitle}
											</h3>
											<p class="text-sm leading-relaxed text-slate-600">{missionText}</p>
										</div>
										<div class="border-accent-yellow relative border-l-4 pl-6">
											<h3 class="mb-2 text-lg font-black tracking-tight text-slate-900 uppercase">
												{visionTitle}
											</h3>
											<p class="text-sm leading-relaxed text-slate-600">{visionText}</p>
										</div>
									</div>
								</div>
								<div class="order-1 grid grid-cols-2 gap-3 md:order-2">
									{#each galleryImages as img, i}
										{#if img.url}
											<div
												class="{i % 2 === 0
													? 'aspect-square'
													: 'aspect-[3/4]'} overflow-hidden rounded-2xl border-2 border-white shadow-md"
											>
												<img
													src={img.url}
													alt={img.alt || 'Galería'}
													class="h-full w-full object-cover"
												/>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.nosotros-preview :global(header) {
		margin-top: 0;
	}
</style>
