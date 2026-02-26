<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { legal = $bindable(), formResult } = $props();

	let activeSection = $state('privacidad');
	let isSaving = $state(false);

	const sections = [
		{
			slug: 'privacidad',
			label: 'Política de Privacidad',
			icon: 'shield',
			defaultTitle: 'Política de Privacidad',
			placeholder:
				'Describa cómo se recopilan, almacenan y utilizan los datos personales de los usuarios...'
		},
		{
			slug: 'terminos',
			label: 'Términos y Condiciones',
			icon: 'gavel',
			defaultTitle: 'Términos y Condiciones',
			placeholder:
				'Describa las condiciones de uso del sitio web, responsabilidades y limitaciones...'
		}
	];

	let currentSection = $derived(sections.find((s) => s.slug === activeSection));
	let currentData = $derived(legal?.[activeSection] || null);
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<!-- Selector de sección -->
	<div class="flex gap-3">
		{#each sections as section}
			<button
				onclick={() => (activeSection = section.slug)}
				class="flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all {activeSection ===
				section.slug
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'border border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}"
			>
				<span class="material-icons text-sm">{section.icon}</span>
				{section.label}
			</button>
		{/each}
	</div>

	<!-- Editor de contenido -->
	{#key activeSection}
		<div
			in:fade={{ duration: 200 }}
			class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
		>
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-black text-slate-900">{currentSection?.label}</h3>
					<p class="mt-1 text-sm text-slate-500">
						Edita el contenido que se muestra en la página pública.
					</p>
				</div>
				<div class="flex items-center gap-3">
					<a
						href="/politicas/{activeSection}"
						target="_blank"
						class="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
					>
						<span class="material-icons text-sm">open_in_new</span>
						Ver Página
					</a>
					<div class="material-icons rounded-3xl bg-slate-50 p-4 text-3xl text-primary">
						{currentSection?.icon}
					</div>
				</div>
			</div>

			<form
				method="POST"
				action="?/updateLegalPage"
				use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						isSaving = false;
						await update();
					};
				}}
				class="space-y-6"
			>
				<input type="hidden" name="slug" value={activeSection} />

				<div>
					<label for="legalTitle" class="mb-2 block text-sm font-bold text-slate-700"
						>Título de la página</label
					>
					<input
						type="text"
						name="title"
						id="legalTitle"
						value={currentData?.title || currentSection?.defaultTitle || ''}
						placeholder={currentSection?.defaultTitle}
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
					/>
				</div>

				<div>
					<label for="legalContent" class="mb-2 block text-sm font-bold text-slate-700"
						>Contenido</label
					>
					<p class="mb-3 text-xs text-slate-400">
						Escribe el contenido completo de la página. Usa líneas vacías para separar párrafos.
					</p>
					<textarea
						name="content"
						id="legalContent"
						rows="18"
						value={currentData?.content || ''}
						placeholder={currentSection?.placeholder}
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 font-mono text-sm leading-relaxed transition-all focus:bg-white focus:ring-primary/20"
					></textarea>
				</div>

				<div class="flex items-center justify-between pt-4">
					<p class="text-xs text-slate-400">
						{#if currentData?.updatedAt}
							Última actualización: {new Date(currentData.updatedAt).toLocaleDateString('es-EC', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						{:else}
							Sin contenido guardado aún
						{/if}
					</p>
					<div class="flex items-center gap-4">
						{#if formResult?.legalSuccess && formResult?.savedSlug === activeSection}
							<p
								in:slide={{ axis: 'x' }}
								class="flex items-center gap-1 text-sm font-bold text-green-600"
							>
								<span class="material-icons text-sm">check_circle</span> Guardado
							</p>
						{/if}
						<button
							type="submit"
							disabled={isSaving}
							class="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
						>
							{isSaving ? 'Guardando...' : 'Guardar'}
							{#if !isSaving}
								<span class="material-icons text-sm">save</span>
							{/if}
						</button>
					</div>
				</div>
			</form>
		</div>
	{/key}
</div>
