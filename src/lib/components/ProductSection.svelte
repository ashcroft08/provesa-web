<script>
	import { BadgeCheck, ShoppingBasket, Truck, Award } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { dbProducts = [] } = $props();

	const defaultProducts = [
		{
			id: 1,
			name: 'Arroz Premium Salguero',
			description:
				'El protagonista de la canasta familiar ecuatoriana. Seleccionamos los mejores granos para garantizar un arroz de alto rendimiento, blancura superior y el sabor que a tu familia le encanta.',
			images: [
				'https://images.unsplash.com/photo-1586528116311-ad86d51b90f4?auto=format&fit=crop&q=80&w=800',
				'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800',
				'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800'
			],
			features: [
				{ title: 'Grano Largo y Envejecido', desc: 'Perfecto para cocción uniforme.' },
				{ title: 'Ideal para el Hogar', desc: 'Presentaciones de 1kg, 2kg y 5kg.' },
				{ title: 'Distribución Directa', desc: 'Llegamos a tu negocio sin intermediarios.' }
			],
			categories: [],
			align: 'left',
			accentColor: 'primary',
			displayType: 'features'
		},
		{
			id: 2,
			name: 'Todo para tu Consumo Diario',
			description:
				'En Provesa somos tu aliado en distribución. Encuentra una amplia variedad de abarrotes de las mejores marcas con precios competitivos que cuidan tu economía familiar.',
			images: [
				'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
				'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800',
				'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800'
			],
			features: [],
			categories: [
				{ num: '01', name: 'Aceites', desc: 'Variedad de marcas y presentaciones para todo uso.' },
				{ num: '02', name: 'Azúcar', desc: 'Distribución directa de ingenios nacionales.' },
				{ num: '03', name: 'Harinas', desc: 'Para panificación y uso doméstico.' },
				{ num: '04', name: 'Granos', desc: 'Lentejas, frejoles y más de alta calidad.' }
			],
			align: 'right',
			accentColor: 'accent',
			displayType: 'categories'
		}
	];

	const featureIcons = [BadgeCheck, ShoppingBasket, Truck, Award];

	let products = $derived(dbProducts.length > 0 ? dbProducts : defaultProducts);
	let imageIndexes = $state([0, 0, 0, 0, 0]);
	/** @type {ReturnType<typeof setInterval>[]} */
	let intervals = [];

	function nextImage(productIndex, total) {
		imageIndexes[productIndex] = (imageIndexes[productIndex] + 1) % total;
	}

	onMount(() => {
		products.forEach((_, i) => {
			const interval = setInterval(
				() => nextImage(i, products[i].images?.length || 1),
				4000 + i * 500
			);
			intervals.push(interval);
		});
		return () => intervals.forEach(clearInterval);
	});
</script>

