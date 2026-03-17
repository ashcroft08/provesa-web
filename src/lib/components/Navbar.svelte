<script>
	// Logica variables, funciones y estados
	import defaultLogo from '$lib/assets/images/provesa-logo.png';
	import { Menu, X } from 'lucide-svelte';
	import { page } from '$app/state';

	let { transparent = false, logoUrl = '' } = $props();
	let logo = $derived(logoUrl || defaultLogo);

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
		<button onclick={() => window.location.assign('/')} class="group flex items-center gap-2">
			<!-- Logo replacement -->
			<img
				src={logo}
				alt="Provesa Logo"
				class="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
			/>
		</button>

		<div
			class="hidden items-center gap-10 text-sm font-medium tracking-wide text-slate-600 md:flex"
		>
			<button
				onclick={() => window.location.assign('/#inicio')}
				class="nav-link hover:text-(--color-navbar-hover) after:bg-(--color-navbar-hover)"
				>Inicio</button
			>
			<button
				onclick={() => window.location.assign('/#productos')}
				class="nav-link hover:text-(--color-navbar-hover) after:bg-(--color-navbar-hover)"
				>Productos</button
			>
			<button
				onclick={() => window.location.assign(nosotrosHref)}
				class="nav-link hover:text-(--color-navbar-hover) after:bg-(--color-navbar-hover)"
				>Nosotros</button
			>
			<button
				onclick={() => window.location.assign('/concursos')}
				class="nav-link hover:text-(--color-navbar-hover) after:bg-(--color-navbar-hover)"
				>Concursos</button
			>
			<button
				onclick={() => window.location.assign('/empleo')}
				class="nav-link hover:text-(--color-navbar-hover) after:bg-(--color-navbar-hover)"
				>Trabaja con Nosotros</button
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

		<button
			onclick={() => {
				menuOpen = false;
				window.location.assign('/#inicio');
			}}
			class="text-2xl font-bold text-slate-800 hover:text-primary"
		>
			Inicio
		</button>
		<button
			onclick={() => {
				menuOpen = false;
				window.location.assign('/#productos');
			}}
			class="text-2xl font-bold text-slate-800 hover:text-primary"
		>
			Productos
		</button>
		<button
			onclick={() => {
				menuOpen = false;
				window.location.assign(nosotrosHref);
			}}
			class="text-2xl font-bold text-slate-800 hover:text-primary"
		>
			Nosotros
		</button>
		<button
			onclick={() => {
				menuOpen = false;
				window.location.assign('/concursos');
			}}
			class="text-2xl font-bold text-slate-800 hover:text-primary"
		>
			Concursos
		</button>
		<button
			onclick={() => {
				menuOpen = false;
				window.location.assign('/empleo');
			}}
			class="text-2xl font-bold text-slate-800 hover:text-primary"
		>
			Trabaja con Nosotros
		</button>
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

	.nav-scrolled {
		background: rgba(255, 255, 255, 0.9) !important;
		backdrop-filter: blur(12px) !important;
		border-bottom-color: rgba(241, 245, 249, 1) !important;
	}

	.nav-link {
		position: relative;
		transition: color 0.3s ease;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		height: 2px;
		width: 0;
		transition: width 0.3s ease;
	}

	.nav-link:hover::after {
		width: 100%;
	}
</style>
