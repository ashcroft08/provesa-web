<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { theme = $bindable(), isSaving = $bindable(), formResult } = $props();
</script>

<div in:fade={{ duration: 200 }} class="max-w-4xl">
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Personalización del Tema</h3>
				<p class="mt-1 text-sm text-slate-500">
					Ajusta la paleta de colores global de tu sitio web.
				</p>
			</div>
			<div class="material-icons rounded-3xl bg-slate-50 p-4 text-3xl text-primary">palette</div>
		</div>

		<form
			method="POST"
			action="?/updateTheme"
			use:enhance={() => {
				isSaving = true;
				return async ({ update }) => {
					isSaving = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Color Primario -->
				<div
					class="group space-y-3 rounded-3xl border border-slate-50 bg-soft-gray p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
				>
					<div class="flex items-center justify-between">
						<label for="primary" class="text-sm font-bold text-slate-800">Color Primario</label>
						<div class="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
					</div>
					<div class="flex items-center gap-4">
						<input
							type="color"
							id="primary"
							name="primary"
							bind:value={theme.primary}
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none p-0 shadow-sm"
						/>
						<div class="grow">
							<input
								type="text"
								bind:value={theme.primary}
								class="w-full rounded-xl border-slate-100 bg-white font-mono text-xs font-bold tracking-wider"
							/>
						</div>
					</div>
					<p class="text-[10px] text-slate-400">Usado en botones principales y sidebar.</p>
				</div>

				<!-- Color Secundario -->
				<div
					class="group space-y-3 rounded-3xl border border-slate-50 bg-soft-gray p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
				>
					<div class="flex items-center justify-between">
						<label for="secondary" class="text-sm font-bold text-slate-800"
							>Color Secundario (Botones)</label
						>
						<div class="h-3 w-3 rounded-full bg-secondary ring-4 ring-secondary/10"></div>
					</div>
					<div class="flex items-center gap-4">
						<input
							type="color"
							id="secondary"
							name="secondary"
							bind:value={theme.secondary}
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none p-0 shadow-sm"
						/>
						<div class="grow">
							<input
								type="text"
								bind:value={theme.secondary}
								class="w-full rounded-xl border-slate-100 bg-white font-mono text-xs font-bold tracking-wider"
							/>
						</div>
					</div>
					<p class="text-[10px] text-slate-400">Color de destaque para botones de acción.</p>
				</div>

				<!-- Color de Acento -->
				<div
					class="group space-y-3 rounded-3xl border border-slate-50 bg-soft-gray p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
				>
					<div class="flex items-center justify-between">
						<label for="accent" class="text-sm font-bold text-slate-800"
							>Color de Acento (Alertas)</label
						>
						<div class="h-3 w-3 rounded-full bg-accent ring-4 ring-accent/10"></div>
					</div>
					<div class="flex items-center gap-4">
						<input
							type="color"
							id="accent"
							name="accent"
							bind:value={theme.accent}
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none p-0 shadow-sm"
						/>
						<div class="grow">
							<input
								type="text"
								bind:value={theme.accent}
								class="w-full rounded-xl border-slate-100 bg-white font-mono text-xs font-bold tracking-wider"
							/>
						</div>
					</div>
					<p class="text-[10px] text-slate-400">Utilizado en avisos, errores y badges.</p>
				</div>

				<!-- Fondo de Landing -->
				<div
					class="group space-y-3 rounded-3xl border border-slate-50 bg-soft-gray p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
				>
					<div class="flex items-center justify-between">
						<label for="background" class="text-sm font-bold text-slate-800">Fondo de Landing</label
						>
						<div class="h-3 w-3 rounded-full bg-slate-50 ring-4 ring-slate-100"></div>
					</div>
					<div class="flex items-center gap-4">
						<input
							type="color"
							id="background"
							name="background"
							bind:value={theme.background}
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none p-0 shadow-sm"
						/>
						<div class="grow">
							<input
								type="text"
								bind:value={theme.background}
								class="w-full rounded-xl border-slate-100 bg-white font-mono text-xs font-bold tracking-wider"
							/>
						</div>
					</div>
					<p class="text-[10px] text-slate-400">Color base de las secciones de la página.</p>
				</div>

				<!-- Color Navbar Hover -->
				<div
					class="group space-y-3 rounded-3xl border border-slate-50 bg-soft-gray p-6 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
				>
					<div class="flex items-center justify-between">
						<label for="navbarHover" class="text-sm font-bold text-slate-800"
							>Color de Navbar (Hover)</label
						>
						<div 
							class="h-3 w-3 rounded-full ring-4 ring-slate-100"
							style:background-color={theme.navbarHover === 'var(--color-primary)' ? theme.primary : theme.navbarHover}
						></div>
					</div>
					<div class="flex items-center gap-4">
						<input
							type="color"
							id="navbarHover"
							name="navbarHover"
							bind:value={theme.navbarHover}
							class="h-14 w-14 cursor-pointer overflow-hidden rounded-xl border-none p-0 shadow-sm"
						/>
						<div class="grow">
							<input
								type="text"
								bind:value={theme.navbarHover}
								class="w-full rounded-xl border-slate-100 bg-white font-mono text-xs font-bold tracking-wider"
							/>
						</div>
					</div>
					<p class="text-[10px] text-slate-400">Color al pasar el mouse por los links del menú superior.</p>
				</div>
			</div>

			<div class="flex items-center justify-end gap-4 pt-6">
				{#if formResult?.success}
					<p
						in:slide={{ axis: 'x' }}
						class="flex items-center gap-1 text-sm font-bold text-green-600"
					>
						<span class="material-icons text-sm">check_circle</span> Cambios guardados
					</p>
				{/if}

				<button
					type="submit"
					disabled={isSaving}
					class="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
				>
					{isSaving ? 'Guardando...' : 'Aplicar Cambios'}
					{#if !isSaving}
						<span class="material-icons text-sm">save</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
