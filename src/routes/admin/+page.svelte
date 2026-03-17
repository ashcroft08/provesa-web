<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import DashboardTab from '$lib/components/admin/DashboardTab.svelte';
	import PersonalizacionTab from '$lib/components/admin/PersonalizacionTab.svelte';
	import FooterTab from '$lib/components/admin/FooterTab.svelte';
	import PaginasLegalesTab from '$lib/components/admin/PaginasLegalesTab.svelte';
	import SlidersTab from '$lib/components/admin/SlidersTab.svelte';
	import ProductosTab from '$lib/components/admin/ProductosTab.svelte';
	import NosotrosTab from '$lib/components/admin/NosotrosTab.svelte';
	import NosotrosPageTab from '$lib/components/admin/NosotrosPageTab.svelte';
	import SugerenciasTab from '$lib/components/admin/SugerenciasTab.svelte';
	import PostulacionesTab from '$lib/components/admin/PostulacionesTab.svelte';
	import ConfiguracionTab from '$lib/components/admin/ConfiguracionTab.svelte';
	import ConcursosTab from '$lib/components/admin/ConcursosTab.svelte';

	let { data, form } = $props();

	// Estado para los colores del tema (sincronizado con datos del servidor)
	let theme = $state({ primary: '#000000', secondary: '#000000', accent: '#000000', background: '#ffffff', navbarHover: '#455dd9' });

	// Estado para la pestaña activa
	let activeTab = $state('Dashboard');

	$effect(() => {
		if (data.theme) {
			theme = { ...theme, ...data.theme };
		}
	});

	// Estado para el guardado
	let isSaving = $state(false);

	// Calcular conteo de sugerencias no leídas
	let unreadSugerencias = $derived(data.sugerencias?.filter((s) => !s.leido).length || 0);

	let navItems = $derived([
		{ name: 'Dashboard', icon: 'dashboard' },
		{ name: 'Personalización', icon: 'palette' },
		{ name: 'Sliders', icon: 'slideshow' },
		{ name: 'Productos', icon: 'inventory_2' },
		{ name: 'Nosotros', icon: 'groups' },
		{ name: 'Footer', icon: 'web' },
		{ name: 'Páginas Legales', icon: 'policy' },
		{ name: 'Sugerencias', icon: 'chat_bubble_outline', badge: unreadSugerencias },
		{ name: 'Candidatos', icon: 'people_outline' },
		{ name: 'Concursos', icon: 'emoji_events' },
		{ name: 'Configuración', icon: 'settings' }
	]);
</script>

<svelte:head>
	<title>Panel Administrativo - PROVESA SCC</title>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="font-display flex min-h-screen bg-[#F1F5F9] text-slate-800 antialiased">
	<!-- Sidebar -->
	<AdminSidebar {navItems} bind:activeTab user={data.user} />

	<!-- Main Content -->
	<main class="min-h-screen grow lg:ml-72">
		<header
			class="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-100 bg-white/50 px-8 backdrop-blur-md"
		>
			<div class="flex items-center gap-4">
				<button class="text-slate-500 lg:hidden">
					<span class="material-icons">menu</span>
				</button>
				<h2 class="text-xl font-extrabold text-slate-900">{activeTab}</h2>
			</div>

			<div class="flex items-center gap-6">
				<!-- Search and View Site buttons removed as per user request -->
			</div>
		</header>

		<div class="p-8">
			{#if activeTab === 'Dashboard'}
				<DashboardTab {data} bind:activeTab />
			{:else if activeTab === 'Personalización'}
				<PersonalizacionTab bind:theme bind:isSaving formResult={form} />
			{:else if activeTab === 'Sliders'}
				<SlidersTab slides={data.slides || []} formResult={form} />
			{:else if activeTab === 'Productos'}
				<ProductosTab products={data.products || []} formResult={form} />
			{:else if activeTab === 'Nosotros'}
				<NosotrosPageTab nosotrosPage={data.nosotrosPageData} formResult={form} />
				<div class="mt-8"></div>
				<NosotrosTab nosotros={data.nosotros} formResult={form} />
			{:else if activeTab === 'Footer'}
				<FooterTab
					footerInfo={data.footer?.info}
					branches={data.footer?.branches || []}
					formResult={form}
				/>
			{:else if activeTab === 'Páginas Legales'}
				<PaginasLegalesTab legal={data.legal} formResult={form} />
			{:else if activeTab === 'Sugerencias'}
				<SugerenciasTab sugerencias={data.sugerencias || []} config={data.sugerenciasConfig} />
			{:else if activeTab === 'Candidatos'}
				<PostulacionesTab
					postulaciones={data.postulaciones || []}
					empleoSucursales={data.empleoSucursales || []}
				/>
			{:else if activeTab === 'Configuración'}
				<ConfiguracionTab siteConfig={data.siteConfig || {}} formResult={form} />
			{:else if activeTab === 'Concursos'}
				<ConcursosTab
					concursos={data.concursosList || []}
					ganadores={data.ganadoresList || []}
					formResult={form}
				/>
			{/if}
		</div>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.font-display {
		font-family: 'Work Sans', sans-serif;
	}
</style>
