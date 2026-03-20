<script>
	import { fade } from 'svelte/transition';

	let { data = {}, activeTab = $bindable() } = $props();

	// Cálculos dinámicos
	let totalProducts = $derived(data.products?.length || 0);
	let unreadSugerencias = $derived(data.sugerencias?.filter((/** @type {any} */ s) => !s.leido).length || 0);
	let totalPostulaciones = $derived(data.postulaciones?.length || 0);
	let totalVisitas = $derived(data.analytics?.totalViews || 0);
	let topPages = $derived(data.analytics?.byPage || []);

	// Combinar actividad reciente (sugerencias y postulaciones)
	let recentActivity = $derived(
		[
			...(data.sugerencias || []).map((/** @type {any} */ s) => ({
				id: s.id,
				type: 'Sugerencia',
				title: `Nueva sugerencia de ${s.nombre || 'Anónimo'}`,
				date: new Date(s.createdAt),
				icon: 'forum',
				color: 'text-green-600',
				bgColor: 'bg-green-50',
				tab: 'Sugerencias'
			})),
			...(data.postulaciones || []).map((/** @type {any} */ p) => ({
				id: p.id,
				type: 'Candidato',
				title: `Nueva postulación: ${p.nombre}`,
				date: new Date(p.createdAt),
				icon: 'work',
				color: 'text-orange-600',
				bgColor: 'bg-orange-50',
				tab: 'Candidatos'
			}))
		]
			.sort((a, b) => b.date - a.date)
			.slice(0, 5)
	);

	/** @param {string} tab */
	function navigateTo(tab) {
		activeTab = tab;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Formatear fecha relativa simple
	/** @param {Date} date */
	function formatRelative(date) {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 60) return `Hace ${diffMins} min`;
		if (diffHours < 24) return `Hace ${diffHours} horas`;
		return `Hace ${diffDays} días`;
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-10">
	<!-- KPIs Real-time -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" id="dashboard-kpis">
		<!-- Visitas -->
		<div
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
				<span class="material-icons text-indigo-600">visibility</span>
			</div>
			<div>
				<p class="text-[10px] font-black tracking-wider text-slate-400 uppercase">Visitas Totales</p>
				<h3 class="text-2xl font-black text-slate-900">{totalVisitas}</h3>
			</div>
		</div>

		<!-- Productos -->
		<button
			onclick={() => navigateTo('Productos')}
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
				<span class="material-icons text-primary">inventory_2</span>
			</div>
			<div>
				<p class="text-[10px] font-black tracking-wider text-slate-400 uppercase">Total Productos</p>
				<h3 class="text-2xl font-black text-slate-900">{totalProducts}</h3>
			</div>
		</button>

		<!-- Sugerencias -->
		<button
			onclick={() => navigateTo('Sugerencias')}
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
				<span class="material-icons text-green-600">forum</span>
			</div>
			<div>
				<p class="text-[10px] font-black tracking-wider text-slate-400 uppercase">Sugerencias Pend.</p>
				<h3 class="text-2xl font-black text-slate-900">{unreadSugerencias}</h3>
			</div>
		</button>

		<!-- Candidatos -->
		<button
			onclick={() => navigateTo('Candidatos')}
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6 text-left shadow-sm transition-all"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
				<span class="material-icons text-orange-600">work</span>
			</div>
			<div>
				<p class="text-[10px] font-black tracking-wider text-slate-400 uppercase">Postulaciones</p>
				<h3 class="text-2xl font-black text-slate-900">{totalPostulaciones}</h3>
			</div>
		</button>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Actividad Reciente -->
		<div class="lg:col-span-2 space-y-8" id="recent-activity">
			<div class="rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm">
				<div class="mb-6 flex items-center justify-between">
					<h4 class="text-xl font-black text-slate-900">Actividad Reciente</h4>
					<span class="text-xs font-bold text-slate-400">Últimas 5 interacciones</span>
				</div>

				<div class="space-y-4">
					{#if recentActivity.length > 0}
						{#each recentActivity as activity (activity.id)}
							<button
								onclick={() => navigateTo(activity.tab)}
								class="flex w-full items-center gap-4 rounded-3xl border border-slate-50 bg-slate-50/50 p-4 text-left transition-all hover:border-primary/20 hover:bg-white hover:shadow-md"
							>
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl {activity.bgColor} {activity.color}"
								>
									<span class="material-icons text-xl">{activity.icon}</span>
								</div>
								<div class="grow">
									<p class="text-sm font-black text-slate-800">{activity.title}</p>
									<p class="text-xs font-bold text-slate-400">{activity.type}</p>
								</div>
								<div class="text-right">
									<p class="text-[10px] font-black text-slate-400 uppercase">
										{formatRelative(activity.date)}
									</p>
									<span class="material-icons text-slate-300">chevron_right</span>
								</div>
							</button>
						{/each}
					{:else}
						<div class="py-10 text-center">
							<div
								class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
							>
								<span class="material-icons text-3xl">history</span>
							</div>
							<p class="font-bold text-slate-400">No hay actividad reciente registrada</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Páginas más visitadas -->
			<div class="rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm">
				<h4 class="mb-6 text-xl font-black text-slate-900">Movimientos de mi página</h4>
				<div class="grid gap-4">
					{#if topPages.length > 0}
						{#each topPages as page (page.path)}
							<div class="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
										<span class="material-icons text-sm text-slate-400">link</span>
									</div>
									<span class="text-sm font-bold text-slate-700">{page.path}</span>
								</div>
								<div class="flex items-center gap-4">
									<div class="text-right">
										<p class="text-xs font-black text-slate-900">{page.count} vistas</p>
										<p class="text-[9px] font-bold text-slate-400 uppercase">Reciente: {formatRelative(new Date(page.lastVisit))}</p>
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<p class="text-center text-sm font-bold text-slate-400 py-4 italic">Esperando datos de navegación...</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Accesos Rápidos -->
		<div class="space-y-6" id="quick-access">
			<div
				class="relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-8 shadow-sm"
			>
				<h4 class="relative z-10 mb-6 text-xl font-black text-slate-900">Accesos Directos</h4>
				<div class="relative z-10 grid gap-3">
					<button
						onclick={() => navigateTo('Sliders')}
						class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 active:scale-[0.98]"
					>
						<span class="material-icons text-indigo-500">slideshow</span>
						<span class="text-sm font-bold text-slate-700">Cambiar Banner</span>
					</button>
					<button
						onclick={() => navigateTo('Productos')}
						class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 active:scale-[0.98]"
					>
						<span class="material-icons text-blue-500">add_circle</span>
						<span class="text-sm font-bold text-slate-700">Agregar Producto</span>
					</button>
					<button
						onclick={() => navigateTo('Concursos')}
						class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 active:scale-[0.98]"
					>
						<span class="material-icons text-purple-500">emoji_events</span>
						<span class="text-sm font-bold text-slate-700">Gestionar Sorteos</span>
					</button>
					<button
						onclick={() => navigateTo('Configuración')}
						class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 active:scale-[0.98]"
					>
						<span class="material-icons text-slate-500">settings</span>
						<span class="text-sm font-bold text-slate-700">Configuración</span>
					</button>
				</div>
			</div>

			<!-- Mensaje de Bienvenida -->
			<div class="rounded-[40px] bg-primary p-8 text-white shadow-xl shadow-primary/20">
				<h5 class="mb-2 text-lg font-black italic">Hola, {data.user?.name || 'Admin'}</h5>
				<p class="text-xs font-bold opacity-80 leading-relaxed">
					Aquí puedes monitorear el pulso de <span class="underline">Provesa</span>. Revisa los nuevos mensajes y candidatos hoy mismo.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.stat-card {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
	}
</style>
