<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	// Definimos las rutas donde NO queremos mostrar el Navbar ni Footer
	const excludedRoutes = ['/login', '/recuperar', '/restablecer-password', '/admin'];

	// El Navbar/Footer se oculta si:
	// 1. Hay un error (estamos en la página de error)
	// 2. La ruta está en nuestra lista de excluidos
	let showChrome = $derived(!page.error && !excludedRoutes.includes(page.url.pathname));
	let isHome = $derived(page.url.pathname === '/');
</script>

{#if showChrome}
	<Navbar transparent={isHome} logoUrl={data?.siteConfig?.logoUrl} />
{/if}

<!-- Aplicación dinámica de colores del tema -->
<svelte:head>
	<link rel="icon" href={favicon} />
	{#if data?.theme}
		<style>
			:root {
				--color-primary: {data.theme.primary} !important;
				--color-secondary: {data.theme.secondary} !important;
				--color-accent: {data.theme.accent} !important;
				--color-background: {data.theme.background} !important;
				--color-navbar-hover: {data.theme.navbarHover} !important;

				/* Aliases */
				--color-accent-red: {data.theme.accent} !important;
				--color-accent-yellow: {data.theme.secondary} !important;
			}
		</style>
	{/if}
</svelte:head>

{@render children()}

{#if showChrome}
	<Footer footer={data?.footer} logoUrl={data?.siteConfig?.logoUrl} />
{/if}
