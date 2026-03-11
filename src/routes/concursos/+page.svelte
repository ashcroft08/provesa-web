<script>
	import { onMount } from 'svelte';
	import { Calendar, Gift, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let { data } = $props();

	let concurso = $derived(data.concurso);
	let ganadores = $derived(data.ganadores || []);

	let carousel;
	let isPaused = false;
	let scrollAmount = 1;
	const cardWidth = 350 + 24;

	onMount(() => {
		if (carousel && ganadores.length > 0) {
			// Duplicar contenido para scroll infinito
			carousel.innerHTML += carousel.innerHTML;

			const autoScroll = () => {
				if (!isPaused) {
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
			carousel.style.scrollBehavior = 'auto';
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
			carousel.style.scrollBehavior = 'smooth';
			carousel.scrollLeft -= cardWidth;
			setTimeout(() => {
				carousel.style.scrollBehavior = 'auto';
				isPaused = false;
			}, 500);
		});
	}
</script>

<svelte:head>
	<title>Concursos y Ganadores - PROVESA SCC</title>
</svelte:head>

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
									class="bg-accent-red absolute top-6 left-6 rounded px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm sm:text-xs"
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
									{@html concurso.description}
								</p>
							{/if}

							<div class="mb-10 grid grid-cols-2 gap-4">
								{#if concurso.closeDate}
									<div class="rounded-xl border border-slate-100 bg-slate-50 p-5">
										<Calendar size={32} class="text-primary mb-2" />
										<span
											class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
											>Cierre</span
										>
										<span class="block text-lg font-bold text-slate-800"
											>{concurso.closeDate}</span
										>
									</div>
								{/if}
								{#if concurso.prizeName}
									<div class="rounded-xl border border-slate-100 bg-slate-50 p-5">
										<Gift size={32} class="text-accent-yellow mb-2" />
										<span
											class="mb-1 block text-xs font-bold tracking-wider text-slate-400 uppercase"
											>Premio Principal</span
										>
										<span class="block text-lg font-bold text-slate-800"
											>{concurso.prizeName}</span
										>
									</div>
								{/if}
							</div>

							<div>
								{#if concurso.ctaText}
									<button
										class="bg-primary w-full rounded-xl px-8 py-4 text-center font-bold text-white shadow-sm transition-colors hover:bg-blue-800 sm:w-auto"
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
				<div class="mb-24 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
					<p class="text-lg text-slate-400">No hay concursos activos en este momento.</p>
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
						>
							{#each ganadores as ganador}
								<div
									class="w-[320px] flex-shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg transition-transform hover:-translate-y-2 md:w-[350px]"
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
												class="text-primary absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm backdrop-blur-sm"
												>{ganador.dateLabel}</span
											>
										{/if}
									</div>
									<div class="p-6">
										<h4 class="mb-1 text-xl font-bold text-slate-900">{ganador.winnerName}</h4>
										{#if ganador.prize}
											<p class="text-accent-red mb-4 text-sm font-semibold">{ganador.prize}</p>
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
