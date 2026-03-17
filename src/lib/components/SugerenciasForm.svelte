<script>
	import { enhance } from '$app/forms';
	import { MessageSquareText, Send, User, ChevronDown } from 'lucide-svelte';

	/** @type {{ tipos?: string[] }} */
	let {
		tipos = ['Sugerencia de Servicio', 'Nuevo Producto Requerido', 'Reclamo', 'Felicitación']
	} = $props();

	let tipo = $state('');

	// Sincronizamos tipo inicial cuando carga la prop
	$effect(() => {
		if (!tipo && tipos && tipos.length > 0) {
			tipo = tipos[0];
		}
	});

	let nombre = $state('');
	let mensaje = $state('');
	let enviado = $state(false);
	let isSubmitting = $state(false);
	let dropdownOpen = $state(false);
	let errors = $state({ mensaje: '' });

	function validate() {
		let valid = true;
		if (!mensaje.trim()) {
			errors.mensaje = 'El mensaje es obligatorio';
			valid = false;
		} else if (mensaje.length > 500) {
			errors.mensaje = 'El mensaje no puede exceder los 500 caracteres';
			valid = false;
		} else {
			errors.mensaje = '';
		}
		return valid;
	}

	function selectTipo(/** @type {string} */ t) {
		tipo = t;
		dropdownOpen = false;
	}
</script>

<section id="sugerencias" class="relative overflow-hidden bg-white py-24 md:py-32">
	<!-- Decoraciones -->
	<div
		class="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/3 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"
	></div>

	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 text-center">
			<div
				class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
			>
				<MessageSquareText size={28} class="text-primary" />
			</div>
			<h2 class="mb-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
				Buzón de <span class="text-primary">Sugerencias</span>
			</h2>
			<div class="mx-auto mb-5 flex items-center justify-center gap-2">
				<div class="h-1.5 w-12 rounded-full bg-secondary"></div>
				<div class="h-1.5 w-5 rounded-full bg-accent"></div>
				<div class="h-1.5 w-2 rounded-full bg-primary/30"></div>
			</div>
			<p class="mx-auto max-w-lg text-base leading-relaxed text-slate-500 md:text-lg">
				Su opinión es vital para nuestro crecimiento. ¿Tiene alguna idea para mejorar nuestro
				servicio?
			</p>
		</div>

		<!-- Formulario -->
		{#if enviado}
			<div class="rounded-3xl border border-green-100 bg-green-50/50 p-12 text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
				>
					<span class="text-3xl">✓</span>
				</div>
				<h3 class="mb-2 text-xl font-extrabold text-green-800">¡Mensaje Enviado!</h3>
				<p class="text-sm text-green-600">
					Gracias por compartir su opinión. La revisaremos pronto.
				</p>
			</div>
		{:else}
			<form
				method="POST"
				action="?/enviarSugerencia"
				use:enhance={({ cancel }) => {
					if (!validate()) return cancel();
					isSubmitting = true;
					return async ({ update, result }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							enviado = true;
							setTimeout(() => {
								enviado = false;
								nombre = '';
								mensaje = '';
								errors.mensaje = '';
							}, 3000);
						}
						await update({ reset: false });
					};
				}}
				class="rounded-3xl border border-slate-100 bg-soft-gray p-8 shadow-sm transition-all hover:shadow-md md:p-10"
			>
				<input type="hidden" name="tipo" value={tipo} />
				<div class="mb-6 grid gap-6 md:grid-cols-2">
					<!-- Tipo -->
					<div class="relative">
						<label
							for="sugTipo"
							class="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
						>
							<ChevronDown size={14} class="text-primary" />
							Tipo de mensaje
						</label>
					<!-- eslint-disable-next-line svelte/a11y-click-events-have-key-events, svelte/a11y-no-static-element-interactions -->
					<button
							id="sugTipo"
							type="button"
							onclick={() => (dropdownOpen = !dropdownOpen)}
							class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition-all hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20
							{dropdownOpen ? 'border-primary ring-2 ring-primary/20' : ''}"
						>
							{tipo}
							<ChevronDown
								size={16}
								class="text-slate-400 transition-transform {dropdownOpen ? 'rotate-180' : ''}"
							/>
						</button>

						{#if dropdownOpen}
							<button 
								class="fixed inset-0 z-10 w-full h-full cursor-default bg-transparent" 
								onclick={() => (dropdownOpen = false)}
								aria-label="Cerrar selección"
							></button>
							<div
								class="absolute top-full left-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-200/50"
							>
								{#each tipos as t (t)}
									<button
										type="button"
										onclick={() => selectTipo(t)}
										class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-all
										{tipo === t ? 'bg-primary/10 font-bold text-primary' : 'text-slate-600 hover:bg-slate-50'}"
									>
										{#if tipo === t}
											<div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
										{/if}
										{t}
									</button>
								{/each}
							</div>
						{/if}
					</div>
					<!-- Nombre -->
					<div>
						<label
							for="sugNombre"
							class="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
						>
							<User size={14} class="text-primary" />
							Nombre <span class="font-normal text-slate-400">(Opcional)</span>
						</label>
						<input
							type="text"
							id="sugNombre"
							name="nombre"
							bind:value={nombre}
							placeholder="Anónimo"
							class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
					</div>
				</div>

				<!-- Mensaje -->
				<div class="mb-8">
					<label for="sugMsg" class="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
						<MessageSquareText size={14} class="text-primary" />
						Su mensaje
					</label>
					<textarea
						id="sugMsg"
						name="mensaje"
						bind:value={mensaje}
						rows="4"
						placeholder="Escriba aquí sus comentarios o sugerencias..."
						class="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary/20
						{errors.mensaje ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-primary'}"
					></textarea>
					<div class="mt-1 flex justify-between gap-2">
						{#if errors.mensaje}
							<p class="text-[10px] font-bold text-red-500">{errors.mensaje}</p>
						{:else}
							<span></span>
						{/if}
						<p class="text-[10px] text-slate-400 {mensaje.length > 450 ? 'text-accent-red font-bold' : ''}">
							{mensaje.length}/500
						</p>
					</div>
				</div>

				<!-- Botón -->
				<button
					type="submit"
					disabled={!mensaje.trim() || isSubmitting}
					class="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSubmitting ? 'Enviando...' : 'Enviar Sugerencia'}
					<Send size={16} class="transition-transform group-hover:translate-x-1" />
				</button>

				<p class="mt-4 text-center text-xs text-slate-400">
					<span class="text-primary">🔒</span> Su mensaje es confidencial y será revisado por la gerencia.
				</p>
			</form>
		{/if}
	</div>
</section>
