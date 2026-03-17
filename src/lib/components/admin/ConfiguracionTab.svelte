<script>
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { Upload, CheckCircle2, AlertCircle } from 'lucide-svelte';
	import defaultLogo from '$lib/assets/images/provesa-logo.png';

	let { siteConfig = {}, formResult = null } = $props();

	let isUploading = $state(false);
	let previewUrl = $state('');
	let fileName = $state('');

	let isUpdatingCredentials = $state(false);

	let currentLogo = $derived(siteConfig.logoUrl || defaultLogo);
	let isUsingDefaultLogo = $derived(!siteConfig.logoUrl);

	/** @param {Event} e */
	function handleFileChange(e) {
		const file = /** @type {HTMLInputElement} */ (e.target)?.files?.[0];
		if (file) {
			fileName = file.name;
			previewUrl = URL.createObjectURL(file);
		} else {
			fileName = '';
			previewUrl = '';
		}
	}
</script>

<div in:fade={{ duration: 200 }} class="space-y-8">
	<!-- Logo -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8">
			<h3 class="text-2xl font-black text-slate-900">Logo del Sitio</h3>
			<p class="mt-1 text-sm text-slate-500">
				Sube o cambia el logo que aparece en el navbar y footer de la página.
			</p>
		</div>

		{#if formResult?.logoUpdated}
			<div
				class="mb-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-600"
			>
				<CheckCircle2 size={16} />
				Logo actualizado correctamente.
			</div>
		{/if}

		{#if formResult?.error && !formResult?.logoUpdated}
			<div
				class="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600"
			>
				<AlertCircle size={16} />
				{formResult.error}
			</div>
		{/if}

		<div class="grid gap-8 md:grid-cols-2">
			<!-- Logo actual -->
			<div>
				<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Logo Actual</p>
				<div
					class="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-all hover:bg-white"
				>
					<div class="relative flex h-full w-full items-center justify-center">
						<img src={currentLogo} alt="Logo actual" class="max-h-full max-w-full object-contain" />
						
						{#if isUsingDefaultLogo}
							<div class="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/5 backdrop-blur-[1px]">
								<span class="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm">
									PREDETERMINADO
								</span>
							</div>
						{/if}
					</div>
				</div>
				
				{#if isUsingDefaultLogo}
					<p class="mt-3 text-[10px] font-bold text-slate-400 italic">
						* Se está visualizando el archivo estático del proyecto. Sube uno nuevo para personalizarlo.
					</p>
				{/if}
			</div>

			<!-- Subir nuevo -->
			<div>
				<p class="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">Nuevo Logo</p>
				<form
					method="POST"
					action="?/updateLogo"
					enctype="multipart/form-data"
					use:enhance={() => {
						isUploading = true;
						return async ({ update }) => {
							isUploading = false;
							previewUrl = '';
							fileName = '';
							await update();
						};
					}}
				>
					<label
						for="logo-upload"
						class="flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-all hover:border-primary hover:bg-primary/5"
					>
						{#if previewUrl}
							<img src={previewUrl} alt="Preview" class="max-h-28 max-w-full object-contain" />
							<p class="mt-2 text-xs font-bold text-slate-600">{fileName}</p>
						{:else}
							<Upload size={32} class="mb-2 text-slate-300" />
							<p class="text-sm font-bold text-slate-500">Haz clic para seleccionar</p>
							<p class="text-xs text-slate-400">PNG, JPG, WebP, SVG · Máx 2MB</p>
						{/if}
					</label>
					<input
						id="logo-upload"
						name="logo"
						type="file"
						accept="image/png,image/jpeg,image/webp,image/svg+xml"
						class="sr-only"
						onchange={handleFileChange}
					/>

					{#if previewUrl}
						<button
							type="submit"
							disabled={isUploading}
							class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40"
						>
							{#if isUploading}
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Subiendo...
							{:else}
								<Upload size={16} />
								Guardar Logo
							{/if}
						</button>
					{/if}
				</form>
			</div>
		</div>
	</div>

	<!-- Credenciales -->
	<div
		class="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md"
	>
		<div class="mb-8">
			<h3 class="text-2xl font-black text-slate-900">Credenciales de Acceso</h3>
			<p class="mt-1 text-sm text-slate-500">
				Modifica tu correo electrónico de administrador o tu contraseña.
			</p>
		</div>

		{#if formResult?.credentialsUpdated}
			<div
				class="mb-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-600"
			>
				<CheckCircle2 size={16} />
				Credenciales actualizadas correctamente.
			</div>
		{/if}

		{#if formResult?.error && !formResult?.credentialsUpdated && !formResult?.logoUpdated}
			<div
				class="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600"
			>
				<AlertCircle size={16} />
				{formResult.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateCredentials"
			class="space-y-6"
			use:enhance={() => {
				isUpdatingCredentials = true;
				return async ({ update }) => {
					isUpdatingCredentials = false;
					await update();
				};
			}}
		>
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Nuevo Correo -->
				<div>
					<label for="new-email" class="mb-1 block text-xs font-bold text-slate-600">Nuevo Correo Electrónico (Opcional)</label>
					<input
						type="email"
						id="new-email"
						name="newEmail"
						placeholder="ejemplo@provesa.com"
						class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm focus:ring-primary/20"
					/>
				</div>

				<!-- Nueva Contraseña -->
				<div>
					<label for="new-password" class="mb-1 block text-xs font-bold text-slate-600">Nueva Contraseña (Opcional)</label>
					<input
						type="password"
						id="new-password"
						name="newPassword"
						placeholder="Mínimo 8 caracteres"
						class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm focus:ring-primary/20"
					/>
				</div>
			</div>

			<div class="max-w-md">
				<!-- Contraseña Actual (Requerida) -->
				<label for="current-password" class="mb-1 block text-xs font-bold text-slate-600">Contraseña Actual <span class="text-red-500">*</span></label>
				<p class="mb-3 text-[10px] text-slate-400">Requerida para autorizar cambios.</p>
				<input
					type="password"
					id="current-password"
					name="currentPassword"
					required
					placeholder="Confirmar contraseña actual"
					class="w-full rounded-xl border-slate-200 bg-soft-gray p-3 text-sm focus:ring-primary/20"
				/>
			</div>

			<button
				type="submit"
				disabled={isUpdatingCredentials}
				class="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
			>
				{#if isUpdatingCredentials}
					<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
					Guardando...
				{:else}
					Guardar Cambios
					<span class="material-icons text-sm">save</span>
				{/if}
			</button>
		</form>
	</div>
</div>
