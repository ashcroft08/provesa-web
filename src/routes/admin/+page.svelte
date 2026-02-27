<script>
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import DashboardTab from '$lib/components/admin/DashboardTab.svelte';
	import PersonalizacionTab from '$lib/components/admin/PersonalizacionTab.svelte';
	import FooterTab from '$lib/components/admin/FooterTab.svelte';
	import PaginasLegalesTab from '$lib/components/admin/PaginasLegalesTab.svelte';
	import SlidersTab from '$lib/components/admin/SlidersTab.svelte';
	import ProductosTab from '$lib/components/admin/ProductosTab.svelte';
	import PlaceholderTab from '$lib/components/admin/PlaceholderTab.svelte';

	let { data, form } = $props();

	// Estado para los colores del tema (se sincroniza con datos del servidor)
	let theme = $state({ primary: '', secondary: '', accent: '', background: '' });

	// Estado para la pestaña activa
	let activeTab = $state('Dashboard');

	// Sincronizar tema cuando el servidor devuelve datos (carga inicial + post-guardado)
	$effect(() => {
		theme = { ...data.theme };
	});

	// Estado para el guardado
	let isSaving = $state(false);

	let navItems = [
		{ name: 'Dashboard', icon: 'dashboard' },
		{ name: 'Personalización', icon: 'palette' },
		{ name: 'Sliders', icon: 'slideshow' },
		{ name: 'Productos', icon: 'inventory_2' },
		{ name: 'Footer', icon: 'web' },
		{ name: 'Páginas Legales', icon: 'policy' },
		{ name: 'Sugerencias', icon: 'chat_bubble_outline', badge: 4 },
		{ name: 'Candidatos', icon: 'people_outline' },
		{ name: 'Configuración', icon: 'settings' }
	];
</script>

<svelte:head>
	<title>Panel Administrativo - PROVESA SCC</title>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</svelte:head>

<div class="font-display flex min-h-screen bg-[#F1F5F9] text-slate-800 antialiased">
	<!-- Sidebar -->
	<AdminSidebar {navItems} bind:activeTab user={data.user} />

	<!-- Main Content -->
	<main class="min-h-screen flex-grow lg:ml-72">
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
				<div class="relative hidden sm:block">
					<span
						class="material-icons absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400"
						>search</span
					>
					<input
						type="text"
						placeholder="Buscar apartado..."
						class="w-64 rounded-xl border-none bg-slate-100 py-2 pr-4 pl-10 text-sm focus:ring-primary/20"
					/>
				</div>
				<button class="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100">
					<span class="material-icons">public</span>
					<span
						class="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-green-500"
					></span>
				</button>
			</div>
		</header>

		<div class="p-8">
			{#if activeTab === 'Dashboard'}
				<DashboardTab />
			{:else if activeTab === 'Personalización'}
				<PersonalizacionTab bind:theme bind:isSaving formResult={form} />
			{:else if activeTab === 'Sliders'}
				<SlidersTab slides={data.slides || []} formResult={form} />
			{:else if activeTab === 'Productos'}
				<ProductosTab products={data.products || []} formResult={form} />
			{:else if activeTab === 'Footer'}
				<FooterTab
					footerInfo={data.footer?.info}
					branches={data.footer?.branches || []}
					formResult={form}
				/>
			{:else if activeTab === 'Páginas Legales'}
				<PaginasLegalesTab legal={data.legal} formResult={form} />
			{:else if activeTab === 'Sugerencias'}
				<PlaceholderTab title="Sugerencias" icon="chat_bubble_outline" />
			{:else if activeTab === 'Candidatos'}
				<PlaceholderTab title="Candidatos" icon="people_outline" />
			{:else if activeTab === 'Configuración'}
				<PlaceholderTab title="Configuración" icon="settings" />
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
