<script>
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/images/provesa-logo.png';

	let { navItems, activeTab = $bindable(), user } = $props();

	let initials = $derived(
		user?.name
			? user.name
					.split(' ')
					.map((n) => n[0])
					.join('')
					.toUpperCase()
					.substring(0, 2)
			: 'AD'
	);
</script>

<aside class="glass-sidebar fixed inset-y-0 left-0 z-50 hidden w-72 lg:block">
	<div class="flex h-full flex-col p-8">
		<div class="mb-10 flex items-center gap-3">
			<img src={logo} alt="Provesa" class="mx-auto mb-6 h-12 w-auto object-contain" />
		</div>

		<nav class="flex-grow space-y-2">
			{#each navItems as item}
				<button
					onclick={() => (activeTab = item.name)}
					class="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all
					{activeTab === item.name ? 'active-nav' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}"
				>
					<span class="material-icons">{item.icon}</span>
					{item.name}
					{#if item.badge}
						<span class="bg-accent-red ml-auto rounded-full px-2 py-1 text-[10px] text-white">
							{item.badge}
						</span>
					{/if}
				</button>
			{/each}
		</nav>

		<div class="mt-auto border-t border-slate-100 pt-8">
			<div class="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white uppercase"
				>
					{initials}
				</div>
				<div class="overflow-hidden">
					<p class="truncate text-xs font-bold">{user?.name || 'Administrador'}</p>
					<p class="truncate text-[10px] text-slate-400">Panel de Control</p>
				</div>
				<form action="?/logout" method="POST" use:enhance class="ml-auto flex items-center">
					<button
						title="Cerrar Sesión"
						class="hover:text-accent-red text-slate-400 transition-colors"
					>
						<span class="material-icons text-lg">logout</span>
					</button>
				</form>
			</div>
		</div>
	</div>
</aside>

<style>
	.glass-sidebar {
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		border-right: 1px solid rgba(226, 232, 240, 0.8);
	}

	.active-nav {
		background-color: var(--color-primary);
		color: white !important;
		box-shadow: 0 10px 15px -3px rgba(0, 82, 165, 0.3);
	}
</style>
