<script>
	import { onMount } from 'svelte';
	import { Calendar, Gift, ChevronLeft, ChevronRight, Sparkles } from 'lucide-svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	let concurso = $derived(data.concurso);
	let ganadores = $derived(data.ganadores || []);

	/** @type {HTMLDivElement | undefined} */
	let carousel = $state();
	let isPaused = false;
	let scrollAmount = 1;
	const cardWidth = 350 + 24;

	onMount(() => {
		if (carousel && ganadores.length > 0) {
			const autoScroll = () => {
				if (!isPaused && carousel) {
					carousel.scrollLeft += scrollAmount;
					if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
						carousel.scrollLeft = 0;
					}
				}
				requestAnimationFrame(autoScroll);
			};

			requestAnimationFrame(autoScroll);
		}
	});

	function scrollNext() {
		if (!carousel) return;
		isPaused = true;
		carousel.style.scrollBehavior = 'smooth';
		carousel.scrollLeft += cardWidth;
		setTimeout(() => {
			if (carousel) carousel.style.scrollBehavior = 'auto';
			isPaused = false;
		}, 500);
	}

	function scrollPrev() {
		if (!carousel) return;
		isPaused = true;
		carousel.style.scrollBehavior = 'smooth';
		if (carousel.scrollLeft <= 0) {
			carousel.style.scrollBehavior = 'auto';
			carousel.scrollLeft = carousel.scrollWidth / 2;
		}
		requestAnimationFrame(() => {
			if (carousel) {
				carousel.style.scrollBehavior = 'smooth';
				carousel.scrollLeft -= cardWidth;
				setTimeout(() => {
					if (carousel) carousel.style.scrollBehavior = 'auto';
					isPaused = false;
				}, 500);
			}
		});
	}
</script>

<SEO 
	title="Concursos y Ganadores - Premiamos tu Lealtad"
	description="Participa en nuestros concursos y gana premios increíbles para tu negocio. Conoce a nuestros ganadores y únete a la comunidad PROVESA."
/>

