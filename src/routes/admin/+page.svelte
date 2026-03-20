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
	import { driver } from 'driver.js';
	import 'driver.js/dist/driver.css';

	let { data, form } = $props();

	// Configuración del Tutorial
	const startTutorial = () => {
		const driverObj = driver({
			showProgress: true,
			nextBtnText: 'Siguiente',
			prevBtnText: 'Anterior',
			doneBtnText: 'Finalizar',
			allowClose: true,
			overlayColor: '#0052A5',
			overlayOpacity: 0.5,
			stagePadding: 10,
			popoverOffset: 12,
			steps: [
				{
					element: '#admin-logo',
					popover: {
						title: '🚀 ¡Bienvenido!',
						description:
							'Este es el Panel Maestro de Provesa SCC. Hemos diseñado este recorrido para que gestiones tu sitio con total confianza.',
						side: 'bottom',
						align: 'center'
					}
				},
				{
					element: '#nav-dashboard',
					popover: {
						title: '📊 Centro de Control',
						description:
							'Tu punto de partida. Aquí tienes un resumen ejecutivo de todo lo que ocurre en tu web en tiempo real.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#kpi-visitas',
					popover: {
						title: '📈 Métricas en Tiempo Real',
						description:
							'Monitorea el pulso de tu web: visitas totales, stock de productos y solicitudes pendientes.',
						side: 'bottom',
						align: 'center'
					},
					onHighlightStarted: () => {
						activeTab = 'Dashboard';
						// Delay para permitir que Svelte renderice los componentes del Dashboard
						setTimeout(() => {
							driverObj.refresh();
						}, 500);
					}
				},
				{
					element: '#nav-personalizacion',
					popover: {
						title: '🎨 Estética y Colores',
						description:
							'Define la identidad visual: ajusta colores primarios, secundarios y el efecto hover del menú superior.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-sliders',
					popover: {
						title: '🖼️ Banners Principales',
						description:
							'Gestiona las imágenes de la página de inicio. Atrae a tus visitantes con promociones impactantes.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-productos',
					popover: {
						title: '📦 Catálogo de Productos',
						description:
							'Sube nuevos productos, edita descripciones o actualiza el stock. Mantén tu inventario al día.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-nosotros',
					popover: {
						title: '🏢 Nuestra Historia',
						description:
							'Edita el contenido de la sección "Nosotros". Comparte la misión y valores de Provesa.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-footer',
					popover: {
						title: '🔗 Redes y Contacto',
						description:
							'Gestiona tus redes sociales, sucursales y datos de contacto oficiales que aparecen al final del sitio.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#first-activity-item',
					popover: {
						title: '🔔 Actividad Reciente',
						description:
							'Un vistazo rápido a los últimos mensajes de clientes y postulaciones de empleo recibidas.',
						side: 'bottom',
						align: 'center'
					},
					onHighlightStarted: () => {
						activeTab = 'Dashboard';
						setTimeout(() => {
							driverObj.refresh();
						}, 400);
					}
				},
				{
					element: '#nav-sugerencias',
					popover: {
						title: '💬 Mensajes de Clientes',
						description:
							'Revisa todas las consultas y sugerencias enviadas por los usuarios desde la web.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-candidatos',
					popover: {
						title: '💼 Banco de Talentos',
						description:
							'Administra las hojas de vida y perfiles de candidatos interesados en trabajar contigo.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-concursos',
					popover: {
						title: '🏆 Sorteos Activos',
						description:
							'Crea concursos, activa/desactiva sorteos y gestiona la lista de ganadores oficiales.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#nav-configuracion',
					popover: {
						title: '⚙️ Logo y Seguridad',
						description:
							'Aquí puedes actualizar el logo oficial de la empresa y cambiar tus credenciales de acceso.',
						side: 'right',
						align: 'center'
					}
				},
				{
					element: '#user-profile',
					popover: {
						title: '👤 Tu Área Personal',
						description:
							'Gestiona tu sesión y perfil administrativo. Recuerda siempre cerrar sesión al terminar tu jornada.',
						side: 'top',
						align: 'center'
					}
				}
			]
		});

		driverObj.drive();
	};

	// Estado para los colores del tema (sincronizado con datos del servidor)
	let theme = $state({
		primary: '#000000',
		secondary: '#000000',
		accent: '#000000',
		background: '#ffffff',
		navbarHover: 'var(--color-primary)'
	});

	// Estado para la pestaña activa
	let activeTab = $state('Dashboard');

	$effect(() => {
		if (data.theme) {
			theme = {
				...data.theme,
				navbarHover: data.theme.navbarHover || 'var(--color-primary)'
			};
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
				<!-- Botón Tutorial -->
				<button
					onclick={startTutorial}
					class="group flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
				>
					<span class="material-icons text-lg transition-transform group-hover:rotate-12"
						>help_outline</span
					>
					<span>Tutorial</span>
				</button>
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

	/* Estilos personalizados para Driver.js */
	:global(.driver-popover) {
		background: rgba(255, 255, 255, 0.98) !important;
		backdrop-filter: blur(20px);
		border-radius: 32px !important;
		padding: 28px !important;
		border: 1px solid rgba(255, 255, 255, 1) !important;
		box-shadow: 0 40px 60px -15px rgba(0, 82, 165, 0.2) !important;
		max-width: 420px !important;
		min-width: 320px !important;
	}

	:global(.driver-popover-title) {
		font-family: 'Work Sans', sans-serif !important;
		font-weight: 1000 !important;
		font-size: 1.4rem !important;
		color: #0f172a !important;
		margin-bottom: 14px !important;
		letter-spacing: -0.02em !important;
	}

	:global(.driver-popover-description) {
		font-family: 'Work Sans', sans-serif !important;
		font-weight: 500 !important;
		line-height: 1.7 !important;
		font-size: 0.95rem !important;
		color: #475569 !important;
	}

	:global(.driver-popover-footer) {
		margin-top: 24px !important;
		display: flex !important;
		justify-content: space-between !important;
		align-items: center !important;
		gap: 12px !important;
	}

	:global(.driver-popover-footer button) {
		background: #f1f5f9 !important;
		font-family: 'Work Sans', sans-serif !important;
		font-weight: 800 !important;
		font-size: 0.85rem !important;
		text-shadow: none !important;
		border: none !important;
		color: #1e293b !important;
		border-radius: 16px !important;
		padding: 10px 20px !important;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
	}

	:global(.driver-popover-footer .driver-popover-next-btn) {
		background: #0052a5 !important;
		color: white !important;
		box-shadow: 0 10px 15px -3px rgba(0, 82, 165, 0.3) !important;
	}

	:global(.driver-popover-footer .driver-popover-next-btn:hover) {
		background: #003d7a !important;
		transform: translateY(-2px) !important;
		box-shadow: 0 15px 20px -5px rgba(0, 82, 165, 0.4) !important;
	}

	:global(.driver-popover-arrow) {
		display: block !important;
		border-width: 10px !important;
		position: absolute !important;
		border-color: transparent !important;
		background: transparent !important;
	}

	/* Popover a la IZQUIERDA del elemento -> Flecha a la DERECHA del popover */
	:global(.driver-popover-arrow-side-left) {
		right: -20px !important;
		top: 50% !important;
		transform: translateY(-50%) !important;
		border-left-color: rgba(255, 255, 255, 1) !important;
		margin-top: 0 !important;
	}

	/* Popover a la DERECHA del elemento -> Flecha a la IZQUIERDA del popover */
	:global(.driver-popover-arrow-side-right) {
		left: -20px !important;
		top: 50% !important;
		transform: translateY(-50%) !important;
		border-right-color: rgba(255, 255, 255, 1) !important;
		margin-top: 0 !important;
	}

	/* Popover ARRIBA del elemento -> Flecha ABAJO del popover */
	:global(.driver-popover-arrow-side-top) {
		bottom: -20px !important;
		left: 50% !important;
		transform: translateX(-50%) !important;
		border-top-color: rgba(255, 255, 255, 1) !important;
		margin-left: 0 !important;
	}

	/* Popover ABAJO del elemento -> Flecha ARRIBA del popover */
	:global(.driver-popover-arrow-side-bottom) {
		top: -20px !important;
		left: 50% !important;
		transform: translateX(-50%) !important;
		border-bottom-color: rgba(255, 255, 255, 1) !important;
		margin-left: 0 !important;
	}

	/* Animación de entrada */
	:global(.driver-popover) {
		animation: driver-popover-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
	}

	@keyframes driver-popover-fade-in {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	:global(.driver-popover-progress-text) {
		font-family: 'Work Sans', sans-serif !important;
		font-weight: 900 !important;
		font-size: 0.8rem !important;
		color: #94a3b8 !important;
		letter-spacing: 0.05em !important;
	}
</style>
