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
</script>

{#if showChrome}
	<Navbar />
{/if}

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

{#if showChrome}
	<Footer footer={data?.footer} />
{/if}