<section id="productos" class="relative overflow-hidden bg-white py-28 md:py-36">
	<!-- Decoración sutil de fondo -->
	<div
		class="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/3 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
	></div>

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Título de la sección -->
		<div class="mb-20 max-w-2xl md:mb-28">
			<span class="mb-4 inline-block text-sm font-bold tracking-widest text-primary uppercase"
				>Nuestros Productos</span
			>
			<h2 class="mb-5 text-4xl leading-tight font-extrabold text-slate-900 md:text-5xl">
				Tu Despensa <span class="text-primary">Completa</span>
			</h2>
			<div class="mb-6 flex items-center gap-2">
				<div class="h-1.5 w-16 rounded-full bg-secondary"></div>
				<div class="h-1.5 w-6 rounded-full bg-accent"></div>
				<div class="h-1.5 w-3 rounded-full bg-primary/30"></div>
			</div>
			<p class="text-lg leading-relaxed text-slate-500 md:text-xl">
				Desde el ahorro para tu hogar hasta el abastecimiento de tu negocio. Calidad y frescura en
				cada producto que llevas a tu mesa.
			</p>
		</div>

		<!-- Productos -->
		{#each products as product, i (product.id || i)}
			<div class="group mb-28 grid items-center gap-12 last:mb-0 md:grid-cols-2 lg:gap-20">
				<!-- Imagen/Slider -->
				<div class={product.align === 'right' ? 'order-1 md:order-2' : 'md:order-1'}>
					<div class="relative">
						<!-- Fondo decorativo rotado -->
						<div
							class="absolute -inset-3 rounded-4xl transition-transform duration-700 group-hover:rotate-0
							{product.align === 'left'
								? '-rotate-2 bg-linear-to-br from-primary/10 to-primary/5'
								: 'rotate-2 bg-linear-to-br from-secondary/15 to-accent/5'}"
						></div>

						<!-- Contenedor del slider -->
						<div
							class="relative aspect-3/4 overflow-hidden rounded-3xl shadow-2xl ring-1 shadow-slate-200/80 ring-black/5 transition-transform duration-500 group-hover:scale-[1.01] sm:aspect-square lg:aspect-4/3"
						>
							{#each product.images as img, j (j)}
								<img
									src={img}
									alt="{product.name} - Imagen descriptiva {j + 1}"
									class="absolute inset-0 h-full w-full object-cover transition-all duration-1200 ease-in-out"
									class:opacity-100={imageIndexes[i] === j}
									class:opacity-0={imageIndexes[i] !== j}
									class:scale-100={imageIndexes[i] === j}
									class:scale-105={imageIndexes[i] !== j}
								/>
							{/each}

							<!-- Overlay inferior sutil para los dots -->
							<div
								class="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/30 to-transparent"
							></div>

							<!-- Dots del slider -->
							<div class="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
								<!-- eslint-disable-next-line no-unused-vars -->
								{#each product.images as _, j (j)}
									<button
										onclick={() => (imageIndexes[i] = j)}
										class="rounded-full transition-all duration-300
										{imageIndexes[i] === j ? 'h-2 w-8 bg-white shadow-lg' : 'h-2 w-2 bg-white/50 hover:bg-white/80'}"
										aria-label="Ver imagen {j + 1}"
									></button>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Texto -->
				<div class={product.align === 'right' ? 'order-2 md:order-1' : 'md:order-2'}>
					<!-- Badge del producto -->
					<div
						class="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase
						{product.accentColor === 'primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}"
					>
						{#if product.accentColor === 'primary'}
							<Award size={14} />
						{:else}
							<ShoppingBasket size={14} />
						{/if}
						{product.accentColor === 'primary' ? 'Producto Estrella' : 'Abarrotes'}
					</div>

					<h3 class="mb-4 text-3xl leading-tight font-extrabold text-slate-900 md:text-4xl">
						{product.name}
					</h3>

					<!-- Línea decorativa -->
					<div
						class="mb-5 h-1 w-12 rounded-full {product.accentColor === 'primary'
							? 'bg-primary'
							: 'bg-secondary'}"
					></div>

					<p class="mb-8 text-base leading-relaxed text-slate-500 md:text-lg">
						{product.description}
					</p>

					<!-- Features -->
					{#if product.displayType === 'features' && product.features?.length}
						<div class="space-y-5">
							{#each product.features as feature, fi (fi)}
								<div
									class="flex items-start gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50/50"
								>
									<div
										class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
									>
										<svelte:component this={featureIcons[fi % featureIcons.length]} size={20} />
									</div>
									<div>
										<h4 class="text-sm font-bold text-slate-900">{feature.title}</h4>
										<p class="mt-0.5 text-sm text-slate-500">{feature.desc}</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Categorías -->
					{#if product.displayType === 'categories' && product.categories?.length}
						<div class="grid grid-cols-2 gap-5">
							{#each product.categories as cat, ci (ci)}
								<div
									class="group/cat rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-accent/20 hover:bg-accent/5 hover:shadow-sm"
								>
									<span
										class="mb-1 block text-3xl font-black text-accent/80 transition-colors group-hover/cat:text-accent"
										>{cat.num}</span
									>
									<h4 class="mb-1 text-sm font-bold text-slate-900">{cat.name}</h4>
									<p class="text-xs leading-relaxed text-slate-500">{cat.desc}</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>
