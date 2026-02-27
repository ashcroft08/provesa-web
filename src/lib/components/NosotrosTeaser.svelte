<script>
	import logo from '$lib/assets/images/provesa-logo.png';
	import { ArrowRight, CalendarCheck, ShieldCheck, Truck, Users } from 'lucide-svelte';

	let { config = null } = $props();

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

	// Merge config con defaults
	let badge = $derived(config?.badge || defaults.badge);
	let title = $derived(config?.title || defaults.title);
	let titleHighlight = $derived(config?.titleHighlight || defaults.titleHighlight);
	let description = $derived(config?.description || defaults.description);
	let ctaText = $derived(config?.ctaText || defaults.ctaText);
	let ctaLink = $derived(config?.ctaLink || defaults.ctaLink);
	let colors = $derived({ ...defaults.colors, ...(config?.colors || {}) });
	let stats = $derived(config?.stats?.length ? config.stats : defaults.stats);

	const statIcons = [CalendarCheck, ShieldCheck, Truck, Users];
</script>

<section
	id="nosotros-teaser"
	class="relative overflow-hidden py-28 md:py-32"
	style="background-color: {colors.bg};"
>
	<!-- Decoraciones de fondo -->
	<div class="absolute top-0 right-0 h-full w-1/3 skew-x-12 bg-white/[0.04]"></div>
	<div
		class="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl"
		style="background-color: {colors.accent}20;"
	></div>
	<div
		class="pointer-events-none absolute -top-20 right-10 h-60 w-60 rounded-full blur-3xl"
		style="background-color: {colors.accent}15;"
	></div>

	<div
		class="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 md:flex-row lg:px-8"
	>
		<!-- Lado izquierdo: contenido -->
		<div class="md:w-1/2">
			<span
				class="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
				style="color: {colors.accent};"
			>
				<Users size={14} />
				{badge}
			</span>

			<h2
				class="mb-6 text-3xl leading-tight font-extrabold sm:text-4xl md:text-5xl"
				style="color: {colors.textMain};"
			>
				{title} <span style="color: {colors.accent};">{titleHighlight}</span>
			</h2>

			<p class="mb-10 text-base leading-relaxed md:text-lg" style="color: {colors.textMuted};">
				{description}
			</p>

			<!-- Stats con íconos -->
			<div class="mb-10 grid gap-4" style="grid-template-columns: repeat({stats.length}, 1fr);">
				{#each stats as stat, i}
					<div
						class="rounded-2xl p-4 text-center backdrop-blur-sm transition-all hover:brightness-125"
						style="background-color: {colors.statBg};"
					>
						<svelte:component
							this={statIcons[i % statIcons.length]}
							size={22}
							class="mx-auto mb-2"
							style="color: {colors.iconColor};"
						/>
						<span class="block text-2xl font-black sm:text-3xl" style="color: {colors.textMain};"
							>{stat.number}</span
						>
						<span
							class="mt-1 block text-[10px] font-bold tracking-wider uppercase"
							style="color: {colors.accent};">{stat.label}</span
						>
					</div>
				{/each}
			</div>

			<a
				href={ctaLink}
				class="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold shadow-lg shadow-black/10 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
				style="background-color: {colors.textMain}; color: {colors.bg};"
			>
				{ctaText}
				<ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
			</a>
		</div>

		<!-- Lado derecho: logo decorativo -->
		<div class="relative md:w-1/2">
			<div
				class="absolute -inset-8 rounded-full blur-3xl"
				style="background-color: {colors.accent}15;"
			></div>
			<div class="absolute -inset-4 rounded-full bg-white/[0.03] blur-xl"></div>
			<img
				src={logo}
				alt="Provesa"
				class="relative z-10 mx-auto w-2/3 opacity-40 brightness-0 drop-shadow-2xl invert"
			/>
		</div>
	</div>
</section>
