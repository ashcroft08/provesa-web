<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	// Definimos las rutas donde NO queremos mostrar el Navbar
	const excludedRoutes = ['/login', '/recuperar', '/restablecer-password', '/admin'];

	// El Navbar se oculta si:
	// 1. Hay un error (estamos en la página de error)
	// 2. La ruta está en nuestra lista de excluidos
	let showNavbar = $derived(!page.error && !excludedRoutes.includes(page.url.pathname));
</script>

{#if showNavbar}
	<Navbar />
{/if}

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
