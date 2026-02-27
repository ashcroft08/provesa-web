<script>
	import { enhance } from '$app/forms';
	import { fade, slide, fly } from 'svelte/transition';
	import {
		MessageSquareText,
		Trash2,
		CheckCircle2,
		Clock,
		User,
		Plus,
		X,
		Save,
		AlertCircle,
		MailOpen,
		Search,
		Filter,
		Inbox,
		CheckCheck
	} from 'lucide-svelte';

	let { sugerencias = [], config = { opciones: [] } } = $props();

	let options = $state(
		config?.opciones || [
			'Sugerencia de Servicio',
			'Nuevo Producto Requerido',
			'Reclamo',
			'Felicitación'
		]
	);
	let newOption = $state('');
	let isSubmitting = $state(false);

	// Estados de filtrado
	let searchQuery = $state('');
	let statusFilter = $state('all'); // all, new, read
	let typeFilter = $state('all');

	// Sugerencias filtradas
	let filteredSugerencias = $derived(
		sugerencias.filter((s) => {
			const matchesSearch =
				!searchQuery ||
				(s.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
				(s.mensaje || '').toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'new' && !s.leido) ||
				(statusFilter === 'read' && s.leido);

			const matchesType = typeFilter === 'all' || s.tipo === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		})
	);

	// Sincronizar si cambia el prop
	$effect(() => {
		if (config?.opciones) {
			options = [...config.opciones];
		}
	});

	function addOption() {
		if (newOption.trim() && !options.includes(newOption.trim())) {
			options = [...options, newOption.trim()];
			newOption = '';
		}
	}

	function removeOption(/** @type {number} */ index) {
		options = options.filter((_, i) => i !== index);
	}

	function formatDate(/** @type {any} */ date) {
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
	<!-- Gestión de Opciones (Dropdown Config) -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8">
			<h3 class="text-2xl font-black text-slate-900">Configuración del Buzón</h3>
			<p class="mt-1 text-sm text-slate-500">
				Gestiona las opciones que aparecen en el dropdown del formulario de sugerencias.
			</p>
		</div>

		<form
			method="POST"
			action="?/updateSugerenciasConfig"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<div class="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-6">
				<label class="mb-4 block text-xs font-bold tracking-wider text-slate-400 uppercase">
					Opciones actuales
				</label>

				<div class="mb-6 flex flex-wrap gap-2">
					{#each options as opt, i}
						<div
							class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 pr-2 pl-4 text-sm font-medium text-slate-700 shadow-sm"
						>
							{opt}
							<button
								type="button"
								onclick={() => removeOption(i)}
								class="flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
							>
								<X size={14} />
							</button>
						</div>
					{/each}
				</div>

				<div class="flex gap-2">
					<div class="relative flex-1">
						<input
							type="text"
							bind:value={newOption}
							placeholder="Nueva opción (ej: Consulta Técnica)"
							class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:ring-primary/20"
							onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
						/>
					</div>
					<button
						type="button"
						onclick={addOption}
						class="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
					>
						<Plus size={18} />
						Agregar
					</button>
				</div>
			</div>

			<input type="hidden" name="opciones" value={JSON.stringify(options)} />

			<button
				type="submit"
				disabled={isSubmitting}
				class="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
			>
				<Save size={18} />
				{isSubmitting ? 'Guardando...' : 'Guardar Configuración'}
			</button>
		</form>
	</div>

	<!-- Listado de Sugerencias -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-10">
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-black text-slate-900">Mensajes Recibidos</h3>
					<p class="mt-1 text-sm text-slate-500">
						Administra y revisa las sugerencias enviadas por tus usuarios.
					</p>
				</div>
				<div
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
				>
					<Inbox size={24} />
				</div>
			</div>

			<!-- Filtros y Búsqueda -->
			<div class="grid gap-4 md:grid-cols-3">
				<div class="relative">
					<span class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
						<Search size={18} />
					</span>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Buscar en mensajes..."
						class="w-full rounded-2xl border-slate-100 bg-slate-50 py-3 pr-4 pl-10 text-sm focus:bg-white focus:ring-primary/20"
					/>
				</div>

				<div class="flex items-center gap-2">
					<button
						onclick={() => (statusFilter = 'all')}
						class="rounded-xl px-4 py-2 text-xs font-bold transition-all
						{statusFilter === 'all'
							? 'bg-slate-900 text-white shadow-md'
							: 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
					>
						Todos
					</button>
					<button
						onclick={() => (statusFilter = 'new')}
						class="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all
						{statusFilter === 'new'
							? 'bg-primary text-white shadow-md'
							: 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
					>
						Nuevos
						{#if sugerencias.filter((s) => !s.leido).length > 0}
							<span
								class="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/20 px-1 text-[10px]"
							>
								{sugerencias.filter((s) => !s.leido).length}
							</span>
						{/if}
					</button>
					<button
						onclick={() => (statusFilter = 'read')}
						class="rounded-xl px-4 py-2 text-xs font-bold transition-all
						{statusFilter === 'read'
							? 'bg-green-600 text-white shadow-md'
							: 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
					>
						Leídos
					</button>
				</div>

				<div class="relative">
					<span class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
						<Filter size={16} />
					</span>
					<select
						bind:value={typeFilter}
						class="w-full appearance-none rounded-2xl border-slate-100 bg-slate-50 py-3 pr-10 pl-10 text-sm focus:bg-white focus:ring-primary/20"
					>
						<option value="all">Todos los tipos</option>
						{#each options as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		{#if filteredSugerencias.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 py-20 text-center"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
				>
					<MailOpen size={32} />
				</div>
				<h4 class="text-lg font-bold text-slate-900">No hay coincidencias</h4>
				<p class="mt-1 max-w-xs text-sm text-slate-400">
					Prueba a ajustar los filtros o comprueba si hay nuevos mensajes.
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredSugerencias as sug (sug.id)}
					<div
						animate:slide={{ duration: 300 }}
						class="group relative overflow-hidden rounded-3xl border border-slate-100 p-6 transition-all hover:border-primary/20 hover:bg-primary/[0.01] {sug.leido
							? 'bg-white opacity-80'
							: 'border-primary/10 bg-primary/[0.02]'}"
					>
						<!-- Estado Leído indicator -->
						{#if !sug.leido}
							<div class="absolute top-0 left-0 h-full w-1 bg-primary"></div>
						{/if}

						<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div class="flex-1 space-y-3">
								<div class="flex flex-wrap items-center gap-3">
									<span
										class="rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase
										{sug.leido ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'}"
									>
										{sug.tipo}
									</span>
									<div class="flex items-center gap-1.5 text-xs font-medium text-slate-400">
										<Clock size={12} />
										{formatDate(sug.createdAt)}
									</div>
									{#if !sug.leido}
										<span
											class="flex animate-pulse items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary"
										>
											NUEVO
										</span>
									{:else}
										<span class="flex items-center gap-1 text-[10px] font-bold text-green-500">
											<CheckCheck size={12} /> Leído
										</span>
									{/if}
								</div>

								<div class="flex items-center gap-2 text-sm font-bold text-slate-900">
									<div class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
										<User size={12} class="text-slate-500" />
									</div>
									{sug.nombre || 'Anónimo'}
								</div>

								<p class="text-sm leading-relaxed text-slate-600">
									{sug.mensaje}
								</p>
							</div>

							<div class="flex shrink-0 items-center gap-2 pt-2 md:pt-0">
								{#if !sug.leido}
									<form
										method="POST"
										action="?/markSugerenciaRead"
										use:enhance={() => {
											// Optimistic UI could be here if we were managing state locally,
											// but we rely on SvelteKit's refresh.
											return async ({ update }) => {
												await update();
											};
										}}
									>
										<input type="hidden" name="id" value={sug.id} />
										<button
											type="submit"
											class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-600 active:scale-95"
											title="Marcar como leído"
										>
											<CheckCircle2 size={20} />
										</button>
									</form>
								{/if}

								<form
									method="POST"
									action="?/deleteSugerencia"
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success') {
												await update();
											}
										};
									}}
								>
									<input type="hidden" name="id" value={sug.id} />
									<button
										type="submit"
										onclick={(e) =>
											!confirm('¿Estás seguro de eliminar esta sugerencia?') && e.preventDefault()}
										class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95"
										title="Eliminar"
									>
										<Trash2 size={20} />
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
