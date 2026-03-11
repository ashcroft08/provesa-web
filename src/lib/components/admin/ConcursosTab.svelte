<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { concursos = $bindable(), ganadores = $bindable(), formResult } = $props();

	// ─── Concursos state ───
	let showAddConcurso = $state(false);
	let editingConcursoId = $state(null);
	let isSubmitting = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');

	let newConcurso = $state({
		title: '',
		titleHighlight: '',
		description: '',
		imageUrl: '',
		badgeText: 'Sorteo Activo',
		closeDate: '',
		prizeName: '',
		ctaText: 'Ver Marcas Auspiciantes',
		disclaimer: '',
		isActive: false
	});

	function resetNewConcurso() {
		newConcurso = {
			title: '', titleHighlight: '', description: '', imageUrl: '',
			badgeText: 'Sorteo Activo', closeDate: '', prizeName: '',
			ctaText: 'Ver Marcas Auspiciantes', disclaimer: '', isActive: false
		};
		uploadError = '';
	}

	// ─── Ganadores state ───
	let showAddGanador = $state(false);
	let editingGanadorId = $state(null);

	let newGanador = $state({
		concursoId: '',
		winnerName: '',
		prize: '',
		testimonial: '',
		imageUrl: '',
		dateLabel: ''
	});

	function resetNewGanador() {
		newGanador = {
			concursoId: '', winnerName: '', prize: '',
			testimonial: '', imageUrl: '', dateLabel: ''
		};
		uploadError = '';
	}

	// ─── Upload helpers ───
	async function uploadImage(target = 'concurso') {
		return async (file) => {
			isUploading = true;
			uploadError = '';
			try {
				const formData = new FormData();
				formData.append('file', file);
				const res = await fetch('/api/upload', { method: 'POST', body: formData });
				const data = await res.json();
				if (!res.ok) { uploadError = data.error || 'Error al subir'; return; }
				if (target === 'concurso') newConcurso.imageUrl = data.url;
				else if (target === 'ganador') newGanador.imageUrl = data.url;
				return data.url;
			} catch { uploadError = 'Error de conexión'; } finally { isUploading = false; }
		};
	}

	let editConcursoImageUrl = $state('');
	let editGanadorImageUrl = $state('');

	async function doUpload(file) {
		isUploading = true;
		uploadError = '';
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			const data = await res.json();
			if (!res.ok) { uploadError = data.error || 'Error al subir'; return null; }
			return data.url;
		} catch { uploadError = 'Error de conexión'; return null; } finally { isUploading = false; }
	}

	async function handleConcursoFileSelect(e) {
		const file = e.target?.files?.[0];
		if (file) { const url = await doUpload(file); if (url) newConcurso.imageUrl = url; }
	}

	async function handleEditConcursoFileSelect(e) {
		const file = e.target?.files?.[0];
		if (file) { const url = await doUpload(file); if (url) editConcursoImageUrl = url; }
	}

	async function handleGanadorFileSelect(e) {
		const file = e.target?.files?.[0];
		if (file) { const url = await doUpload(file); if (url) newGanador.imageUrl = url; }
	}

	async function handleEditGanadorFileSelect(e) {
		const file = e.target?.files?.[0];
		if (file) { const url = await doUpload(file); if (url) editGanadorImageUrl = url; }
	}

	// ─── Active tab: concursos vs ganadores ───
	let activeSection = $state('concursos');
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<!-- Section toggle -->
	<div class="flex gap-3">
		<button
			onclick={() => (activeSection = 'concursos')}
			class="rounded-2xl px-6 py-3 text-sm font-bold transition-all {activeSection === 'concursos'
				? 'bg-primary text-white shadow-lg shadow-primary/20'
				: 'border border-slate-200 text-slate-500 hover:border-primary'}"
		>
			<span class="material-icons mr-1 align-middle text-sm">emoji_events</span>
			Concursos
		</button>
		<button
			onclick={() => (activeSection = 'ganadores')}
			class="rounded-2xl px-6 py-3 text-sm font-bold transition-all {activeSection === 'ganadores'
				? 'bg-primary text-white shadow-lg shadow-primary/20'
				: 'border border-slate-200 text-slate-500 hover:border-primary'}"
		>
			<span class="material-icons mr-1 align-middle text-sm">military_tech</span>
			Ganadores
		</button>
	</div>

	<!-- ═══════ CONCURSOS SECTION ═══════ -->
	{#if activeSection === 'concursos'}
		<div
			class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
		>
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-black text-slate-900">Concursos</h3>
					<p class="mt-1 text-sm text-slate-500">
						Administra los concursos y sorteos de la página pública.
					</p>
				</div>
				<div class="flex items-center gap-3">
					<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
						{concursos.length} concurso{concursos.length !== 1 ? 's' : ''}
					</span>
					<button
						onclick={() => {
							showAddConcurso = !showAddConcurso;
							if (!showAddConcurso) resetNewConcurso();
						}}
						class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
					>
						<span class="material-icons text-sm">{showAddConcurso ? 'close' : 'add'}</span>
						{showAddConcurso ? 'Cancelar' : 'Nuevo Concurso'}
					</button>
				</div>
			</div>

			<!-- Add concurso form -->
			{#if showAddConcurso}
				<div
					in:slide
					class="mb-8 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6"
				>
					<h4 class="mb-1 text-sm font-bold text-primary">Nuevo Concurso</h4>
					<form
						method="POST"
						action="?/addConcurso"
						enctype="multipart/form-data"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								resetNewConcurso();
								showAddConcurso = false;
								await update();
							};
						}}
						class="space-y-5"
					>
						<!-- Image upload -->
						<div>
							<label class="mb-2 block text-xs font-bold text-slate-600">Imagen del concurso</label
							>
							{#if newConcurso.imageUrl}
								<div class="relative overflow-hidden rounded-2xl">
									<img
										src={newConcurso.imageUrl}
										alt="Preview"
										class="h-44 w-full object-cover"
									/>
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
									>
										<label
											class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700"
										>
											<span class="material-icons text-sm">swap_horiz</span>
											Cambiar
											<input
												type="file"
												name="image"
												accept="image/*"
												class="hidden"
												onchange={handleConcursoFileSelect}
											/>
										</label>
									</div>
								</div>
							{:else}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 transition-all hover:border-primary hover:bg-primary/5"
									onclick={() => document.getElementById('newConcursoFile')?.click()}
									onkeydown={() => {}}
									role="button"
									tabindex="0"
								>
									{#if isUploading}
										<div class="flex items-center gap-3">
											<div
												class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
											></div>
											<span class="text-sm font-bold text-primary">Subiendo imagen...</span>
										</div>
									{:else}
										<span class="material-icons mb-2 text-4xl text-slate-300">cloud_upload</span>
										<p class="text-sm font-bold text-slate-500">Arrastra o haz clic para subir</p>
									{/if}
								</div>
								<input
									type="file"
									id="newConcursoFile"
									name="image"
									accept="image/*"
									class="hidden"
									onchange={handleConcursoFileSelect}
								/>
							{/if}
						</div>

						{#if uploadError}
							<p class="flex items-center gap-1 text-sm text-red-500">
								<span class="material-icons text-sm">error</span>
								{uploadError}
							</p>
						{/if}

						<!-- Text fields -->
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Título principal</label>
								<input
									type="text"
									name="title"
									bind:value={newConcurso.title}
									placeholder="Equipa tu Negocio"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Texto resaltado</label>
								<input
									type="text"
									name="titleHighlight"
									bind:value={newConcurso.titleHighlight}
									placeholder="con Provesa"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
								<p class="mt-1 text-[10px] text-slate-400">Aparece en color primary debajo del título.</p>
							</div>
						</div>

						<div>
							<label class="mb-1 block text-xs font-bold text-slate-600">Descripción</label>
							<textarea
								name="description"
								rows="2"
								bind:value={newConcurso.description}
								placeholder="Por cada $150 en compras..."
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							></textarea>
						</div>

						<div class="grid gap-4 md:grid-cols-3">
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Etiqueta</label>
								<input
									type="text"
									name="badgeText"
									bind:value={newConcurso.badgeText}
									placeholder="Sorteo Activo"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Fecha de cierre</label>
								<input
									type="text"
									name="closeDate"
									bind:value={newConcurso.closeDate}
									placeholder="30 Nov, 2026"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Premio principal</label>
								<input
									type="text"
									name="prizeName"
									bind:value={newConcurso.prizeName}
									placeholder="Combo Tech"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Texto del botón</label>
								<input
									type="text"
									name="ctaText"
									bind:value={newConcurso.ctaText}
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Nota al pie</label>
								<input
									type="text"
									name="disclaimer"
									bind:value={newConcurso.disclaimer}
									placeholder="* Válido para compras en..."
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<label class="flex items-center gap-2 text-sm font-bold text-slate-600">
								<input
									type="checkbox"
									bind:checked={newConcurso.isActive}
									class="rounded border-slate-300 text-primary focus:ring-primary/20"
								/>
								Activo (visible en la página pública)
							</label>
							<input type="hidden" name="isActive" value={newConcurso.isActive} />
						</div>

						<button
							type="submit"
							disabled={isSubmitting || isUploading}
							class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
						>
							{isSubmitting ? 'Agregando...' : 'Agregar Concurso'}
							<span class="material-icons text-sm">add_circle</span>
						</button>
					</form>
				</div>
			{/if}

			<!-- Concursos list -->
			{#if concursos.length === 0}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="mb-4 rounded-3xl bg-slate-50 p-6">
						<span class="material-icons text-4xl text-slate-300">emoji_events</span>
					</div>
					<p class="text-sm font-bold text-slate-400">No hay concursos configurados</p>
					<p class="mt-1 text-xs text-slate-300">Agrega un concurso para mostrarlo en la página.</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each concursos as c (c.id)}
						<div
							in:slide
							class="group overflow-hidden rounded-2xl border border-slate-50 bg-[#F8FAFC] transition-all hover:shadow-lg hover:shadow-slate-100"
						>
							<div class="flex items-center gap-4 p-4">
								{#if c.imageUrl}
									<div class="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-xl">
										<img src={c.imageUrl} alt={c.title} class="h-full w-full object-cover" />
									</div>
								{:else}
									<div
										class="flex h-16 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200"
									>
										<span class="material-icons text-2xl text-slate-400">image</span>
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-bold text-slate-800">
										{c.title || '(Sin título)'}
										{#if c.titleHighlight}<span class="text-primary">
												{c.titleHighlight}</span
											>{/if}
									</p>
									{#if c.prizeName}
										<p class="mt-0.5 text-xs text-slate-400">Premio: {c.prizeName}</p>
									{/if}
								</div>
								{#if c.isActive}
									<span
										class="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700"
										>Activo</span
									>
								{:else}
									<span
										class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-400"
										>Inactivo</span
									>
								{/if}
								<div
									class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<button
										onclick={() => {
											editingConcursoId = editingConcursoId === c.id ? null : c.id;
											editConcursoImageUrl = c.imageUrl || '';
										}}
										class="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
										title="Editar"
									>
										<span class="material-icons text-lg">edit</span>
									</button>
									<form
										method="POST"
										action="?/deleteConcurso"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
											};
										}}
									>
										<input type="hidden" name="id" value={c.id} />
										<button
											type="submit"
											class="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
											title="Eliminar"
										>
											<span class="material-icons text-lg">delete</span>
										</button>
									</form>
								</div>
							</div>

							<!-- Edit concurso form -->
							{#if editingConcursoId === c.id}
								<div in:slide class="border-t border-slate-100 bg-white p-5">
									<form
										method="POST"
										action="?/updateConcurso"
										enctype="multipart/form-data"
										use:enhance={() => {
											isSubmitting = true;
											return async ({ update }) => {
												isSubmitting = false;
												editingConcursoId = null;
												await update();
											};
										}}
										class="space-y-4"
									>
										<input type="hidden" name="id" value={c.id} />

										<!-- Edit image -->
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Imagen</label>
											<div class="relative overflow-hidden rounded-2xl">
												<img
													src={editConcursoImageUrl || '/placeholder.png'}
													alt="Preview"
													class="h-32 w-full object-cover"
												/>
												<div
													class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
												>
													<label
														class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700"
													>
														<span class="material-icons text-sm">cloud_upload</span>
														{isUploading ? 'Subiendo...' : 'Cambiar'}
														<input
															type="file"
															name="image"
															accept="image/*"
															class="hidden"
															onchange={handleEditConcursoFileSelect}
														/>
													</label>
												</div>
											</div>
										</div>

										<div class="grid gap-4 md:grid-cols-2">
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Título</label
												>
												<input
													type="text"
													name="title"
													value={c.title}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600"
													>Texto resaltado</label
												>
												<input
													type="text"
													name="titleHighlight"
													value={c.titleHighlight}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
										</div>

										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Descripción</label
											>
											<textarea
												name="description"
												rows="2"
												value={c.description}
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
											></textarea>
										</div>

										<div class="grid gap-4 md:grid-cols-3">
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Etiqueta</label
												>
												<input
													type="text"
													name="badgeText"
													value={c.badgeText}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600"
													>Fecha cierre</label
												>
												<input
													type="text"
													name="closeDate"
													value={c.closeDate}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Premio</label>
												<input
													type="text"
													name="prizeName"
													value={c.prizeName}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
										</div>

										<div class="grid gap-4 md:grid-cols-2">
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600"
													>Texto botón</label
												>
												<input
													type="text"
													name="ctaText"
													value={c.ctaText}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600"
													>Nota al pie</label
												>
												<input
													type="text"
													name="disclaimer"
													value={c.disclaimer}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
										</div>

										<div class="flex items-center gap-3">
											<label class="flex items-center gap-2 text-sm font-bold text-slate-600">
												<input
													type="checkbox"
													checked={c.isActive}
													onchange={(e) => {}}
													class="rounded border-slate-300 text-primary focus:ring-primary/20"
												/>
												Activo
											</label>
											<input type="hidden" name="isActive" value={c.isActive} />
										</div>

										<div class="flex justify-end gap-3">
											<button
												type="button"
												onclick={() => (editingConcursoId = null)}
												class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-500"
												>Cancelar</button
											>
											<button
												type="submit"
												disabled={isSubmitting}
												class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
											>
												{isSubmitting ? 'Guardando...' : 'Guardar'}
												<span class="material-icons text-sm">save</span>
											</button>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- ═══════ GANADORES SECTION ═══════ -->
	{#if activeSection === 'ganadores'}
		<div
			class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
		>
			<div class="mb-8 flex items-center justify-between">
				<div>
					<h3 class="text-2xl font-black text-slate-900">Ganadores</h3>
					<p class="mt-1 text-sm text-slate-500">
						Administra la evidencia de ganadores que se muestra en el carrusel.
					</p>
				</div>
				<div class="flex items-center gap-3">
					<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
						{ganadores.length} ganador{ganadores.length !== 1 ? 'es' : ''}
					</span>
					<button
						onclick={() => {
							showAddGanador = !showAddGanador;
							if (!showAddGanador) resetNewGanador();
						}}
						class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
					>
						<span class="material-icons text-sm">{showAddGanador ? 'close' : 'add'}</span>
						{showAddGanador ? 'Cancelar' : 'Nuevo Ganador'}
					</button>
				</div>
			</div>

			<!-- Add ganador form -->
			{#if showAddGanador}
				<div
					in:slide
					class="mb-8 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6"
				>
					<h4 class="mb-4 text-sm font-bold text-primary">Nuevo Ganador</h4>
					<form
						method="POST"
						action="?/addGanador"
						enctype="multipart/form-data"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								resetNewGanador();
								showAddGanador = false;
								await update();
							};
						}}
						class="space-y-5"
					>
						<!-- Image upload -->
						<div>
							<label class="mb-2 block text-xs font-bold text-slate-600">Foto del ganador</label>
							{#if newGanador.imageUrl}
								<div class="relative h-44 overflow-hidden rounded-2xl">
									<img
										src={newGanador.imageUrl}
										alt="Preview"
										class="h-full w-full object-cover"
									/>
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
									>
										<label
											class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700"
										>
											<span class="material-icons text-sm">swap_horiz</span>
											Cambiar
											<input
												type="file"
												name="image"
												accept="image/*"
												class="hidden"
												onchange={handleGanadorFileSelect}
											/>
										</label>
									</div>
								</div>
							{:else}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 transition-all hover:border-primary hover:bg-primary/5"
									onclick={() => document.getElementById('newGanadorFile')?.click()}
									onkeydown={() => {}}
									role="button"
									tabindex="0"
								>
									{#if isUploading}
										<div class="flex items-center gap-3">
											<div
												class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
											></div>
											<span class="text-sm font-bold text-primary">Subiendo...</span>
										</div>
									{:else}
										<span class="material-icons mb-2 text-4xl text-slate-300">cloud_upload</span>
										<p class="text-sm font-bold text-slate-500">Arrastra o haz clic para subir</p>
									{/if}
								</div>
								<input
									type="file"
									id="newGanadorFile"
									name="image"
									accept="image/*"
									class="hidden"
									onchange={handleGanadorFileSelect}
								/>
							{/if}
						</div>

						<!-- Concurso selector -->
						<div>
							<label class="mb-1 block text-xs font-bold text-slate-600">Concurso asociado</label>
							<select
								name="concursoId"
								bind:value={newGanador.concursoId}
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							>
								<option value="">Sin concurso</option>
								{#each concursos as c}
									<option value={c.id}>{c.title} {c.titleHighlight || ''}</option>
								{/each}
							</select>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Nombre del ganador</label
								>
								<input
									type="text"
									name="winnerName"
									bind:value={newGanador.winnerName}
									placeholder="D' Todo Market"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Premio ganado</label>
								<input
									type="text"
									name="prize"
									bind:value={newGanador.prize}
									placeholder="Orden de Compra $300"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
							</div>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Testimonio</label>
								<textarea
									name="testimonial"
									rows="2"
									bind:value={newGanador.testimonial}
									placeholder="Siempre compro aquí por el surtido..."
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								></textarea>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600"
									>Etiqueta de fecha</label
								>
								<input
									type="text"
									name="dateLabel"
									bind:value={newGanador.dateLabel}
									placeholder="Octubre 2025"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
								<p class="mt-1 text-[10px] text-slate-400">
									Se muestra sobre la imagen en el carrusel.
								</p>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting || isUploading}
							class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
						>
							{isSubmitting ? 'Agregando...' : 'Agregar Ganador'}
							<span class="material-icons text-sm">military_tech</span>
						</button>
					</form>
				</div>
			{/if}

			<!-- Ganadores list -->
			{#if ganadores.length === 0}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="mb-4 rounded-3xl bg-slate-50 p-6">
						<span class="material-icons text-4xl text-slate-300">military_tech</span>
					</div>
					<p class="text-sm font-bold text-slate-400">No hay ganadores registrados</p>
					<p class="mt-1 text-xs text-slate-300">
						Agrega ganadores para el carrusel de la página.
					</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each ganadores as g (g.id)}
						<div
							in:slide
							class="group overflow-hidden rounded-2xl border border-slate-50 bg-[#F8FAFC] transition-all hover:shadow-lg hover:shadow-slate-100"
						>
							<div class="flex items-center gap-4 p-4">
								{#if g.imageUrl}
									<div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
										<img
											src={g.imageUrl}
											alt={g.winnerName}
											class="h-full w-full object-cover"
										/>
									</div>
								{:else}
									<div
										class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200"
									>
										<span class="text-2xl">🏆</span>
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-bold text-slate-800">{g.winnerName}</p>
									{#if g.prize}
										<p class="mt-0.5 text-xs font-semibold text-red-500">{g.prize}</p>
									{/if}
									{#if g.dateLabel}
										<span
											class="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600"
											>{g.dateLabel}</span
										>
									{/if}
								</div>
								<div
									class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<button
										onclick={() => {
											editingGanadorId = editingGanadorId === g.id ? null : g.id;
											editGanadorImageUrl = g.imageUrl || '';
										}}
										class="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
										title="Editar"
									>
										<span class="material-icons text-lg">edit</span>
									</button>
									<form
										method="POST"
										action="?/deleteGanador"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
											};
										}}
									>
										<input type="hidden" name="id" value={g.id} />
										<button
											type="submit"
											class="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
											title="Eliminar"
										>
											<span class="material-icons text-lg">delete</span>
										</button>
									</form>
								</div>
							</div>

							<!-- Edit ganador form -->
							{#if editingGanadorId === g.id}
								<div in:slide class="border-t border-slate-100 bg-white p-5">
									<form
										method="POST"
										action="?/updateGanador"
										enctype="multipart/form-data"
										use:enhance={() => {
											isSubmitting = true;
											return async ({ update }) => {
												isSubmitting = false;
												editingGanadorId = null;
												await update();
											};
										}}
										class="space-y-4"
									>
										<input type="hidden" name="id" value={g.id} />

										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Foto</label>
											<div class="relative h-32 overflow-hidden rounded-2xl">
												<img
													src={editGanadorImageUrl || '/placeholder.png'}
													alt="Preview"
													class="h-full w-full object-cover"
												/>
												<div
													class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
												>
													<label
														class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700"
													>
														<span class="material-icons text-sm">cloud_upload</span>
														{isUploading ? 'Subiendo...' : 'Cambiar'}
														<input
															type="file"
															name="image"
															accept="image/*"
															class="hidden"
															onchange={handleEditGanadorFileSelect}
														/>
													</label>
												</div>
											</div>
										</div>

										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600"
												>Concurso asociado</label
											>
											<select
												name="concursoId"
												value={g.concursoId}
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
											>
												<option value="">Sin concurso</option>
												{#each concursos as c}
													<option value={c.id}>{c.title} {c.titleHighlight || ''}</option>
												{/each}
											</select>
										</div>

										<div class="grid gap-4 md:grid-cols-2">
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Nombre</label
												>
												<input
													type="text"
													name="winnerName"
													value={g.winnerName}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Premio</label>
												<input
													type="text"
													name="prize"
													value={g.prize}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
										</div>

										<div class="grid gap-4 md:grid-cols-2">
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600"
													>Testimonio</label
												>
												<textarea
													name="testimonial"
													rows="2"
													value={g.testimonial}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												></textarea>
											</div>
											<div>
												<label class="mb-1 block text-xs font-bold text-slate-600">Fecha</label>
												<input
													type="text"
													name="dateLabel"
													value={g.dateLabel}
													class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm"
												/>
											</div>
										</div>

										<div class="flex justify-end gap-3">
											<button
												type="button"
												onclick={() => (editingGanadorId = null)}
												class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-500"
												>Cancelar</button
											>
											<button
												type="submit"
												disabled={isSubmitting}
												class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
											>
												{isSubmitting ? 'Guardando...' : 'Guardar'}
												<span class="material-icons text-sm">save</span>
											</button>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
