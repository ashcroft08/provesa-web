<script>
	import { fade, fly } from 'svelte/transition';
	import { Facebook, Instagram, Music2, Phone as WhatsApp, ArrowRight } from 'lucide-svelte';

	/** @type {{ footer: { facebookUrl?: string | null, instagramUrl?: string | null, tiktokUrl?: string | null, whatsappUrl?: string | null } | null }} */
	let { footer } = $props();

	// Fallback links si no están en la BD
	const socialLinks = $derived([
		{
			id: 'facebook',
			name: 'Facebook',
			icon: Facebook,
			url: footer?.facebookUrl || 'https://facebook.com',
			color: '#1877F2',
			shadow: 'rgba(24,119,242,0.3)'
		},
		{
			id: 'instagram',
			name: 'Instagram',
			icon: Instagram,
			url: footer?.instagramUrl || 'https://instagram.com',
			gradient:
				'linear-gradient(45deg, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
			shadow: 'rgba(214,36,159,0.3)'
		},
		{
			id: 'tiktok',
			name: 'TikTok',
			icon: Music2,
			url: footer?.tiktokUrl || 'https://tiktok.com',
			color: '#000000',
			shadow: 'rgba(0,0,0,0.3)'
		},
		{
			id: 'whatsapp',
			name: 'WhatsApp',
			icon: WhatsApp,
			url: footer?.whatsappUrl?.startsWith('http')
				? footer?.whatsappUrl
				: `https://wa.me/${footer?.whatsappUrl?.replace(/\s+/g, '') || '593'}`,
			color: '#25D366',
			shadow: 'rgba(37,211,102,0.3)'
		}
	]);

	/** @type {string | null} */
	let hovered = $state(null);
	let isVisible = $state(false); // Estado para controlar cuándo se ve la sección

	// Acción de Svelte para detectar cuando el elemento entra en pantalla
	/** @param {HTMLElement} element */
	function viewport(element) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isVisible = true;
					observer.unobserve(element); // Deja de observar una vez que ya apareció
				}
			},
			{ threshold: 0.2 } // Se dispara cuando el 20% de la sección es visible
		);

		observer.observe(element);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}
</script>

<section
	id="redes"
	class="relative overflow-hidden bg-soft-gray py-16 md:py-24 lg:py-32"
	use:viewport
>
	<div
		class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl transition-opacity duration-1000 {isVisible
			? 'opacity-100'
			: 'opacity-0'}"
	></div>
	<div
		class="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-secondary/5 blur-3xl transition-opacity duration-1000 {isVisible
			? 'opacity-100'
			: 'opacity-0'}"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
		<div
			class="relative flex flex-col items-center justify-between gap-12 rounded-[40px] border border-white bg-white/60 p-6 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-1000 sm:p-8 md:rounded-[60px] md:p-12 lg:flex-row lg:p-16 {isVisible
				? 'translate-y-0 opacity-100'
				: 'translate-y-10 opacity-0'}"
		>
			{#if isVisible}
				<div class="max-w-xl text-center lg:text-left" in:fade={{ duration: 800 }}>
					<span
						class="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black tracking-widest text-primary uppercase"
					>
						Comunidad Provesa
					</span>
					<h2 class="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
						Conéctate con <span class="text-primary italic">Provesa</span>
					</h2>
					<p class="text-base leading-relaxed font-medium text-slate-500 sm:text-lg">
						Siga nuestro día a día y entérese de novedades exclusivas, promociones y eventos
						especiales a través de nuestras redes oficiales.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-8 sm:flex sm:items-center sm:gap-6 lg:gap-8">
					{#each socialLinks as link, i (link.id)}
						{@const Icon = link.icon}
						<div
							class="flex flex-col items-center gap-3"
							in:fly={{ y: 30, delay: 150 * i, duration: 600 }}
						>
							<button
								onclick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
								aria-label={`Visitar nuestro perfil de ${link.name}`}
								onmouseenter={() => (hovered = link.id)}
								onmouseleave={() => (hovered = null)}
								class="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:rounded-[32px]"
								style:box-shadow={hovered === link.id ? `0 25px 50px -12px ${link.shadow}` : ''}
							>
								<!-- Background Gradient -->
								<div
									class="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									style:background={link.gradient || link.color}
								></div>

								<!-- Icon -->
								<Icon
									size={32}
									class="relative z-10 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-white"
								/>

								<!-- Shine effect -->
								<div
									class="absolute inset-0 scale-0 rounded-full bg-white/20 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"
								></div>
							</button>

							<!-- Label -->
							<div class="h-4 overflow-visible text-center">
								<span
									class="inline-block text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase transition-all duration-300 md:text-[11px]
									{hovered === link.id ? 'translate-y-0 text-slate-900 opacity-100' : 'translate-y-2 opacity-0'}"
								>
									{link.name}
								</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="absolute right-10 -bottom-6 hidden lg:block">
				<div
					class="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-slate-900/20 transition-transform duration-300 hover:-translate-y-1"
				>
					Síguenos hoy
					<ArrowRight size={14} class="text-secondary" />
				</div>
			</div>
		</div>
	</div>
</section>
