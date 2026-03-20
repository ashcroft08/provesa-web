<script>
	import { base } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	let { data } = $props();
	let page = $derived(data.legalPage);
</script>
<SEO 
	title={page?.title || 'Política de Privacidad'} 
	description="Consulte nuestra política de privacidad para entender cómo PROVESA SCC protege y maneja sus datos personales con integridad y seriedad."
/>

<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-4xl px-6 pt-32 pb-20">
		<div class="mb-4">
			<button
				onclick={() => window.location.assign(`${base}/`)}
				class="inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-primary"
			>
				← Volver al inicio
			</button>
		</div>

		<article class="rounded-3xl border border-slate-100 bg-white p-10 shadow-sm md:p-16">
			<h1 class="mb-2 text-3xl font-black text-slate-900 md:text-4xl">
				{page?.title || 'Política de Privacidad'}
			</h1>

			{#if page?.updatedAt}
				<p class="mb-10 text-sm text-slate-400">
					Última actualización: {new Date(page.updatedAt).toLocaleDateString('es-EC', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</p>
			{/if}

			{#if page?.content}
				<div class="prose prose-slate max-w-none text-slate-600">
					{#each page.content.split('\n\n') as paragraph, i (i)}
						{#if paragraph.trim()}
							<p class="mb-4 leading-relaxed">{paragraph.trim()}</p>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<span class="material-icons mb-4 text-5xl text-slate-200">shield</span>
					<p class="text-lg font-bold text-slate-400">Contenido en preparación</p>
					<p class="mt-2 text-sm text-slate-300">Esta página estará disponible próximamente.</p>
				</div>
			{/if}
		</article>
	</div>
</div>