<div class="font-display bg-white text-slate-900 antialiased">
	<section class="relative overflow-hidden bg-white pt-32 pb-24">
		<div class="relative z-10 mx-auto max-w-7xl px-6">
			<div class="mb-16 text-center">
				<span
					class="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold tracking-widest text-slate-600 uppercase"
				>
					Comunidad Provesa
				</span>
				<h2 class="mb-6 text-4xl font-extrabold text-slate-900 md:text-6xl">Concursos y Premios</h2>
				<p class="mx-auto max-w-2xl text-xl text-slate-600">
					Premiamos la lealtad y el esfuerzo de nuestros socios mayoristas con incentivos reales
					para su negocio.
				</p>
			</div>

			{#if concurso}
				<div class="mb-24">
					<div
						class="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex-row"
					>
						<div class="relative min-h-[300px] lg:min-h-full lg:w-1/2">
							{#if concurso.imageUrl}
								<img
									src={concurso.imageUrl}
									alt={concurso.title}
									class="absolute inset-0 h-full w-full object-cover"
								/>
							{:else}
								<div class="absolute inset-0 bg-slate-200"></div>
							{/if}
							<div class="absolute inset-0 bg-black/10"></div>
							{#if concurso.badgeText}
								<div
									class="absolute top-6 left-6 rounded bg-accent-red px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm sm:text-xs"
								>
									{concurso.badgeText}
								</div>
							{/if}
						</div>

						<div class="flex flex-col justify-center bg-white p-8 md:p-12 lg:w-1/2">
							<h3 class="mb-3 text-3xl leading-tight font-black text-slate-900 lg:text-4xl">
								{concurso.title}
								{#if concurso.titleHighlight}
									<br /><span class="text-primary">{concurso.titleHighlight}</span>
								{/if}
							</h3>
							{#if concurso.description}
								<p class="mb-8 text-lg leading-relaxed text-slate-500">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html concurso.description}
								</p>
							{/if}

							<div class="mb-10 grid grid-cols-2 gap-4">
								{#if concurso.closeDate}
									<div class="rounded-xl border border-slate-100 bg-slate-50 p-5">
										<Calendar size={32} class="mb-2 text-primary" />
										<span
											class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
											>Cierre</span
										>
										<span class="block text-lg font-bold text-slate-800">{concurso.closeDate}</span>
									</div>
								{/if}
								{#if concurso.prizeName}
									<div class="rounded-xl border border-slate-100 bg-slate-50 p-5">
										<Gift size={32} class="mb-2 text-accent-yellow" />
										<span
											class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
											>Premio Principal</span
										>
										<span class="block text-lg font-bold text-slate-800">{concurso.prizeName}</span>
									</div>
								{/if}
							</div>

							<div>
								{#if concurso.ctaText}
									<button
										class="w-full rounded-xl bg-primary px-8 py-4 text-center font-bold text-white shadow-sm transition-colors hover:bg-blue-800 sm:w-auto"
									>
										{concurso.ctaText}
									</button>
								{/if}
								{#if concurso.disclaimer}
									<p class="mt-4 text-center text-xs text-slate-400 sm:text-left">
										{concurso.disclaimer}
									</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div
					class="relative mx-auto mb-24 max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-10 text-center shadow-lg shadow-slate-200/50 sm:p-16"
				>
					<!-- Decorative background blurs -->
					<div
						class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 opacity-50 mix-blend-multiply blur-3xl"
					></div>
					<div
						class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-yellow/20 opacity-50 mix-blend-multiply blur-3xl"
					></div>

					<div class="relative z-10 flex flex-col items-center justify-center">
						<div
							class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-slate-200/50"
						>
							<Sparkles size={36} class="animate-pulse text-primary" />
						</div>
						<h3 class="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
							¡Nuevos sorteos muy pronto!
						</h3>
						<p class="mx-auto max-w-lg text-lg leading-relaxed text-slate-600">
							Actualmente estamos preparando increíbles promociones para nuestra comunidad. Mantente
							al tanto para descubrir cómo puedes ganar.
						</p>
					</div>
				</div>
			{/if}

			{#if ganadores.length > 0}
				<div class="relative w-full py-10">
					<div class="mb-8 flex flex-col items-end justify-between gap-6 md:flex-row">
						<div class="max-w-xl">
							<h3 class="mb-2 text-3xl font-extrabold text-slate-900">Evidencia de Ganadores</h3>
							<p class="text-slate-500">
								La transparencia es nuestro pilar. Conozca a algunos de nuestros socios que ya han
								ganado con nuestras dinámicas.
							</p>
						</div>
						<div class="flex shrink-0 gap-3">
							<button
								onclick={scrollPrev}
								class="z-20 rounded-full border-2 border-slate-200 p-3 text-slate-600 transition-all hover:border-primary hover:bg-slate-50 hover:text-primary focus:outline-none"
							>
								<ChevronLeft size={24} />
							</button>
							<button
								onclick={scrollNext}
								class="z-20 rounded-full border-2 border-slate-200 p-3 text-slate-600 transition-all hover:border-primary hover:bg-slate-50 hover:text-primary focus:outline-none"
							>
								<ChevronRight size={24} />
							</button>
						</div>
					</div>

					<div class="carousel-mask relative -mx-6 px-6">
						<div
							bind:this={carousel}
							onmouseenter={() => (isPaused = true)}
							onmouseleave={() => (isPaused = false)}
							ontouchstart={() => (isPaused = true)}
							ontouchend={() => setTimeout(() => (isPaused = false), 1000)}
							class="hide-scrollbar flex w-full cursor-grab gap-6 overflow-x-auto pt-4 pb-8 active:cursor-grabbing"
							role="list"
							aria-label="Galería de ganadores"
						>
							{#each [...ganadores, ...ganadores] as ganador, i (i)}
								<div
									class="w-[320px] shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition-transform hover:-translate-y-2 md:w-[350px]"
								>
									<div class="relative h-48 overflow-hidden">
										{#if ganador.imageUrl}
											<img
												src={ganador.imageUrl}
												alt={ganador.winnerName}
												class="h-full w-full object-cover"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center bg-slate-100">
												<span class="text-4xl">🏆</span>
											</div>
										{/if}
										{#if ganador.dateLabel}
											<span
												class="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold tracking-widest text-primary uppercase shadow-sm backdrop-blur-sm"
												>{ganador.dateLabel}</span
											>
										{/if}
									</div>
									<div class="p-6">
										<h4 class="mb-1 text-xl font-bold text-slate-900">{ganador.winnerName}</h4>
										{#if ganador.prize}
											<p class="mb-4 text-sm font-semibold text-accent-red">{ganador.prize}</p>
										{/if}
										{#if ganador.testimonial}
											<p class="text-sm text-slate-500 italic">"{ganador.testimonial}"</p>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.carousel-mask {
		mask-image: linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0,
			black 10%,
			black 90%,
			transparent 100%
		);
	}
</style>
