<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';
	import Footer from '$lib/components/Footer.svelte';

	let { footerInfo = $bindable(), branches = $bindable(), formResult } = $props();

	let isSavingInfo = $state(false);
	let isAddingBranch = $state(false);
	let newBranchName = $state('');
	let newBranchAddress = $state('');
	let showAddForm = $state(false);
	let showPreview = $state(false);
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<!-- Información de la Empresa -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Información del Footer</h3>
				<p class="mt-1 text-sm text-slate-500">Datos de contacto y descripción de la empresa.</p>
			</div>
			<div class="flex items-center gap-3">
				<button
					onclick={() => (showPreview = !showPreview)}
					class="flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
				>
					<span class="material-icons text-sm">{showPreview ? 'visibility_off' : 'visibility'}</span
					>
					{showPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
				</button>
				<div class="material-icons rounded-3xl bg-slate-50 p-4 text-3xl text-primary">business</div>
			</div>
		</div>

		<form
			method="POST"
			action="?/updateFooter"
			use:enhance={() => {
				isSavingInfo = true;
				return async ({ update }) => {
					isSavingInfo = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<div>
				<label for="description" class="mb-2 block text-sm font-bold text-slate-700"
					>Descripción de la empresa</label
				>
				<textarea
					name="description"
					id="description"
					rows="3"
					value={footerInfo?.description || ''}
					placeholder="Su socio estratégico en distribución mayorista..."
					class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
				></textarea>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<label for="address" class="mb-2 block text-sm font-bold text-slate-700">Dirección</label>
					<input
						type="text"
						name="address"
						id="address"
						value={footerInfo?.address || ''}
						placeholder="Av. Primero de Mayo, frente al Mercado Central..."
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
					/>
				</div>
				<div>
					<label for="email" class="mb-2 block text-sm font-bold text-slate-700">Email</label>
					<input
						type="email"
						name="email"
						id="email"
						value={footerInfo?.email || ''}
						placeholder="info@provesa.com.ec"
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
					/>
				</div>
				<div>
					<label for="phone" class="mb-2 block text-sm font-bold text-slate-700"
						>Teléfono Fijo</label
					>
					<input
						type="tel"
						name="phone"
						id="phone"
						value={footerInfo?.phone || ''}
						placeholder="02 2727 922"
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
					/>
				</div>
				<div>
					<label for="mobile" class="mb-2 block text-sm font-bold text-slate-700">Celular</label>
					<input
						type="tel"
						name="mobile"
						id="mobile"
						value={footerInfo?.mobile || ''}
						placeholder="099 217 1280"
						class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 text-sm transition-all focus:bg-white focus:ring-primary/20"
					/>
				</div>
			</div>

			<!-- Redes Sociales -->
			<div class="mt-8 border-t border-slate-100 pt-8">
				<h4 class="mb-6 flex items-center gap-2 text-base font-black text-slate-900">
					<span class="material-icons text-primary">share</span>
					Redes Sociales
				</h4>
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<label
							for="facebookUrl"
							class="mb-2 block flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700"
						>
							Facebook
						</label>
						<div class="relative">
							<span class="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
								>facebook</span
							>
							<input
								type="url"
								name="facebookUrl"
								id="facebookUrl"
								value={footerInfo?.facebookUrl || ''}
								placeholder="https://facebook.com/su-empresa"
								class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 pl-12 text-sm transition-all focus:bg-white focus:ring-primary/20"
							/>
						</div>
					</div>
					<div>
						<label
							for="instagramUrl"
							class="mb-2 block flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700"
						>
							Instagram
						</label>
						<div class="relative">
							<span class="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
								>photo_camera</span
							>
							<input
								type="url"
								name="instagramUrl"
								id="instagramUrl"
								value={footerInfo?.instagramUrl || ''}
								placeholder="https://instagram.com/su-empresa"
								class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 pl-12 text-sm transition-all focus:bg-white focus:ring-primary/20"
							/>
						</div>
					</div>
					<div>
						<label
							for="tiktokUrl"
							class="mb-2 block flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700"
						>
							TikTok
						</label>
						<div class="relative">
							<span class="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
								>music_note</span
							>
							<input
								type="url"
								name="tiktokUrl"
								id="tiktokUrl"
								value={footerInfo?.tiktokUrl || ''}
								placeholder="https://tiktok.com/@su-empresa"
								class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 pl-12 text-sm transition-all focus:bg-white focus:ring-primary/20"
							/>
						</div>
					</div>
					<div>
						<label
							for="whatsappUrl"
							class="mb-2 block flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700"
						>
							WhatsApp (Número o Link)
						</label>
						<div class="relative">
							<span class="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
								>whatsapp</span
							>
							<input
								type="text"
								name="whatsappUrl"
								id="whatsappUrl"
								value={footerInfo?.whatsappUrl || ''}
								placeholder="Ej: 0992171280 o https://wa.me/..."
								class="w-full rounded-2xl border-slate-100 bg-[#F8FAFC] p-4 pl-12 text-sm transition-all focus:bg-white focus:ring-primary/20"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center justify-end gap-4 pt-4">
				{#if formResult?.footerSuccess}
					<p
						in:slide={{ axis: 'x' }}
						class="flex items-center gap-1 text-sm font-bold text-green-600"
					>
						<span class="material-icons text-sm">check_circle</span> Información guardada
					</p>
				{/if}
				<button
					type="submit"
					disabled={isSavingInfo}
					class="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
				>
					{isSavingInfo ? 'Guardando...' : 'Guardar Información'}
					{#if !isSavingInfo}
						<span class="material-icons text-sm">save</span>
					{/if}
				</button>
			</div>
		</form>
	</div>

	<!-- Sucursales -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Sucursales</h3>
				<p class="mt-1 text-sm text-slate-500">
					Administra las sucursales que aparecen en el footer.
				</p>
			</div>
			<button
				onclick={() => (showAddForm = !showAddForm)}
				class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
			>
				<span class="material-icons text-sm">{showAddForm ? 'close' : 'add'}</span>
				{showAddForm ? 'Cancelar' : 'Agregar'}
			</button>
		</div>

		<!-- Formulario para agregar -->
		{#if showAddForm}
			<div
				in:slide
				class="mb-8 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6"
			>
				<h4 class="mb-4 text-sm font-bold text-primary">Nueva Sucursal</h4>
				<form
					method="POST"
					action="?/addBranch"
					use:enhance={() => {
						isAddingBranch = true;
						return async ({ update }) => {
							isAddingBranch = false;
							newBranchName = '';
							newBranchAddress = '';
							showAddForm = false;
							await update();
						};
					}}
					class="space-y-4"
				>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="branchName" class="mb-1 block text-xs font-bold text-slate-600"
								>Nombre</label
							>
							<input
								type="text"
								name="branchName"
								id="branchName"
								bind:value={newBranchName}
								placeholder="Ej: Quinindé"
								required
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:ring-primary/20"
							/>
						</div>
						<div>
							<label for="branchAddress" class="mb-1 block text-xs font-bold text-slate-600"
								>Dirección</label
							>
							<input
								type="text"
								name="branchAddress"
								id="branchAddress"
								bind:value={newBranchAddress}
								placeholder="Ej: Av. Principal y Calle 5"
								class="w-full rounded-xl border-slate-200 bg-white p-3 text-sm focus:ring-primary/20"
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={isAddingBranch || !newBranchName}
						class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
					>
						{isAddingBranch ? 'Agregando...' : 'Agregar Sucursal'}
						<span class="material-icons text-sm">add_business</span>
					</button>
				</form>
			</div>
		{/if}

		<!-- Lista de sucursales -->
		{#if branches.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-4 rounded-3xl bg-slate-50 p-6">
					<span class="material-icons text-4xl text-slate-300">store</span>
				</div>
				<p class="text-sm font-bold text-slate-400">No hay sucursales registradas</p>
				<p class="mt-1 text-xs text-slate-300">Usa el botón "Agregar" para crear la primera.</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each branches as branch (branch.id)}
					<div
						in:slide
						class="group flex items-center justify-between rounded-2xl border border-slate-50 bg-[#F8FAFC] p-5 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100"
					>
						<div class="flex items-center gap-4">
							<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
								<span class="material-icons text-sm text-primary">store</span>
							</div>
							<div>
								<p class="text-sm font-bold text-slate-800">{branch.name}</p>
								{#if branch.address}
									<p class="text-xs text-slate-400">{branch.address}</p>
								{/if}
							</div>
						</div>
						<form
							method="POST"
							action="?/deleteBranch"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="branchId" value={branch.id} />
							<button
								type="submit"
								class="rounded-xl p-2 text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-accent/10 hover:text-accent"
								title="Eliminar sucursal"
							>
								<span class="material-icons text-lg">delete</span>
							</button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Vista Previa del Footer (Modal) -->
	{#if showPreview}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			in:fade={{ duration: 150 }}
			class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
			onclick={(e) => {
				if (e.target === e.currentTarget) showPreview = false;
			}}
		>
			<div
				in:slide={{ duration: 250 }}
				class="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
			>
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-8 py-4 backdrop-blur-sm"
				>
					<div class="flex items-center gap-3">
						<span class="material-icons text-primary">preview</span>
						<h3 class="text-lg font-black text-slate-900">Vista Previa del Footer</h3>
						<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
							>Así se ve en la página</span
						>
					</div>
					<button
						onclick={() => (showPreview = false)}
						class="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50"
					>
						<span class="material-icons text-sm">close</span>
						Cerrar
					</button>
				</div>
				<Footer footer={{ info: footerInfo, branches }} />
			</div>
		</div>
	{/if}
</div>
