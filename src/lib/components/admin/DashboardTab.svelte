<script>
	import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 200 }}>
	<div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<div
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
				<span class="material-icons text-primary">analytics</span>
			</div>
			<div>
				<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Vistas Hoy</p>
				<h3 class="text-2xl font-black text-slate-900">1,284</h3>
			</div>
		</div>
		<div
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
				<span class="material-icons text-green-600">forum</span>
			</div>
			<div>
				<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Contactos</p>
				<h3 class="text-2xl font-black text-slate-900">28</h3>
			</div>
		</div>
		<div
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
				<span class="material-icons text-orange-600">work</span>
			</div>
			<div>
				<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Candidatos CV</p>
				<h3 class="text-2xl font-black text-slate-900">14</h3>
			</div>
		</div>
		<div
			class="stat-card flex items-center gap-5 rounded-[32px] border border-slate-100 bg-white p-6"
		>
			<div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50">
				<span class="material-icons text-purple-600">touch_app</span>
			</div>
			<div>
				<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Clics Botones</p>
				<h3 class="text-2xl font-black text-slate-900">842</h3>
			</div>
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<div class="space-y-8 lg:col-span-2">
			<div class="overflow-hidden rounded-[40px] border border-slate-100 bg-white shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-50 p-8">
					<h4 class="text-lg font-extrabold">Apartados de la Landing Page</h4>
					<button class="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
						<span class="material-icons text-sm">add</span> Nuevo Apartado
					</button>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr
								class="border-b border-slate-50 text-[10px] font-black tracking-widest text-slate-400 uppercase"
							>
								<th class="px-8 py-5">Sección</th>
								<th class="px-8 py-5">Tipo Contenido</th>
								<th class="px-8 py-5">Estado</th>
								<th class="px-8 py-5 text-right">Acción</th>
							</tr>
						</thead>
						<tbody class="text-sm">
							<tr class="border-b border-slate-50 transition-colors hover:bg-slate-50">
								<td class="px-8 py-5 font-bold">1. Banner Principal (Hero)</td>
								<td class="px-8 py-5 text-slate-500">Imagen + Texto Destacado</td>
								<td class="px-8 py-5">
									<span
										class="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700"
										>Público</span
									>
								</td>
								<td class="px-8 py-5 text-right">
									<button class="p-2 text-slate-400 transition-colors hover:text-primary"
										><span class="material-icons text-lg">edit</span></button
									>
								</td>
							</tr>
							<tr class="border-b border-slate-50 transition-colors hover:bg-slate-50">
								<td class="px-8 py-5 font-bold">2. Sobre Nosotros</td>
								<td class="px-8 py-5 text-slate-500">Bloque Texto + Video</td>
								<td class="px-8 py-5">
									<span
										class="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700"
										>Público</span
									>
								</td>
								<td class="px-8 py-5 text-right">
									<button class="p-2 text-slate-400 transition-colors hover:text-primary"
										><span class="material-icons text-lg">edit</span></button
									>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="space-y-8">
			<div
				class="relative overflow-hidden rounded-[40px] bg-primary p-8 text-white shadow-xl shadow-primary/20"
			>
				<div class="relative z-10">
					<h4 class="mb-1 text-sm font-bold opacity-70">Tráfico Semanal</h4>
					<h3 class="mb-8 text-3xl font-black">
						+24% <span class="text-xs font-normal opacity-50">vs semana pasada</span>
					</h3>
					<div class="flex h-32 items-end justify-between gap-2">
						<div class="h-[40%] w-full rounded-t-xl bg-white/20 transition-all duration-1000"></div>
						<div class="h-[60%] w-full rounded-t-xl bg-white/20"></div>
						<div class="h-[80%] w-full rounded-t-xl bg-white/40"></div>
						<div class="h-[50%] w-full rounded-t-xl bg-white/20"></div>
						<div class="h-full w-full rounded-t-xl bg-white shadow-lg"></div>
						<div class="h-[70%] w-full rounded-t-xl bg-white/20"></div>
						<div class="h-[45%] w-full rounded-t-xl bg-white/20"></div>
					</div>
					<div class="mt-4 flex justify-between text-[10px] font-bold opacity-60">
						<span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span
						><span>D</span>
					</div>
				</div>
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.stat-card {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
	}
</style>
