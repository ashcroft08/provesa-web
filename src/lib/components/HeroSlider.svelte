<script>
	import { onMount } from 'svelte';
	import { ChevronsLeft, ChevronsRight } from 'lucide-svelte';

	let { slides: dbSlides = [] } = $props();

	const defaultSlides = [
		{
			imageUrl:
				'https://images.unsplash.com/photo-1586528116311-ad86d51b90f4?auto=format&fit=crop&q=80&w=1920',
			title: 'El pulso de la',
			highlight: 'distribución',
			highlightColor: 'text-accent-yellow',
			description:
				'Garantizamos el abastecimiento estratégico que su negocio necesita para crecer. Calidad mayorista en La Concordia.',
			badge: 'Solidez desde 2006',
			align: 'left'
		},
		{
			imageUrl:
				'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1920',
			title: 'Infraestructura',
			highlight: 'Clase A',
			highlightColor: 'text-primary',
			description:
				'Contamos con la tecnología y el espacio para asegurar que sus productos se mantengan en condiciones óptimas.',
			badge: '',
			align: 'right'
		},
		{
			imageUrl:
				'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920',
			title: 'Calidad en cada',
			highlight: 'detalle',
			highlightColor: 'text-accent-red',
			description:
				'Desde arroz premium hasta abarrotes de consumo masivo. Todo lo que su negocio necesita en un solo lugar.',
			badge: '',
			align: 'center'
		}
	];

	let slides = $derived(dbSlides.length > 0 ? dbSlides : defaultSlides);
	let currentIndex = $state(0);
	let isTransitioning = $state(false);

	function goToSlide(index) {
		if (index === currentIndex || isTransitioning) return;
		isTransitioning = true;
		currentIndex = index;
		setTimeout(() => (isTransitioning = false), 1000);
	}

	function nextSlide() {
		goToSlide((currentIndex + 1) % slides.length);
	}

	onMount(() => {
		const interval = setInterval(nextSlide, 6000);
		return () => clearInterval(interval);
	});
</script>

<section
	id="inicio"
	class="hero-slider relative h-screen max-h-[900px] min-h-[600px] overflow-hidden"
>
	{#each slides as sl, i}
		<div
			class="absolute inset-0 transition-all duration-[1200ms] ease-in-out"
			class:opacity-100={currentIndex === i}
			class:opacity-0={currentIndex !== i}
			class:scale-100={currentIndex === i}
			class:scale-105={currentIndex !== i}
			style="z-index: {currentIndex === i ? 10 : 0};"
		>
			<!-- Imagen con ken burns suave -->
			<img
				src={sl.imageUrl}
				alt={sl.title || `Slide ${i + 1}`}
				class="h-full w-full object-cover {currentIndex === i ? 'animate-ken-burns' : ''}"
			/>

			<!-- Overlay con gradiente más rico -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
			<div
				class="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"
			></div>

			<!-- Contenido -->
			<div class="absolute inset-0 flex items-center">
				<div
					class="mx-auto w-full max-w-7xl px-8 md:px-16"
					class:text-left={sl.align === 'left'}
					class:text-right={sl.align === 'right'}
					class:text-center={sl.align === 'center'}
				>
					<div
						class="max-w-2xl"
						class:ml-auto={sl.align === 'right'}
						class:mx-auto={sl.align === 'center'}
					>
						<!-- Badge -->
						{#if sl.badge}
							<div
								class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/90 uppercase backdrop-blur-md"
								class:slide-in-up={currentIndex === i}
							>
								<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
								{sl.badge}
							</div>
						{/if}

						<!-- Título -->
						<h2
							class="slide-title mb-4 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
							class:slide-in-up={currentIndex === i}
						>
							{sl.title}{#if sl.highlight}{' '}<span
									class="{sl.highlightColor || 'text-accent-yellow'} drop-shadow-lg"
									>{sl.highlight}</span
								>{/if}
						</h2>

						<!-- Descripción -->
						{#if sl.description}
							<p
								class="mb-8 max-w-lg text-base leading-relaxed font-light text-white/80 sm:text-lg md:text-xl"
								class:ml-auto={sl.align === 'right'}
								class:mx-auto={sl.align === 'center'}
								class:slide-in-up={currentIndex === i}
							>
								{sl.description}
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/each}

	<!-- Navigation Dots mejorados -->
	{#if slides.length > 1}
		<div class="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
			{#each slides as _, i}
				<button
					onclick={() => goToSlide(i)}
					class="group relative h-2 rounded-full transition-all duration-500 {currentIndex === i
						? 'w-10 bg-white'
						: 'w-2 bg-white/40 hover:bg-white/60'}"
					aria-label="Ir al slide {i + 1}"
				>
					{#if currentIndex === i}
						<span class="absolute inset-0 animate-pulse rounded-full bg-white/50"></span>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Flechas laterales -->
		<button
			onclick={() => goToSlide((currentIndex - 1 + slides.length) % slides.length)}
			class="absolute top-1/2 left-4 z-40 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white md:left-8 md:p-3"
			aria-label="Slide anterior"
		>
			<ChevronsLeft size={24} />
		</button>
		<button
			onclick={() => nextSlide()}
			class="absolute top-1/2 right-4 z-40 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white/70 backdrop-blur-sm transition-all hover:bg-black/40 hover:text-white md:right-8 md:p-3"
			aria-label="Siguiente slide"
		>
			<ChevronsRight size={24} />
		</button>
	{/if}

	<!-- Gradiente inferior para transición suave al contenido -->
	<div
		class="absolute right-0 bottom-0 left-0 z-20 h-24 bg-gradient-to-t from-background to-transparent"
	></div>
</section>

<style>
	@keyframes ken-burns {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.08);
		}
	}

	.animate-ken-burns {
		animation: ken-burns 8s ease-out forwards;
	}

	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.slide-in-up {
		animation: slideInUp 0.8s ease-out forwards;
		animation-delay: 0.3s;
		opacity: 0;
	}

	.slide-title.slide-in-up {
		animation-delay: 0.15s;
	}

	p.slide-in-up {
		animation-delay: 0.45s;
	}
</style>
