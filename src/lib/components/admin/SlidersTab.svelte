<script>
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	let { slides = $bindable(), formResult } = $props();

	let showAddForm = $state(false);
	let editingId = $state(null);
	let isSubmitting = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');

	let newSlide = $state({
		imageUrl: '',
		title: '',
		highlight: '',
		description: '',
		badge: '',
		align: 'left',
		highlightColor: 'text-accent-yellow'
	});

	function resetNewSlide() {
		newSlide = {
			imageUrl: '',
			title: '',
			highlight: '',
			description: '',
			badge: '',
			align: 'left',
			highlightColor: 'text-accent-yellow'
		};
		uploadError = '';
	}

	const alignOptions = [
		{ value: 'left', label: 'Izquierda', icon: 'format_align_left' },
		{ value: 'center', label: 'Centro', icon: 'format_align_center' },
		{ value: 'right', label: 'Derecha', icon: 'format_align_right' }
	];

	const colorOptions = [
		{ value: 'text-accent-yellow', label: 'Amarillo', color: '#FFD100' },
		{ value: 'text-primary', label: 'Azul', color: '#1565C0' },
		{ value: 'text-accent-red', label: 'Rojo', color: '#E4002B' },
		{ value: 'text-white', label: 'Blanco', color: '#FFFFFF' }
	];

	async function uploadImage(file, target = 'new') {
		isUploading = true;
		uploadError = '';
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			const data = await res.json();
			if (!res.ok) {
				uploadError = data.error || 'Error al subir';
				return;
			}
			if (target === 'new') {
				newSlide.imageUrl = data.url;
			}
			return data.url;
		} catch {
			uploadError = 'Error de conexión al subir la imagen';
		} finally {
			isUploading = false;
		}
	}

	function handleFileDrop(e, target = 'new') {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (file) uploadImage(file, target);
	}

	function handleFileSelect(e, target = 'new') {
		const file = e.target?.files?.[0];
		if (file) uploadImage(file, target);
	}

	let editImageUrl = $state('');

	async function uploadEditImage(file) {
		isUploading = true;
		uploadError = '';
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: formData });
			const data = await res.json();
			if (!res.ok) {
				uploadError = data.error || 'Error al subir';
				return;
			}
			editImageUrl = data.url;
		} catch {
			uploadError = 'Error de conexión';
		} finally {
			isUploading = false;
		}
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Slides del Hero</h3>
				<p class="mt-1 text-sm text-slate-500">
					Administra los slides del banner principal de la página de inicio.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
					{slides.length} slide{slides.length !== 1 ? 's' : ''}
				</span>
				<button
					onclick={() => {
						showAddForm = !showAddForm;
						if (!showAddForm) resetNewSlide();
					}}
					class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
				>
					<span class="material-icons text-sm">{showAddForm ? 'close' : 'add'}</span>
					{showAddForm ? 'Cancelar' : 'Nuevo Slide'}
				</button>
			</div>
		</div>

		<!-- Guía rápida -->
		{#if slides.length === 0 && !showAddForm}
			<div class="mb-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
				<div class="flex items-start gap-3">
					<span class="material-icons text-blue-400">info</span>
					<div class="text-sm text-blue-700">
						<p class="font-bold">¿Cómo funcionan los slides?</p>
						<p class="mt-1 text-blue-600">
							Sin slides configurados, se mostrarán 3 slides por defecto. Al agregar tus propios
							slides, estos reemplazarán los predeterminados.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Formulario para agregar -->
		{#if showAddForm}
			<div
				in:slide
				class="mb-8 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6"
			>
				<h4 class="mb-1 text-sm font-bold text-primary">Nuevo Slide</h4>
				<p class="mb-5 text-xs text-slate-400">Los campos marcados con * son obligatorios.</p>

				<form
					method="POST"
					action="?/addSlide"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							resetNewSlide();
							showAddForm = false;
							await update();
						};
					}}
					class="space-y-5"
				>
					<!-- Upload de imagen -->
					<div>
						<label class="mb-2 block text-xs font-bold text-slate-600">Imagen del Slide *</label>
						{#if newSlide.imageUrl}
							<div class="relative overflow-hidden rounded-2xl">
								<img src={newSlide.imageUrl} alt="Preview" class="h-44 w-full object-cover" />
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
								>
									<label
										class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-white"
									>
										<span class="material-icons text-sm">swap_horiz</span>
										Cambiar imagen
										<input
											type="file"
											accept="image/*"
											class="hidden"
											onchange={(e) => handleFileSelect(e, 'new')}
										/>
									</label>
								</div>
							</div>
						{:else}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 transition-all hover:border-primary hover:bg-primary/5"
								ondragover={(e) => e.preventDefault()}
								ondrop={(e) => handleFileDrop(e, 'new')}
								onclick={() => document.getElementById('newSlideFile')?.click()}
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
									<p class="mt-1 text-xs text-slate-400">
										JPG, PNG, WebP · Máx 10MB · Se recomienda 1920×1080px
									</p>
								{/if}
							</div>
							<input
								type="file"
								id="newSlideFile"
								accept="image/*"
								class="hidden"
								onchange={(e) => handleFileSelect(e, 'new')}
							/>
						{/if}
						<input type="hidden" name="imageUrl" value={newSlide.imageUrl} />
					</div>

					{#if uploadError}
						<p class="flex items-center gap-1 text-sm text-red-500">
							<span class="material-icons text-sm">error</span>
							{uploadError}
						</p>
					{/if}

					<!-- Textos principales con explicación -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						<p class="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Textos del slide
						</p>
						<p class="mb-4 text-xs text-slate-400">
							El título y el texto destacado se combinan: "<strong>El pulso de la</strong>
							<span class="font-bold text-primary">distribución</span>"
						</p>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label for="newTitle" class="mb-1 block text-xs font-bold text-slate-600"
									>Título principal</label
								>
								<input
									type="text"
									name="title"
									id="newTitle"
									bind:value={newSlide.title}
									placeholder="El pulso de la"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
								<p class="mt-1 text-[10px] text-slate-400">
									Texto principal en blanco. Máx 4-5 palabras.
								</p>
							</div>
							<div>
								<label for="newHighlight" class="mb-1 block text-xs font-bold text-slate-600"
									>Palabra destacada</label
								>
								<input
									type="text"
									name="highlight"
									id="newHighlight"
									bind:value={newSlide.highlight}
									maxlength="30"
									placeholder="distribución"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
								<p class="mt-1 text-[10px] text-slate-400">
									1-2 palabras que se resaltan con color. Máx 30 caracteres.
								</p>
							</div>
						</div>

						<div class="mt-4">
							<label for="newDescription" class="mb-1 block text-xs font-bold text-slate-600"
								>Descripción corta</label
							>
							<textarea
								name="description"
								id="newDescription"
								rows="2"
								maxlength="150"
								bind:value={newSlide.description}
								placeholder="Garantizamos el abastecimiento estratégico que su negocio necesita."
								class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
							></textarea>
							<p class="mt-1 text-[10px] text-slate-400">
								{newSlide.description.length}/150 caracteres. Aparece debajo del título en letra
								pequeña.
							</p>
						</div>
					</div>

					<!-- Configuración visual -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						<p class="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Configuración visual
						</p>

						<div class="grid gap-4 md:grid-cols-3">
							<div>
								<label for="newBadge" class="mb-1 block text-xs font-bold text-slate-600"
									>Etiqueta superior</label
								>
								<input
									type="text"
									name="badge"
									id="newBadge"
									maxlength="30"
									bind:value={newSlide.badge}
									placeholder="Solidez desde 2006"
									class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
								/>
								<p class="mt-1 text-[10px] text-slate-400">Aparece arriba del título. Opcional.</p>
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600">Posición del texto</label
								>
								<div class="flex gap-2">
									{#each alignOptions as opt}
										<button
											type="button"
											onclick={() => (newSlide.align = opt.value)}
											class="flex flex-1 flex-col items-center gap-1 rounded-xl p-2 text-[10px] transition-all {newSlide.align ===
											opt.value
												? 'bg-primary text-white shadow-md'
												: 'border border-slate-200 text-slate-500 hover:border-primary'}"
										>
											<span class="material-icons text-base">{opt.icon}</span>
											{opt.label}
										</button>
									{/each}
								</div>
								<input type="hidden" name="align" value={newSlide.align} />
							</div>
							<div>
								<label class="mb-1 block text-xs font-bold text-slate-600"
									>Color de la palabra</label
								>
								<div class="flex gap-2">
									{#each colorOptions as opt}
										<button
											type="button"
											onclick={() => (newSlide.highlightColor = opt.value)}
											class="group relative h-10 w-10 rounded-xl border-2 transition-all hover:scale-110 {newSlide.highlightColor ===
											opt.value
												? 'scale-110 border-primary shadow-md'
												: 'border-slate-200'}"
											style="background-color: {opt.color};"
											title={opt.label}
										>
											{#if newSlide.highlightColor === opt.value}
												<span
													class="material-icons absolute inset-0 flex items-center justify-center text-xs {opt.color ===
													'#FFFFFF'
														? 'text-primary'
														: 'text-white'}">check</span
												>
											{/if}
										</button>
									{/each}
								</div>
								<input type="hidden" name="highlightColor" value={newSlide.highlightColor} />
							</div>
						</div>
					</div>

					<!-- Live Preview -->
					{#if newSlide.imageUrl}
						<div class="rounded-2xl border border-slate-100 bg-white p-5">
							<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
								<span class="material-icons mr-1 align-middle text-xs">visibility</span> Vista previa
							</p>
							<div class="relative overflow-hidden rounded-2xl" style="aspect-ratio: 16/7;">
								<img src={newSlide.imageUrl} alt="Preview" class="h-full w-full object-cover" />
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10"
								></div>
								<div
									class="absolute inset-0 flex items-center p-6"
									class:justify-start={newSlide.align === 'left'}
									class:justify-center={newSlide.align === 'center'}
									class:justify-end={newSlide.align === 'right'}
								>
									<div
										class:text-left={newSlide.align === 'left'}
										class:text-center={newSlide.align === 'center'}
										class:text-right={newSlide.align === 'right'}
									>
										{#if newSlide.badge}
											<span
												class="mb-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80 uppercase backdrop-blur"
												>{newSlide.badge}</span
											>
										{/if}
										<p class="text-xl leading-tight font-extrabold text-white md:text-2xl">
											{newSlide.title || 'Título'}
											<span class={newSlide.highlightColor}>{newSlide.highlight || ''}</span>
										</p>
										{#if newSlide.description}
											<p
												class="mt-1 max-w-xs text-xs text-white/70"
												class:mx-auto={newSlide.align === 'center'}
												class:ml-auto={newSlide.align === 'right'}
											>
												{newSlide.description}
											</p>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isSubmitting || !newSlide.imageUrl || isUploading}
						class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
					>
						{isSubmitting ? 'Agregando...' : 'Agregar Slide'}
						<span class="material-icons text-sm">add_photo_alternate</span>
					</button>
				</form>
			</div>
		{/if}

		<!-- Lista de slides existentes -->
		{#if slides.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-4 rounded-3xl bg-slate-50 p-6">
					<span class="material-icons text-4xl text-slate-300">photo_library</span>
				</div>
				<p class="text-sm font-bold text-slate-400">No hay slides configurados</p>
				<p class="mt-1 text-xs text-slate-300">Se mostrarán 3 slides por defecto.</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each slides as s, i (s.id)}
					<div
						in:slide
						class="group overflow-hidden rounded-2xl border border-slate-50 bg-[#F8FAFC] transition-all hover:shadow-lg hover:shadow-slate-100"
					>
						<div class="flex items-center gap-4 p-4">
							<div class="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-xl">
								<img src={s.imageUrl} alt={s.title} class="h-full w-full object-cover" />
								<div class="absolute inset-0 bg-black/30"></div>
								<div class="absolute bottom-1 left-1">
									<span
										class="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
									>
										{s.align === 'left' ? '← Izq' : s.align === 'right' ? 'Der →' : '↔ Centro'}
									</span>
								</div>
							</div>

							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-bold text-slate-800">
									{s.title || '(Sin título)'}
									{#if s.highlight}<span class="text-primary"> {s.highlight}</span>{/if}
								</p>
								{#if s.description}
									<p class="mt-0.5 truncate text-xs text-slate-400">{s.description}</p>
								{/if}
								{#if s.badge}
									<span
										class="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600"
										>{s.badge}</span
									>
								{/if}
							</div>

							<span class="text-xs font-bold text-slate-300">#{i + 1}</span>

							<div
								class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<button
									onclick={() => {
										editingId = editingId === s.id ? null : s.id;
										editImageUrl = s.imageUrl;
									}}
									class="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
									title="Editar"
								>
									<span class="material-icons text-lg">edit</span>
								</button>
								<form
									method="POST"
									action="?/deleteSlide"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
										};
									}}
								>
									<input type="hidden" name="slideId" value={s.id} />
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

						<!-- Formulario de edición expandible -->
						{#if editingId === s.id}
							<div in:slide class="border-t border-slate-100 bg-white p-5">
								<form
									method="POST"
									action="?/updateSlide"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											isSubmitting = false;
											editingId = null;
											await update();
										};
									}}
									class="space-y-4"
								>
									<input type="hidden" name="slideId" value={s.id} />

									<div>
										<label class="mb-1 block text-xs font-bold text-slate-600">Imagen</label>
										<div class="relative overflow-hidden rounded-2xl">
											<img src={editImageUrl} alt="Preview" class="h-32 w-full object-cover" />
											<div
												class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
											>
												<label
													class="flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-white"
												>
													<span class="material-icons text-sm">cloud_upload</span>
													{isUploading ? 'Subiendo...' : 'Cambiar'}
													<input
														type="file"
														accept="image/*"
														class="hidden"
														onchange={(e) => {
															const file = e.target?.files?.[0];
															if (file) uploadEditImage(file);
														}}
													/>
												</label>
											</div>
										</div>
										<input type="hidden" name="imageUrl" value={editImageUrl} />
									</div>

									<div class="grid gap-4 md:grid-cols-2">
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600"
												>Título principal</label
											>
											<input
												type="text"
												name="title"
												value={s.title}
												placeholder="El pulso de la"
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
											/>
											<p class="mt-1 text-[10px] text-slate-400">3-5 palabras</p>
										</div>
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600"
												>Palabra destacada</label
											>
											<input
												type="text"
												name="highlight"
												value={s.highlight}
												placeholder="distribución"
												maxlength="30"
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
											/>
											<p class="mt-1 text-[10px] text-slate-400">
												1-2 palabras con color. Máx 30 car.
											</p>
										</div>
									</div>

									<div>
										<label class="mb-1 block text-xs font-bold text-slate-600"
											>Descripción corta</label
										>
										<textarea
											name="description"
											rows="2"
											value={s.description}
											maxlength="150"
											placeholder="Texto breve debajo del título..."
											class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
										></textarea>
									</div>

									<div class="grid gap-4 md:grid-cols-3">
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Etiqueta</label>
											<input
												type="text"
												name="badge"
												value={s.badge}
												placeholder="Opcional"
												maxlength="30"
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
											/>
										</div>
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Posición</label>
											<select
												name="align"
												value={s.align}
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
											>
												<option value="left">← Izquierda</option>
												<option value="center">↔ Centro</option>
												<option value="right">→ Derecha</option>
											</select>
										</div>
										<div>
											<label class="mb-1 block text-xs font-bold text-slate-600">Color</label>
											<select
												name="highlightColor"
												value={s.highlightColor}
												class="w-full rounded-xl border-slate-200 bg-[#F8FAFC] p-3 text-sm focus:ring-primary/20"
											>
												<option value="text-accent-yellow">Amarillo</option>
												<option value="text-primary">Azul</option>
												<option value="text-accent-red">Rojo</option>
												<option value="text-white">Blanco</option>
											</select>
										</div>
									</div>

									<div class="flex justify-end gap-3">
										<button
											type="button"
											onclick={() => (editingId = null)}
											class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50"
											>Cancelar</button
										>
										<button
											type="submit"
											disabled={isSubmitting}
											class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
</div>
