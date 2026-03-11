<script>
	import defaultLogo from '$lib/assets/images/provesa-logo.png';
	import { MapPin, Phone, Smartphone, Mail, Store } from 'lucide-svelte';

	let { footer = {}, logoUrl = '' } = $props();
	let logo = $derived(logoUrl || defaultLogo);

	let info = $derived(footer?.info);
	let branches = $derived(footer?.branches || []);
	let hasInfo = $derived(
		info && (info.description || info.address || info.phone || info.mobile || info.email)
	);
</script>

<footer class="border-t border-slate-100 bg-white pt-20 pb-10">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16 grid gap-12 md:grid-cols-4">
			<!-- Col 1: Brand -->
			<div class="col-span-1">
				<img
					src={logo}
					alt="Provesa Logo"
					class="mb-6 h-12 w-auto opacity-80 grayscale transition-all hover:grayscale-0"
				/>
				{#if info?.description}
					<p class="mb-6 text-sm leading-relaxed text-slate-500">
						{info.description}
					</p>
				{/if}
			</div>

			<!-- Col 2: Enlaces -->
			<div>
				<h4 class="mb-6 font-bold text-slate-900">Enlaces Rápidos</h4>
				<ul class="space-y-3 text-sm text-slate-500">
					<li><a href="/" class="transition-colors hover:text-primary">Inicio</a></li>
					<li>
						<a href="/productos" class="transition-colors hover:text-primary"
							>Catálogo de Productos</a
						>
					</li>
					<li>
						<a href="/nosotros" class="transition-colors hover:text-primary">Nuestra Historia</a>
					</li>
					<li>
						<a href="/concursos" class="transition-colors hover:text-primary">Concursos y Eventos</a
						>
					</li>
					<li>
						<a href="/empleo" class="transition-colors hover:text-primary">Trabaja con Nosotros</a>
					</li>
				</ul>
			</div>

			<!-- Col 3: Oficina Matriz -->
			{#if hasInfo}
				<div>
					<h4 class="mb-6 font-bold text-slate-900">Oficina Matriz</h4>
					<ul class="space-y-4 text-sm text-slate-500">
						{#if info.address}
							<li class="flex items-start gap-3">
								<span class="mt-0.5 text-accent"><MapPin size={16} /></span>
								<span>{info.address}</span>
							</li>
						{/if}
						{#if info.phone}
							<li class="flex items-center gap-3">
								<span class="text-accent"><Phone size={16} /></span>
								<span>{info.phone}</span>
							</li>
						{/if}
						{#if info.mobile}
							<li class="flex items-center gap-3">
								<span class="text-accent"><Smartphone size={16} /></span>
								<span>{info.mobile}</span>
							</li>
						{/if}
						{#if info.email}
							<li class="flex items-center gap-3">
								<span class="text-accent"><Mail size={16} /></span>
								<span>{info.email}</span>
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			<!-- Col 4: Sucursales -->
			{#if branches.length > 0}
				<div>
					<h4 class="mb-6 font-bold text-slate-900">Sucursales</h4>
					<ul class="space-y-4 text-sm text-slate-500">
						{#each branches as branch (branch.id)}
							<li class="flex items-start gap-3">
								<span class="mt-0.5 text-primary"><Store size={16} /></span>
								<div>
									<span class="block font-bold text-slate-700">{branch.name}</span>
									{#if branch.address}
										<span class="text-xs">{branch.address}</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
		<div
			class="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-sm text-slate-400 md:flex-row"
		>
			<p>&copy; {new Date().getFullYear()} Provesa SCC. Todos los derechos reservados.</p>
			<div class="flex gap-6">
				<a href="/politicas/privacidad" class="hover:text-primary">Privacidad</a>
				<a href="/politicas/terminos" class="hover:text-primary">Términos</a>
			</div>
		</div>
	</div>
</footer>
