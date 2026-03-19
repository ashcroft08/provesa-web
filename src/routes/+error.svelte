<script>
	import { page } from '$app/state';
	import logo from '$lib/assets/images/provesa-logo.png';
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Error {page.status}" noindex={true} />

<div
	class="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center antialiased"
>
	<div class="mb-8">
		<img src={logo} alt="Provesa" class="mx-auto h-16 w-auto opacity-50 grayscale" />
	</div>

	<h1 class="text-9xl font-black text-slate-200">{page.status}</h1>

	<div class="relative -mt-12">
		<h2 class="text-2xl font-bold text-slate-800">
			{page.error?.message || 'Algo salió mal'}
		</h2>
		<p class="mt-4 text-slate-500">
			Lo sentimos, no pudimos encontrar lo que buscabas o hubo un error inesperado.
		</p>
	</div>

	<button
		onclick={() => window.location.assign(`${base}/`)}
		class="mt-10 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
	>
		Volver al Inicio
	</button>
</div>
