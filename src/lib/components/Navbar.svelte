<script>
	// Logica variables, funciones y estados
	import logo from '$lib/assets/images/provesa-logo.png';
	import { Menu, X } from 'lucide-svelte';
	import { page } from '$app/state';

	let { transparent = false } = $props();

	let scrolled = $state(false); // Estado reactivo para el scroll
	let menuOpen = $state(false); // Estado reactivo para el menu

	// El navbar es transparente solo si la prop lo permite Y no se ha hecho scroll
	let isTransparent = $derived(transparent && !scrolled);
	let nosotrosHref = $derived(page.url.pathname === '/' ? '/#nosotros-teaser' : '/nosotros');

	function handleScroll() {
		scrolled = window.scrollY > 50;
	}
</script>

<!-- HTML con clases de Tailwind -->

<nav
	class="glass-nav fixed top-0 z-50 w-full border-b border-slate-100 transition-all duration-300"
	class:nav-scrolled={!isTransparent}
	class:nav-transparent={isTransparent}
>
	<div class="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
		<a href="/" class="group flex items-center gap-2">
			<!-- Logo replacement -->
			<img
				src={logo}
				alt="Provesa Logo"
				class="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
			/>
		</a>

		<div
			class="hidden items-center gap-10 text-sm font-medium tracking-wide text-slate-600 md:flex"
		>
			<a
				href="/#inicio"
				class="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:text-primary hover:after:w-full"
				>Inicio</a
			>
			<a
				href="/#productos"
				class="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:text-primary hover:after:w-full"
				>Productos</a
			>
			<a
				href={nosotrosHref}
				class="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:text-primary hover:after:w-full"
				>Nosotros</a
			>
			<a
				href="/concursos"
				class="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:text-primary hover:after:w-full"
				>Concursos</a
			>
			<a
				href="/empleo"
				class="relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:content-[''] hover:text-primary hover:after:w-full"
				>Trabaja con Nosotros</a
			>
		</div>

		<!-- Boton para abrir el menu -->
		<button onclick={() => (menuOpen = true)} class="text-primary md:hidden">
			<Menu size={24} color="currentColor" stroke-width={2} />
		</button>
	</div>
</nav>

{#if menuOpen}
	<div
		class="fixed inset-0 z-[100] flex flex-col items-center
              justify-center gap-8 bg-white/95 backdrop-blur-xl md:hidden"
	>
		<!-- Botón cerrar -->
		<button
			onclick={() => (menuOpen = false)}
			class="absolute top-8 right-8 text-slate-400 hover:text-primary"
		>
			<X size={28} color="currentColor" stroke-width={2} />
		</button>

		<img src={logo} alt="Provesa Logo" class="mb-4 h-20 w-auto" />

		<a
			onclick={() => (menuOpen = false)}
			href="/#inicio"
			class="text-2xl font-bold text-slate-800 hover:text-primary">Inicio</a
		>
		<a
			onclick={() => (menuOpen = false)}
			href="/#productos"
			class="text-2xl font-bold text-slate-800 hover:text-primary">Productos</a
		>
		<a
			onclick={() => (menuOpen = false)}
			href={nosotrosHref}
			class="text-2xl font-bold text-slate-800 hover:text-primary">Nosotros</a
		>
		<a
			onclick={() => (menuOpen = false)}
			href="/concursos"
			class="text-2xl font-bold text-slate-800 hover:text-primary">Concursos</a
		>
		<a
			onclick={() => (menuOpen = false)}
			href="/empleo"
			class="text-2xl font-bold text-slate-800 hover:text-primary">Trabaja con Nosotros</a
		>
	</div>
{/if}

<!-- Y escuchás el evento en la etiqueta svelte:window -->
<svelte:window onscroll={handleScroll} />

<style>
	/* Navbar base con efecto vidrio */
	.glass-nav {
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(12px);
	}

	/* Navbar transparente (sobre el hero slider) */
	.nav-transparent {
		background: transparent !important;
		backdrop-filter: none !important;
		border-bottom-color: transparent !important;
	}

	/* Cuando es transparente, los links se ven blancos */
	.nav-transparent :global(.text-slate-600) {
		color: white !important;
	}

	/* El logo se invierte a blanco */
	.nav-transparent img {
		filter: brightness(0) invert(1);
	}

	/* Navbar sólido al hacer scroll */
	.nav-scrolled {
		background: rgba(255, 255, 255, 0.9) !important;
		backdrop-filter: blur(12px) !important;
		border-bottom-color: rgba(241, 245, 249, 1) !important;
	}
</style>
