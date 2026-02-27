<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
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
		MailOpen
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

	function removeOption(index) {
		options = options.filter((_, i) => i !== index);
	}

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
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Mensajes Recibidos</h3>
				<p class="mt-1 text-sm text-slate-500">
					Revisa las sugerencias y comentarios enviados por los clientes.
				</p>
			</div>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400"
			>
				<MessageSquareText size={24} />
			</div>
		</div>

		{#if sugerencias.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-100 py-20 text-center"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"
				>
					<MailOpen size={32} />
				</div>
				<h4 class="text-lg font-bold text-slate-900">No hay mensajes aún</h4>
				<p class="mt-1 max-w-xs text-sm text-slate-400">
					Cuando un cliente envíe una sugerencia desde la web, aparecerá aquí.
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each sugerencias as sug}
					<div
						class="group relative overflow-hidden rounded-3xl border border-slate-100 p-6 transition-all hover:border-primary/20 hover:bg-primary/[0.01] {sug.leido
							? 'bg-white'
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
										class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black tracking-wider text-slate-500 uppercase"
									>
										{sug.tipo}
									</span>
									<div class="flex items-center gap-1.5 text-xs font-bold text-slate-400">
										<Clock size={12} />
										{formatDate(sug.createdAt)}
									</div>
									{#if !sug.leido}
										<span
											class="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary"
										>
											NUEVO
										</span>
									{/if}
								</div>

								<div class="flex items-center gap-2 text-sm font-bold text-slate-900">
									<User size={14} class="text-slate-400" />
									{sug.nombre || 'Anónimo'}
								</div>

								<p class="text-sm leading-relaxed text-slate-600">
									{sug.mensaje}
								</p>
							</div>

							<div class="flex shrink-0 items-center gap-2 pt-2 md:pt-0">
								{#if !sug.leido}
									<form method="POST" action="?/markSugerenciaRead" use:enhance>
										<input type="hidden" name="id" value={sug.id} />
										<button
											type="submit"
											class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-600"
											title="Marcar como leído"
										>
											<CheckCircle2 size={18} />
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
										class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
										title="Eliminar"
									>
										<Trash2 size={18} />
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
