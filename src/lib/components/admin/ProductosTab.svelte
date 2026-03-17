<script>
	/**
	 * @component ProductosTab
	 * Panel de administración para la gestión de productos del catálogo.
	 * Maneja:
	 * 1. CRUD de productos con persistencia en BD via Drizzle.
	 * 2. Subida de múltiples imágenes a Cloudinary (vía API interna /api/upload).
	 * 3. Gestión de listas dinámicas (Características y Categorías) almacenadas como JSON.
	 * 4. Control de estados de edición y carga.
	 */
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	/**
	 * @typedef {Object} ProductFeature
	 * @property {string} title
	 * @property {string} desc
	 */

	/**
	 * @typedef {Object} ProductCategory
	 * @property {string} num
	 * @property {string} name
	 * @property {string} desc
	 */

	/**
	 * @typedef {Object} Product
	 * @property {number} [id]
	 * @property {string} name
	 * @property {string} description
	 * @property {string} align
	 * @property {string} accentColor
	 * @property {string} displayType
	 * @property {string[]} images
	 * @property {ProductFeature[]} features
	 * @property {ProductCategory[]} categories
	 */

	let { 
		/** @type {Product[]} */
		products = $bindable(),
		/** @type {any} */
		formResult = null
	} = $props();

	// Estados de UI
	let showAddForm = $state(false);
	/** @type {number|null} */
	let editingId = $state(null);
	let isSubmitting = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');

	// Estado inicial para nuevos productos
	/** @type {Product} */
	let newProduct = $state({
		name: '',
		description: '',
		align: 'left',
		accentColor: 'primary',
		displayType: 'features',
		images: [],
		features: [{ title: '', desc: '' }],
		categories: [{ num: '01', name: '', desc: '' }]
	});

	function resetNewProduct() {
		newProduct = {
			name: '',
			description: '',
			align: 'left',
			accentColor: 'primary',
			displayType: 'features',
			images: [],
			features: [{ title: '', desc: '' }],
			categories: [{ num: '01', name: '', desc: '' }]
		};
		uploadError = '';
	}

	// Editar: datos del producto que se está editando
	/** @type {Product|null} */
	let editData = $state(null);

	/**
	 * Activa el modo edición para un producto específico.
	 * Realiza una copia profunda de los arrays de imágenes, características y categorías
	 * para evitar mutaciones directas antes de guardar.
	 * @param {Product} product
	 */
	function startEdit(product) {
		editingId = product.id ?? null;
		editData = {
			name: product.name || '',
			description: product.description || '',
			align: product.align || 'left',
			accentColor: product.accentColor || 'primary',
			displayType: product.displayType || 'features',
			images: [...(product.images || [])],
			features: product.features?.length
				? product.features.map((f) => ({ ...f }))
				: [{ title: '', desc: '' }],
			categories: product.categories?.length
				? product.categories.map((c) => ({ ...c }))
				: [{ num: '01', name: '', desc: '' }]
		};
	}

	/** 
	 * Sube un archivo a Cloudinary usando el endpoint de API local.
	 * El target determina si la URL resultante va a 'newProduct' o a 'editData'.
	 * @param {File} file
	 * @param {'new'|'edit'} target
	 */
	async function uploadImage(file, target = 'new') {
		isUploading = true;
		uploadError = '';
		try {
			const fd = new FormData();
			fd.append('file', file);
			const res = await fetch('/api/upload', { method: 'POST', body: fd });
			const data = await res.json();
			if (!res.ok) {
				uploadError = data.error || 'Error al subir';
				return;
			}
			if (target === 'new') {
				newProduct.images = [...newProduct.images, data.url];
			} else if (editData) {
				editData.images = [...editData.images, data.url];
			}
		} catch {
			uploadError = 'Error de conexión';
		} finally {
			isUploading = false;
		}
	}

	/**
	 * @param {'new'|'edit'} target
	 * @param {number} index
	 */
	function removeImage(target, index) {
		if (target === 'new') {
			newProduct.images = newProduct.images.filter((_, i) => i !== index);
		} else if (editData) {
			editData.images = editData.images.filter((_, i) => i !== index);
		}
	}

	// Helpers para features/categories
	/** @param {'new'|'edit'} target */
	function addFeature(target) {
		if (target === 'new') newProduct.features = [...newProduct.features, { title: '', desc: '' }];
		else if (editData) editData.features = [...editData.features, { title: '', desc: '' }];
	}
	/**
	 * @param {'new'|'edit'} target
	 * @param {number} i
	 */
	function removeFeature(target, i) {
		if (target === 'new') newProduct.features = newProduct.features.filter((_, j) => j !== i);
		else if (editData) editData.features = editData.features.filter((_, j) => j !== i);
	}
	/** @param {'new'|'edit'} target */
	function addCategory(target) {
		const num = String(
			(target === 'new' ? newProduct.categories.length : editData?.categories?.length || 0) + 1
		).padStart(2, '0');
		if (target === 'new')
			newProduct.categories = [...newProduct.categories, { num, name: '', desc: '' }];
		else if (editData) editData.categories = [...editData.categories, { num, name: '', desc: '' }];
	}
	/**
	 * @param {'new'|'edit'} target
	 * @param {number} i
	 */
	function removeCategory(target, i) {
		if (target === 'new') newProduct.categories = newProduct.categories.filter((_, j) => j !== i);
		else if (editData) editData.categories = editData.categories.filter((_, j) => j !== i);
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h3 class="text-2xl font-black text-slate-900">Productos</h3>
				<p class="mt-1 text-sm text-slate-500">Administra los productos de la sección principal.</p>
			</div>
			<div class="flex items-center gap-3">
				<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
					{products.length} producto{products.length !== 1 ? 's' : ''}
				</span>
				<button
					onclick={() => {
						showAddForm = !showAddForm;
						if (!showAddForm) resetNewProduct();
					}}
					class="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
				>
					<span class="material-icons text-sm">{showAddForm ? 'close' : 'add'}</span>
					{showAddForm ? 'Cancelar' : 'Nuevo Producto'}
				</button>
			</div>
		</div>

		<!-- Info cuando está vacío o hay resultado del formulario -->
		{#if formResult?.success}
			<div in:slide class="mb-6 rounded-2xl border border-green-100 bg-green-50/50 p-5">
				<div class="flex items-start gap-3">
					<span class="material-icons text-green-400">check_circle</span>
					<div class="text-sm text-green-700">
						<p class="font-bold">¡Operación exitosa!</p>
						<p class="mt-1 text-green-600">Los cambios se han guardado correctamente.</p>
					</div>
				</div>
			</div>
		{:else if formResult?.error}
			<div in:slide class="mb-6 rounded-2xl border border-red-100 bg-red-50/50 p-5">
				<div class="flex items-start gap-3">
					<span class="material-icons text-red-400">error</span>
					<div class="text-sm text-red-700">
						<p class="font-bold">Error en la operación</p>
						<p class="mt-1 text-red-600">{formResult.error}</p>
					</div>
				</div>
			</div>
		{:else if products.length === 0 && !showAddForm}
			<div class="mb-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
				<div class="flex items-start gap-3">
					<span class="material-icons text-blue-400">info</span>
					<div class="text-sm text-blue-700">
						<p class="font-bold">Sin productos configurados</p>
						<p class="mt-1 text-blue-600">
							Se mostrarán los productos por defecto (Arroz Premium y Abarrotes).
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- FORMULARIO AGREGAR -->
		{#if showAddForm}
			<div
				in:slide
				class="mb-8 rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6"
			>
				<h4 class="mb-1 text-sm font-bold text-primary">Nuevo Producto</h4>
				<p class="mb-5 text-xs text-slate-400">
					Configura el producto que aparecerá en la sección principal.
				</p>

				<form
					method="POST"
					action="?/addProduct"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							resetNewProduct();
							showAddForm = false;
							await update();
						};
					}}
					class="space-y-5"
				>
					<!-- Nombre y descripción -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Información
						</p>
						<div class="space-y-3">
							<div>
								<label for="newProdName" class="mb-1 block text-xs font-bold text-slate-600"
									>Nombre del producto *</label
								>
								<input
									type="text"
									id="newProdName"
									bind:value={newProduct.name}
									placeholder="Arroz Premium Salguero"
									class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm focus:ring-primary/20"
								/>
							</div>
							<div>
								<label for="newProdDesc" class="mb-1 block text-xs font-bold text-slate-600"
									>Descripción</label
								>
								<textarea
									id="newProdDesc"
									rows="2"
									bind:value={newProduct.description}
									maxlength="250"
									placeholder="Breve descripción del producto..."
									class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm focus:ring-primary/20"
								></textarea>
								<p class="mt-1 text-[10px] text-slate-400">{newProduct.description.length}/250</p>
							</div>
						</div>
					</div>

					<!-- Imágenes -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
							Imágenes del carrusel
						</p>
						<div class="flex flex-wrap gap-3">
							{#each newProduct.images as img, j (img)}
								<div class="group/img relative h-20 w-28 overflow-hidden rounded-xl">
									<img src={img} alt="Img {j + 1}" class="h-full w-full object-cover" />
									<button
										type="button"
										onclick={() => removeImage('new', j)}
										class="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover/img:opacity-100"
									>
										<span class="material-icons text-sm">close</span>
									</button>
								</div>
							{/each}
							<div
								class="flex h-20 w-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 transition-all hover:border-primary hover:bg-primary/5"
								onclick={() => document.getElementById('newProdImage')?.click()}
								onkeydown={() => {}}
								role="button"
								tabindex="0"
							>
								{#if isUploading}
									<div
										class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
									></div>
								{:else}
									<span class="material-icons text-xl text-slate-300">add_photo_alternate</span>
								{/if}
							</div>
						</div>
						<input
							type="file"
							id="newProdImage"
							accept="image/*"
							class="hidden"
							onchange={(e) => {
								const f = (/** @type {HTMLInputElement} */ (e.target)).files?.[0];
								if (f) uploadImage(f, 'new');
							}}
						/>
						{#if uploadError}<p class="mt-2 text-xs text-red-500">{uploadError}</p>{/if}
					</div>

					<!-- Configuración visual -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Diseño</p>
						<div class="grid gap-4 md:grid-cols-3">
							<div>
								<label for="newProdAlign" class="mb-1 block text-xs font-bold text-slate-600">Posición imagen</label>
								<div id="newProdAlign" class="flex gap-2">
									<button
										type="button"
										onclick={() => (newProduct.align = 'left')}
										class="flex flex-1 items-center justify-center gap-1 rounded-xl p-2 text-xs transition-all {newProduct.align ===
										'left'
											? 'bg-primary text-white'
											: 'border border-slate-200 text-slate-500'}"
									>
										<span class="material-icons text-sm">image</span> Izq
									</button>
									<button
										type="button"
										onclick={() => (newProduct.align = 'right')}
										class="flex flex-1 items-center justify-center gap-1 rounded-xl p-2 text-xs transition-all {newProduct.align ===
										'right'
											? 'bg-primary text-white'
											: 'border border-slate-200 text-slate-500'}"
									>
										Der <span class="material-icons text-sm">image</span>
									</button>
								</div>
							</div>
							<div>
								<label for="newProdAccent" class="mb-1 block text-xs font-bold text-slate-600">Color acento</label>
								<div id="newProdAccent" class="flex gap-2">
									<button
										type="button"
										onclick={() => (newProduct.accentColor = 'primary')}
										class="h-9 w-9 rounded-xl border-2 transition-all {newProduct.accentColor ===
										'primary'
											? 'scale-110 border-primary'
											: 'border-slate-200'}"
										style="background-color: #455dd9;"
										title="Azul"
									></button>
									<button
										type="button"
										onclick={() => (newProduct.accentColor = 'accent')}
										class="h-9 w-9 rounded-xl border-2 transition-all {newProduct.accentColor ===
										'accent'
											? 'scale-110 border-accent'
											: 'border-slate-200'}"
										style="background-color: #e4002b;"
										title="Rojo"
									></button>
								</div>
							</div>
							<div>
								<label for="newProdDisplay" class="mb-1 block text-xs font-bold text-slate-600">Tipo de detalle</label>
								<div id="newProdDisplay" class="flex gap-2">
									<button
										type="button"
										onclick={() => (newProduct.displayType = 'features')}
										class="flex-1 rounded-xl p-2 text-xs font-bold transition-all {newProduct.displayType ===
										'features'
											? 'bg-primary text-white'
											: 'border border-slate-200 text-slate-500'}"
									>
										Características
									</button>
									<button
										type="button"
										onclick={() => (newProduct.displayType = 'categories')}
										class="flex-1 rounded-xl p-2 text-xs font-bold transition-all {newProduct.displayType ===
										'categories'
											? 'bg-primary text-white'
											: 'border border-slate-200 text-slate-500'}"
									>
										Categorías
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Features o Categories según displayType -->
					<div class="rounded-2xl border border-slate-100 bg-white p-5">
						{#if newProduct.displayType === 'features'}
							<div class="mb-3 flex items-center justify-between">
								<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">
									Características
								</p>
								<button
									type="button"
									onclick={() => addFeature('new')}
									class="text-xs font-bold text-primary hover:underline">+ Agregar</button
								>
							</div>
							<div class="space-y-3">
								{#each newProduct.features as feat, j (j)}
									<div class="flex items-start gap-2">
										<div class="grid flex-1 gap-2 md:grid-cols-2">
											<input
												type="text"
												bind:value={feat.title}
												placeholder="Título"
												class="rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
											/>
											<input
												type="text"
												bind:value={feat.desc}
												placeholder="Descripción corta"
												class="rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
											/>
										</div>
										{#if newProduct.features.length > 1}
											<button
												type="button"
												onclick={() => removeFeature('new', j)}
												class="mt-1 text-slate-300 hover:text-red-400"
											>
												<span class="material-icons text-sm">close</span>
											</button>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div class="mb-3 flex items-center justify-between">
								<p class="text-xs font-bold tracking-wider text-slate-400 uppercase">Categorías</p>
								<button
									type="button"
									onclick={() => addCategory('new')}
									class="text-xs font-bold text-primary hover:underline">+ Agregar</button
								>
							</div>
							<div class="space-y-3">
								{#each newProduct.categories as cat, j (j)}
									<div class="flex items-start gap-2">
										<input
											type="text"
											bind:value={cat.num}
											class="w-14 rounded-lg border-slate-200 bg-soft-gray p-2 text-center text-sm font-bold"
										/>
										<div class="grid flex-1 gap-2 md:grid-cols-2">
											<input
												type="text"
												bind:value={cat.name}
												placeholder="Nombre"
												class="rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
											/>
											<input
												type="text"
												bind:value={cat.desc}
												placeholder="Descripción"
												class="rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
											/>
										</div>
										{#if newProduct.categories.length > 1}
											<button
												type="button"
												onclick={() => removeCategory('new', j)}
												class="mt-1 text-slate-300 hover:text-red-400"
											>
												<span class="material-icons text-sm">close</span>
											</button>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Hidden fields con JSON -->
					<input type="hidden" name="name" value={newProduct.name} />
					<input type="hidden" name="description" value={newProduct.description} />
					<input type="hidden" name="align" value={newProduct.align} />
					<input type="hidden" name="accentColor" value={newProduct.accentColor} />
					<input type="hidden" name="displayType" value={newProduct.displayType} />
					<input type="hidden" name="images" value={JSON.stringify(newProduct.images)} />
					<input
						type="hidden"
						name="features"
						value={JSON.stringify(newProduct.features.filter((f) => f.title))}
					/>
					<input
						type="hidden"
						name="categories"
						value={JSON.stringify(newProduct.categories.filter((c) => c.name))}
					/>

					<button
						type="submit"
						disabled={isSubmitting || !newProduct.name}
						class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
					>
						{isSubmitting ? 'Agregando...' : 'Agregar Producto'}
						<span class="material-icons text-sm">add</span>
					</button>
				</form>
			</div>
		{/if}

		<!-- Lista vacía -->
		{#if products.length === 0 && !showAddForm}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-4 rounded-3xl bg-slate-50 p-6">
					<span class="material-icons text-4xl text-slate-300">inventory_2</span>
				</div>
				<p class="text-sm font-bold text-slate-400">No hay productos configurados</p>
				<p class="mt-1 text-xs text-slate-300">Se mostrarán los productos por defecto.</p>
			</div>
		{:else}
			<!-- Lista de productos -->
			<div class="space-y-4">
				{#each products as p, i (p.id)}
					<div
						in:slide
						class="group overflow-hidden rounded-2xl border border-slate-50 bg-soft-gray transition-all hover:shadow-lg"
					>
						<div class="flex items-center gap-4 p-4">
							<!-- Thumbnail -->
							{#if p.images?.length}
								<div class="h-16 w-24 shrink-0 overflow-hidden rounded-xl">
									<img src={p.images[0]} alt={p.name} class="h-full w-full object-cover" />
								</div>
							{:else}
								<div
									class="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100"
								>
									<span class="material-icons text-2xl text-slate-300">image</span>
								</div>
							{/if}

							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<p class="truncate text-sm font-bold text-slate-800">{p.name}</p>
									<span
										class="rounded-full px-2 py-0.5 text-[10px] font-bold {p.accentColor ===
										'primary'
											? 'bg-primary/10 text-primary'
											: 'bg-accent/10 text-accent'}"
									>
										{p.displayType === 'features' ? 'Características' : 'Categorías'}
									</span>
								</div>
								{#if p.description}
									<p class="mt-0.5 truncate text-xs text-slate-400">{p.description}</p>
								{/if}
								<p class="mt-0.5 text-[10px] text-slate-300">
									{p.images?.length || 0} imágenes · {p.align === 'left'
										? 'Imagen izq'
										: 'Imagen der'}
								</p>
							</div>

							<span class="text-xs font-bold text-slate-300">#{i + 1}</span>

							<div
								class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<button
									onclick={() => startEdit(p)}
									class="rounded-xl p-2 text-slate-400 transition-all hover:bg-primary/10 hover:text-primary"
									title="Editar"
								>
									<span class="material-icons text-lg">edit</span>
								</button>
								<form
									method="POST"
									action="?/deleteProduct"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
										};
									}}
								>
									<input type="hidden" name="productId" value={p.id} />
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

						<!-- Edición expandible -->
						{#if editingId === p.id && editData}
							<div in:slide class="border-t border-slate-100 bg-white p-5">
								<form
									method="POST"
									action="?/updateProduct"
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											isSubmitting = false;
											editingId = null;
											editData = null;
											await update();
										};
									}}
									class="space-y-4"
								>
									<input type="hidden" name="productId" value={p.id} />

									<div class="grid gap-3 md:grid-cols-2">
										<div>
											<label for="editProdName_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Nombre</label>
											<input
												type="text"
												id="editProdName_{p.id}"
												bind:value={editData.name}
												class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm"
											/>
										</div>
										<div>
											<label for="editProdDesc_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Descripción</label>
											<input
												type="text"
												id="editProdDesc_{p.id}"
												bind:value={editData.description}
												class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm"
											/>
										</div>
									</div>

									<!-- Imágenes -->
									<div>
										<label for="editProdImages_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Imágenes</label>
										<div id="editProdImages_{p.id}" class="flex flex-wrap gap-2">
											{#each editData.images as img, j (img)}
												<div class="group/img relative h-16 w-24 overflow-hidden rounded-lg">
													<img src={img} alt="Img" class="h-full w-full object-cover" />
													<button
														type="button"
														onclick={() => removeImage('edit', j)}
														class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/img:opacity-100"
													>
														<span class="material-icons text-sm text-white">close</span>
													</button>
												</div>
											{/each}
											<div
												class="flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-200 hover:border-primary"
												onclick={() => document.getElementById(`editProdImage_${p.id}`)?.click()}
												onkeydown={() => {}}
												role="button"
												tabindex="0"
											>
												<span class="material-icons text-slate-300">add</span>
											</div>
										</div>
										<input
											type="file"
											id="editProdImage_{p.id}"
											accept="image/*"
											class="hidden"
											onchange={(e) => {
												const f = (/** @type {HTMLInputElement} */ (e.target)).files?.[0];
												if (f) uploadImage(f, 'edit');
											}}
										/>
									</div>

									<!-- Config -->
									<div class="grid gap-3 md:grid-cols-3">
										<div>
											<label for="editProdAlign_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Posición</label>
											<select
												id="editProdAlign_{p.id}"
												bind:value={editData.align}
												class="w-full rounded-xl border-slate-200 bg-soft-gray p-2 text-sm"
											>
												<option value="left">Imagen izquierda</option>
												<option value="right">Imagen derecha</option>
											</select>
										</div>
										<div>
											<label for="editProdAccent_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Color</label>
											<select
												id="editProdAccent_{p.id}"
												bind:value={editData.accentColor}
												class="w-full rounded-xl border-slate-200 bg-soft-gray p-2 text-sm"
											>
												<option value="primary">Azul</option>
												<option value="accent">Rojo</option>
											</select>
										</div>
										<div>
											<label for="editProdType_{p.id}" class="mb-1 block text-xs font-bold text-slate-600">Tipo</label>
											<select
												id="editProdType_{p.id}"
												bind:value={editData.displayType}
												class="w-full rounded-xl border-slate-200 bg-soft-gray p-2 text-sm"
											>
												<option value="features">Características</option>
												<option value="categories">Categorías</option>
											</select>
										</div>
									</div>

									<!-- Features/Categories editor -->
									{#if editData.displayType === 'features'}
										<div>
											<div class="mb-2 flex items-center justify-between">
												<label for="editProdFeatures_{p.id}" class="text-xs font-bold text-slate-600">Características</label>
												<button
													type="button"
													onclick={() => addFeature('edit')}
													class="text-xs font-bold text-primary hover:underline">+ Agregar</button
												>
											</div>
											<div id="editProdFeatures_{p.id}">
												{#each editData.features as feat, j (j)}
													<div class="mb-2 flex items-center gap-2">
														<input
															type="text"
															bind:value={feat.title}
															placeholder="Título"
															class="flex-1 rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
														/>
														<input
															type="text"
															bind:value={feat.desc}
															placeholder="Descripción"
															class="flex-1 rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
														/>
														{#if editData.features.length > 1}
															<button
																type="button"
																onclick={() => removeFeature('edit', j)}
																class="text-slate-300 hover:text-red-400"
															>
																<span class="material-icons text-sm">close</span>
															</button>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{:else}
										<div>
											<div class="mb-2 flex items-center justify-between">
												<label for="editProdCategories_{p.id}" class="text-xs font-bold text-slate-600">Categorías</label>
												<button
													type="button"
													onclick={() => addCategory('edit')}
													class="text-xs font-bold text-primary hover:underline">+ Agregar</button
												>
											</div>
											<div id="editProdCategories_{p.id}">
												{#each editData.categories as cat, j (j)}
													<div class="mb-2 flex items-center gap-2">
														<input
															type="text"
															bind:value={cat.num}
															class="w-12 rounded-lg border-slate-200 bg-soft-gray p-2 text-center text-sm font-bold"
														/>
														<input
															type="text"
															bind:value={cat.name}
															placeholder="Nombre"
															class="flex-1 rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
														/>
														<input
															type="text"
															bind:value={cat.desc}
															placeholder="Descripción"
															class="flex-1 rounded-lg border-slate-200 bg-soft-gray p-2 text-sm"
														/>
														{#if editData.categories.length > 1}
															<button
																type="button"
																onclick={() => removeCategory('edit', j)}
																class="text-slate-300 hover:text-red-400"
															>
																<span class="material-icons text-sm">close</span>
															</button>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Hidden JSON -->
									<input type="hidden" name="name" value={editData.name} />
									<input type="hidden" name="description" value={editData.description} />
									<input type="hidden" name="align" value={editData.align} />
									<input type="hidden" name="accentColor" value={editData.accentColor} />
									<input type="hidden" name="displayType" value={editData.displayType} />
									<input type="hidden" name="images" value={JSON.stringify(editData.images)} />
									<input
										type="hidden"
										name="features"
										value={JSON.stringify(editData.features.filter((f) => f.title))}
									/>
									<input
										type="hidden"
										name="categories"
										value={JSON.stringify(editData.categories.filter((c) => c.name))}
									/>

									<div class="flex justify-end gap-3">
										<button
											type="button"
											onclick={() => {
												editingId = null;
												editData = null;
											}}
											class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50"
											>Cancelar</button
										>
										<button
											type="submit"
											disabled={isSubmitting}
											class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
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
