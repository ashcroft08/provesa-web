<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import NosotrosTeaser from '$lib/components/NosotrosTeaser.svelte';

	let { nosotros, formResult } = $props();

	let isSubmitting = $state(false);
	let showPreview = $state(false);

	const defaults = {
		badge: 'Nuestra Esencia',
		title: 'Más que distribuidores, somos',
		titleHighlight: 'socios estratégicos',
		description:
			'Desde 2006, Provesa SCC ha sido un pilar fundamental para el comercio en La Concordia. Descubra nuestra historia, misión y los valores que nos impulsan cada día.',
		ctaText: 'Conocer Más',
		ctaLink: '/nosotros',
		colors: {
			bg: '#455dd9',
			accent: '#ffd100',
			textMain: '#ffffff',
			textMuted: '#bfdbfe',
			iconColor: '#ffd100',
			statBg: 'rgba(255,255,255,0.08)'
		},
		stats: [
			{ number: '18+', label: 'Años' },
			{ number: '100%', label: 'Seriedad' },
			{ number: '500+', label: 'Clientes' }
		]
	};

	// Merge con defaults
	let badge = $state(nosotros?.badge || defaults.badge);
	let title = $state(nosotros?.title || defaults.title);
	let titleHighlight = $state(nosotros?.titleHighlight || defaults.titleHighlight);
	let description = $state(nosotros?.description || defaults.description);
	let ctaText = $state(nosotros?.ctaText || defaults.ctaText);
	let ctaLink = $state(nosotros?.ctaLink || defaults.ctaLink);
	let colors = $state({ ...defaults.colors, ...(nosotros?.colors || {}) });
	let stats = $state(
		nosotros?.stats?.length
			? nosotros.stats.map((s) => ({ ...s }))
			: defaults.stats.map((s) => ({ ...s }))
	);

	// Re-sync cuando el prop nosotros cambia (después de guardar)
	$effect(() => {
		const src = nosotros;
		badge = src?.badge || defaults.badge;
		title = src?.title || defaults.title;
		titleHighlight = src?.titleHighlight || defaults.titleHighlight;
		description = src?.description || defaults.description;
		ctaText = src?.ctaText || defaults.ctaText;
		ctaLink = src?.ctaLink || defaults.ctaLink;
		colors = { ...defaults.colors, ...(src?.colors || {}) };
		stats = src?.stats?.length
			? src.stats.map((s) => ({ ...s }))
			: defaults.stats.map((s) => ({ ...s }));
	});

	function addStat() {
		if (stats.length < 4) stats = [...stats, { number: '', label: '' }];
	}
	function removeStat(i) {
		stats = stats.filter((_, j) => j !== i);
	}
	function resetToDefaults() {
		badge = defaults.badge;
		title = defaults.title;
		titleHighlight = defaults.titleHighlight;
		description = defaults.description;
		ctaText = defaults.ctaText;
		ctaLink = defaults.ctaLink;
		colors = { ...defaults.colors };
		stats = defaults.stats.map((s) => ({ ...s }));
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Sección Nosotros</h3>
				<p class="mt-1 text-sm text-slate-500">
					Personaliza los textos, colores y estadísticas del teaser.
				</p>
			</div>
			<div class="flex items-center gap-2">
				<button
					onclick={() => (showPreview = true)}
					class="flex items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/10"
				>
					<span class="material-icons text-sm">visibility</span> Vista Previa
				</button>
				<button
					onclick={resetToDefaults}
					class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
				>
					<span class="material-icons mr-1 align-middle text-xs">restart_alt</span> Restaurar Defaults
				</button>
			</div>
		</div>

		<form
			method="POST"
			action="?/updateNosotros"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<!-- Textos -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<p class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Textos</p>
				<div class="space-y-4">
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="nosBadge" class="mb-1 block text-xs font-bold text-slate-600"
								>Etiqueta superior</label
							>
							<input
								type="text"
								id="nosBadge"
								bind:value={badge}
								placeholder="Nuestra Esencia"
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
						</div>
						<div>
							<label for="nosCtaText" class="mb-1 block text-xs font-bold text-slate-600"
								>Texto del botón</label
							>
							<input
								type="text"
								id="nosCtaText"
								bind:value={ctaText}
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
						</div>
					</div>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="nosTitle" class="mb-1 block text-xs font-bold text-slate-600"
								>Título principal</label
							>
							<input
								type="text"
								id="nosTitle"
								bind:value={title}
								placeholder="Más que distribuidores, somos"
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
							<p class="mt-1 text-[10px] text-slate-400">
								Texto en blanco antes de la palabra destacada
							</p>
						</div>
						<div>
							<label for="nosHighlight" class="mb-1 block text-xs font-bold text-slate-600"
								>Texto destacado</label
							>
							<input
								type="text"
								id="nosHighlight"
								bind:value={titleHighlight}
								placeholder="socios estratégicos"
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							/>
							<p class="mt-1 text-[10px] text-slate-400">Se muestra con el color acento</p>
						</div>
					</div>
					<div>
						<label for="nosDesc" class="mb-1 block text-xs font-bold text-slate-600"
							>Descripción</label
						>
						<textarea
							id="nosDesc"
							rows="3"
							bind:value={description}
							maxlength="300"
							class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
						></textarea>
						<p class="mt-1 text-[10px] text-slate-400">{description.length}/300</p>
					</div>
					<div>
						<label for="nosCtaLink" class="mb-1 block text-xs font-bold text-slate-600"
							>Enlace del botón</label
						>
						<input
							type="text"
							id="nosCtaLink"
							bind:value={ctaLink}
							class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
						/>
					</div>
				</div>
			</div>

			<!-- Colores -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<p class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
					Paleta de Colores
				</p>
				<div class="grid gap-5 md:grid-cols-3">
					<div>
						<label for="colBg" class="mb-2 block text-xs font-bold text-slate-600"
							>Fondo de la sección</label
						>
						<div class="flex items-center gap-3">
							<input
								type="color"
								id="colBg"
								bind:value={colors.bg}
								class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
							/>
							<input
								type="text"
								bind:value={colors.bg}
								class="flex-1 rounded-lg border-slate-200 bg-[#F8FAFC] p-2 font-mono text-xs"
							/>
						</div>
					</div>
					<div>
						<label for="colAccent" class="mb-2 block text-xs font-bold text-slate-600"
							>Color acento (destacados)</label
						>
						<div class="flex items-center gap-3">
							<input
								type="color"
								id="colAccent"
								bind:value={colors.accent}
								class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
							/>
							<input
								type="text"
								bind:value={colors.accent}
								class="flex-1 rounded-lg border-slate-200 bg-[#F8FAFC] p-2 font-mono text-xs"
							/>
						</div>
					</div>
					<div>
						<label for="colText" class="mb-2 block text-xs font-bold text-slate-600"
							>Texto principal</label
						>
						<div class="flex items-center gap-3">
							<input
								type="color"
								id="colText"
								bind:value={colors.textMain}
								class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
							/>
							<input
								type="text"
								bind:value={colors.textMain}
								class="flex-1 rounded-lg border-slate-200 bg-[#F8FAFC] p-2 font-mono text-xs"
							/>
						</div>
					</div>
					<div>
						<label for="colMuted" class="mb-2 block text-xs font-bold text-slate-600"
							>Texto secundario</label
						>
						<div class="flex items-center gap-3">
							<input
								type="color"
								id="colMuted"
								bind:value={colors.textMuted}
								class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
							/>
							<input
								type="text"
								bind:value={colors.textMuted}
								class="flex-1 rounded-lg border-slate-200 bg-[#F8FAFC] p-2 font-mono text-xs"
							/>
						</div>
					</div>
					<div>
						<label for="colIcon" class="mb-2 block text-xs font-bold text-slate-600"
							>Color íconos</label
						>
						<div class="flex items-center gap-3">
							<input
								type="color"
								id="colIcon"
								bind:value={colors.iconColor}
								class="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
							/>
							<input
								type="text"
								bind:value={colors.iconColor}
								class="flex-1 rounded-lg border-slate-200 bg-[#F8FAFC] p-2 font-mono text-xs"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Estadísticas -->
			<div class="rounded-2xl border border-slate-100 bg-white p-5">
				<div class="mb-4 flex items-center justify-between">
					<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Estadísticas</p>
					{#if stats.length < 4}
						<button
							type="button"
							onclick={addStat}
							class="text-xs font-bold text-primary hover:underline">+ Agregar (máx 4)</button
						>
					{/if}
				</div>
				<div class="space-y-3">
					{#each stats as stat, i}
						<div class="flex items-center gap-3 rounded-xl bg-[#F8FAFC] p-3">
							<input
								type="text"
								bind:value={stat.number}
								placeholder="18+"
								class="w-20 rounded-lg border-slate-200 bg-white p-2 text-center text-sm font-black"
							/>
							<input
								type="text"
								bind:value={stat.label}
								placeholder="Años"
								class="flex-1 rounded-lg border-slate-200 bg-white p-2 text-sm"
							/>
							{#if stats.length > 1}
								<button
									type="button"
									onclick={() => removeStat(i)}
									class="text-slate-300 hover:text-red-400"
								>
									<span class="material-icons text-sm">close</span>
								</button>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Hidden JSON fields -->
			<input type="hidden" name="badge" value={badge} />
			<input type="hidden" name="title" value={title} />
			<input type="hidden" name="titleHighlight" value={titleHighlight} />
			<input type="hidden" name="description" value={description} />
			<input type="hidden" name="ctaText" value={ctaText} />
			<input type="hidden" name="ctaLink" value={ctaLink} />
			<input type="hidden" name="colors" value={JSON.stringify(colors)} />
			<input
				type="hidden"
				name="stats"
				value={JSON.stringify(stats.filter((s) => s.number || s.label))}
			/>

			<button
				type="submit"
				disabled={isSubmitting}
				class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
			>
				{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
				class="w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-8 py-4 backdrop-blur-sm"
				>
					<div class="flex items-center gap-3">
						<span class="material-icons text-primary">preview</span>
						<h3 class="text-lg font-black text-slate-900">Vista Previa - Nosotros</h3>
						<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
							>Así se ve en la página</span
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
				<div class="nosotros-preview-compact">
					<NosotrosTeaser
						config={{ badge, title, titleHighlight, description, ctaText, ctaLink, colors, stats }}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.nosotros-preview-compact :global(section) {
		padding-top: 2.5rem !important;
		padding-bottom: 2.5rem !important;
	}
	.nosotros-preview-compact :global(h2) {
		font-size: 1.75rem !important;
	}
	.nosotros-preview-compact :global(.gap-16) {
		gap: 2rem !important;
	}
</style>
