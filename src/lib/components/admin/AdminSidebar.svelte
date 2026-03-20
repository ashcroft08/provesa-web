<script>
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/images/provesa-logo.png';

	let { navItems, activeTab = $bindable(), user } = $props();

	let initials = $derived(
		user?.name
			? user.name
					.split(' ')
					.map((/** @type {string} */ n) => n[0])
					.join('')
					.toUpperCase()
					.substring(0, 2)
			: 'AD'
	);
</script>

<aside class="glass-sidebar fixed inset-y-0 left-0 z-50 hidden w-72 lg:block">
	<div class="flex h-full flex-col">
		<!-- Logo -->
		<div class="shrink-0 px-8 py-4" id="admin-logo">
			<img src={logo} alt="Provesa" class="mx-auto h-10 w-auto object-contain" />
		</div>

		<!-- Nav items (scrollable) -->
		<nav class="sidebar-scroll flex-1 space-y-0.5 overflow-y-auto px-6 py-1">
			{#each navItems as item (item.name)}
				<button
					id="nav-{item.name.toLowerCase().replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ /g, '-')}"
					onclick={() => (activeTab = item.name)}
					class="flex w-full items-center gap-4 rounded-xl px-4 py-2 text-sm font-bold transition-all
					{activeTab === item.name ? 'active-nav' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}"
				>
					<span class="material-icons text-[20px]">{item.icon}</span>
					{item.name}
					{#if item.badge}
						<span class="bg-accent-red ml-auto rounded-full px-2 py-0.5 text-[10px] text-white">
							{item.badge}
						</span>
					{/if}
				</button>
			{/each}
		</nav>

		<!-- User profile (always visible at bottom) -->
		<div class="shrink-0 border-t border-slate-100 px-6 py-4" id="user-profile">
			<div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white uppercase"
				>
					{initials}
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-xs font-bold">{user?.name || 'Administrador'}</p>
					<p class="truncate text-[10px] text-slate-400">Panel de Control</p>
				</div>
				<form action="?/logout" method="POST" use:enhance class="shrink-0">
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

	/* Hide scrollbar but keep scroll functionality */
	.sidebar-scroll {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
	}
	.sidebar-scroll::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}
</style>
