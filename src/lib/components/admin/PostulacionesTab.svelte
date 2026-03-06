<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { postulaciones = [], empleoSucursales = [] } = $props();

	let searchQuery = $state('');
	let sucursalFilter = $state('all');
	let newSucursal = $state('');

	/** @type {{id:number, nombre:string, activa:boolean}[]} */
	let sucursalesList = $derived(empleoSucursales);

	let activeSucursales = $derived(sucursalesList.filter((s) => s.activa));

	let filtered = $derived(
		postulaciones.filter((p) => {
			const matchesSearch =
				!searchQuery ||
				(p.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.email || '').toLowerCase().includes(searchQuery.toLowerCase());

			const matchesSucursal = sucursalFilter === 'all' || p.sucursal === sucursalFilter;

			return matchesSearch && matchesSucursal;
		})
	);

	/** @param {any} date */
	function formatDate(date) {
		if (!date) return '';
		return new Date(date).toLocaleString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<!-- ═══ Gestión de Sucursales ═══ -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8">
			<h3 class="text-2xl font-black text-slate-900">Sucursales de Empleo</h3>
			<p class="mt-1 text-sm text-slate-500">
				Gestiona las sucursales que aparecen en el formulario de postulación.
			</p>
		</div>

		<!-- Lista de sucursales -->
		<div class="mb-6 space-y-3">
			{#each sucursalesList as suc (suc.id)}
				<div
					in:slide={{ duration: 200 }}
					class="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-3 transition-all {suc.activa
						? 'bg-white'
						: 'bg-slate-50 opacity-60'}"
				>
					<div class="flex items-center gap-3">
						<span
							class="flex h-8 w-8 items-center justify-center rounded-full {suc.activa
								? 'bg-green-100 text-green-600'
								: 'bg-slate-200 text-slate-400'}"
						>
							<span class="material-icons text-sm"
								>{suc.activa ? 'store' : 'store_mall_directory'}</span
							>
						</span>
						<span class="text-sm font-bold text-slate-700">{suc.nombre}</span>
						{#if !suc.activa}
							<span
								class="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500"
								>Inactiva</span
							>
						{/if}
					</div>

					<div class="flex items-center gap-2">
						<!-- Toggle activa/inactiva -->
						<form
							method="POST"
							action="?/toggleEmpleoSucursal"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={suc.id} />
							<input type="hidden" name="activa" value={!suc.activa} />
							<button
								type="submit"
								class="flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-all {suc.activa
									? 'border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100'
									: 'border border-green-200 bg-green-50 text-green-600 hover:bg-green-100'}"
								title={suc.activa ? 'Desactivar' : 'Activar'}
							>
								<span class="material-icons text-sm">{suc.activa ? 'toggle_on' : 'toggle_off'}</span
								>
								{suc.activa ? 'Desactivar' : 'Activar'}
							</button>
						</form>

						<!-- Eliminar -->
						<form
							method="POST"
							action="?/deleteEmpleoSucursal"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={suc.id} />
							<button
								type="submit"
								onclick={(e) =>
									!confirm(`¿Eliminar la sucursal "${suc.nombre}"?`) && e.preventDefault()}
								class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-300 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500"
								title="Eliminar"
							>
								<span class="material-icons text-sm">delete</span>
							</button>
						</form>
					</div>
				</div>
			{/each}

			{#if sucursalesList.length === 0}
				<div class="rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center">
					<span class="material-icons mb-2 text-3xl text-slate-300">add_business</span>
					<p class="text-sm font-bold text-slate-400">No hay sucursales configuradas</p>
					<p class="text-xs text-slate-400">
						Agrega una sucursal para que aparezca en el formulario de empleo.
					</p>
				</div>
			{/if}
		</div>

		<!-- Agregar nueva -->
		<form
			method="POST"
			action="?/addEmpleoSucursal"
			use:enhance={() => {
				return async ({ update }) => {
					newSucursal = '';
					await update();
				};
			}}
			class="flex gap-2"
		>
			<input
				type="text"
				name="nombre"
				bind:value={newSucursal}
				placeholder="Nombre de nueva sucursal"
				class="flex-1 rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
			/>
			<button
				type="submit"
				disabled={!newSucursal.trim()}
				class="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-40"
			>
				<span class="material-icons text-sm">add</span> Agregar
			</button>
		</form>
	</div>

	<!-- ═══ Postulaciones Recibidas ═══ -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Postulaciones Recibidas</h3>
				<p class="mt-1 text-sm text-slate-500">
					Candidatos que han enviado su hoja de vida a través de la página de empleo.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
					{postulaciones.length} postulación{postulaciones.length !== 1 ? 'es' : ''}
				</span>
				<a
					href="/empleo"
					target="_blank"
					class="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
				>
					<span class="material-icons text-sm">open_in_new</span> Ver Formulario
				</a>
			</div>
		</div>

		<!-- Filtros -->
		<div class="mb-8 grid gap-4 md:grid-cols-2">
			<div class="relative">
				<span class="material-icons absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"
					>search</span
				>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Buscar por nombre o email..."
					class="w-full rounded-2xl border-slate-100 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:bg-white focus:ring-primary/20"
				/>
			</div>
			<div class="relative">
				<span class="material-icons absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"
					>filter_list</span
				>
				<select
					bind:value={sucursalFilter}
					class="w-full appearance-none rounded-2xl border-slate-100 bg-slate-50 py-3 pr-10 pl-10 text-sm focus:bg-white focus:ring-primary/20"
				>
					<option value="all">Todas las sucursales</option>
					{#each sucursalesList as s}
						<option value={s.nombre}>{s.nombre}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Lista -->
		{#if filtered.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 py-20 text-center"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
				>
					<span class="material-icons text-3xl">person_search</span>
				</div>
				<h4 class="text-lg font-bold text-slate-900">No hay postulaciones</h4>
				<p class="mt-1 max-w-xs text-sm text-slate-400">
					{searchQuery || sucursalFilter !== 'all'
						? 'Prueba a ajustar los filtros.'
						: 'Las postulaciones aparecerán aquí cuando los candidatos envíen el formulario.'}
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filtered as p (p.id)}
					<div
						in:slide={{ duration: 200 }}
						class="group relative overflow-hidden rounded-3xl border border-slate-100 p-6 transition-all hover:border-primary/20 hover:shadow-md"
					>
						<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div class="flex-1 space-y-3">
								<div class="flex flex-wrap items-center gap-3">
									<span
										class="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black tracking-wider text-primary uppercase"
									>
										{p.sucursal}
									</span>
									<div class="flex items-center gap-1.5 text-xs font-medium text-slate-400">
										<span class="material-icons text-xs">schedule</span>
										{formatDate(p.createdAt)}
									</div>
								</div>

								<div class="flex items-center gap-2 text-sm font-bold text-slate-900">
									<div
										class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"
									>
										<span class="material-icons text-sm">person</span>
									</div>
									{p.nombre}
								</div>

								<div class="flex flex-wrap gap-4 text-xs text-slate-500">
									<span class="flex items-center gap-1">
										<span class="material-icons text-xs">email</span>
										{p.email}
									</span>
									<span class="flex items-center gap-1">
										<span class="material-icons text-xs">phone</span>
										{p.telefono}
									</span>
								</div>

								{#if p.mensaje}
									<p class="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
										"{p.mensaje}"
									</p>
								{/if}
							</div>

							<div class="flex shrink-0 items-center gap-2 pt-2 md:pt-0">
								{#if p.cvUrl}
									<a
										href={p.cvUrl}
										target="_blank"
										class="flex h-11 items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 text-xs font-bold text-primary transition-all hover:bg-primary/10"
									>
										<span class="material-icons text-sm">description</span>
										Ver CV
									</a>
								{/if}

								<form
									method="POST"
									action="?/deletePostulacion"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
										};
									}}
								>
									<input type="hidden" name="id" value={p.id} />
									<button
										type="submit"
										onclick={(e) =>
											!confirm('¿Estás seguro de eliminar esta postulación?') && e.preventDefault()}
										class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95"
										title="Eliminar"
									>
										<span class="material-icons text-lg">delete</span>
									</button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
