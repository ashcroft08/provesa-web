<script>
	import { fade } from 'svelte/transition';

	let { title, icon } = $props();
</script>

<div in:fade={{ duration: 200 }} class="flex min-h-[400px] items-center justify-center">
	<div class="text-center">
		<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-50">
			<span class="material-icons text-4xl text-slate-300">{icon}</span>
		</div>
		<h3 class="mb-2 text-xl font-extrabold text-slate-900">{title}</h3>
		<p class="text-sm text-slate-400">Esta sección estará disponible próximamente.</p>
	</div>
</div>
