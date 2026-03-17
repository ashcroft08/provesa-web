<script>
	import { enhance } from '$app/forms';
	import {
		CheckCircle2,
		AlertCircle,
		FileText,
		CloudUpload,
		Send,
		Briefcase,
		MapPin
	} from 'lucide-svelte';
	import { base } from '$app/paths';

	let { data, form } = $props();
	let isSubmitting = $state(false);
	let fileName = $state('');

	/** @param {Event} e */
	function handleFileChange(e) {
		const file = /** @type {HTMLInputElement} */ (e.target)?.files?.[0];
		fileName = file ? file.name : '';
	}
</script>

<svelte:head>
	<title>Trabaja con Nosotros - PROVESA SCC</title>
</svelte:head>

<!-- HERO -->
<header class="relative overflow-hidden bg-primary pt-36 pb-20">
	<div
		class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
	></div>
	<div class="bg-accent-yellow/20 absolute -top-20 -right-20 h-96 w-96 rounded-full blur-3xl"></div>
	<div
		class="bg-accent-yellow/10 absolute -bottom-10 -left-10 h-64 w-64 rounded-full blur-2xl"
	></div>

	<div class="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
		<span
			class="text-accent-yellow mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
		>
			<Briefcase size={14} />
			Únete al equipo
		</span>
		<h1 class="mt-4 text-4xl font-extrabold md:text-6xl">Trabaja con Nosotros</h1>
		<p class="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-blue-100 md:text-xl">
			¿Buscas oportunidades? Déjanos tus datos y te contactaremos cuando tengamos vacantes
			disponibles en nuestras sucursales.
		</p>
	</div>

	<!-- Wave decoration -->
	<div class="absolute bottom-0 left-0 w-full">
		<svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
			<path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="#F8FAFC" />
		</svg>
	</div>
</header>

<!-- FORMULARIO -->
<section class="bg-soft-gray -mt-1 pb-24">
	<div class="mx-auto max-w-4xl px-6">
		<div class="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl md:p-12">
			<!-- Yellow accent bar -->
			<div class="bg-accent-yellow mb-8 h-1 w-16 rounded-full"></div>

			{#if form?.success}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
						<CheckCircle2 size={40} class="text-green-600" />
					</div>
					<h3 class="text-2xl font-extrabold text-slate-900">¡Postulación Enviada!</h3>
					<p class="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
						Gracias por tu interés en formar parte del equipo PROVESA. Hemos recibido tu información
						y te contactaremos cuando tengamos vacantes disponibles.
					</p>
					<button
						onclick={() => window.location.assign(`${base}/empleo`)}
						class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-blue-800"
					>
						<Send size={16} />
						Enviar otra postulación
					</button>
				</div>
			{:else}
				<h2 class="text-2xl font-extrabold text-slate-900">Formulario de Postulación</h2>
				<p class="mt-1 mb-8 text-sm text-slate-500">
					Los campos marcados con <span class="text-accent-red font-bold">*</span> son obligatorios.
				</p>

				{#if form?.error}
					<div
						class="mb-6 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600"
					>
						<AlertCircle size={16} />
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					enctype="multipart/form-data"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<div class="grid gap-6 md:grid-cols-2">
						<div>
							<label for="empleo-nombre" class="mb-2 block text-sm font-bold text-slate-700"
								>Nombre Completo <span class="text-accent-red">*</span></label
							>
							<input
								type="text"
								id="empleo-nombre"
								name="nombre"
								required
								value={form && 'nombre' in form ? form.nombre : ''}
								class="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm transition-colors focus:border-primary focus:bg-white focus:ring-primary/20"
								placeholder="Tu nombre completo"
							/>
						</div>
						<div>
							<label for="empleo-telefono" class="mb-2 block text-sm font-bold text-slate-700"
								>Teléfono <span class="text-accent-red">*</span></label
							>
							<input
								type="tel"
								id="empleo-telefono"
								name="telefono"
								required
								value={form && 'telefono' in form ? form.telefono : ''}
								class="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm transition-colors focus:border-primary focus:bg-white focus:ring-primary/20"
								placeholder="099..."
							/>
						</div>
					</div>

					<div>
						<label for="empleo-email" class="mb-2 block text-sm font-bold text-slate-700"
							>Correo Electrónico <span class="text-accent-red">*</span></label
						>
						<input
							type="email"
							id="empleo-email"
							name="email"
							required
							value={form && 'email' in form ? form.email : ''}
							class="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm transition-colors focus:border-primary focus:bg-white focus:ring-primary/20"
							placeholder="ejemplo@correo.com"
						/>
					</div>

					<div>
						<label
							for="empleo-sucursal"
							class="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700"
						>
							<MapPin size={14} class="text-primary" />
							Sucursal <span class="text-accent-red">*</span>
						</label>
						<select
							id="empleo-sucursal"
							name="sucursal"
							required
							class="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm transition-colors focus:border-primary focus:bg-white focus:ring-primary/20"
						>
							<option value="" disabled selected>Selecciona una sucursal</option>
							{#each data.sucursales || [] as suc (suc.id || suc.nombre)}
								<option
									value={suc.nombre}
									selected={form && 'sucursal' in form ? form.sucursal === suc.nombre : false}
									>{suc.nombre}</option
								>
							{/each}
						</select>
					</div>

					<div>
						<label for="empleo-cv" class="mb-2 block text-sm font-bold text-slate-700"
							>Hoja de Vida</label
						>
						<label
							for="empleo-cv"
							class="mt-1 flex cursor-pointer justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 pt-6 pb-7 transition-all hover:border-primary hover:bg-primary/5"
						>
							<div class="flex flex-col items-center gap-2 text-center">
								{#if fileName}
									<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
										<FileText size={24} class="text-green-600" />
									</div>
									<p class="text-sm font-bold text-slate-700">{fileName}</p>
									<p class="text-xs text-slate-500">Haz clic para cambiar el archivo</p>
								{:else}
									<div
										class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
									>
										<CloudUpload size={24} class="text-primary" />
									</div>
									<p class="text-sm font-bold text-slate-700">Sube tu hoja de vida</p>
									<p class="text-xs text-slate-400">PDF, JPG, PNG · Máx 5MB</p>
								{/if}
							</div>
							<input
								id="empleo-cv"
								name="cv"
								type="file"
								accept=".pdf,image/*"
								class="sr-only"
								onchange={handleFileChange}
							/>
						</label>
					</div>

					<div>
						<label for="empleo-mensaje" class="mb-2 block text-sm font-bold text-slate-700"
							>Mensaje (Opcional)</label
						>
						<textarea
							id="empleo-mensaje"
							name="mensaje"
							class="w-full rounded-xl border-slate-200 bg-slate-50 p-3 text-sm transition-colors focus:border-primary focus:bg-white focus:ring-primary/20"
							rows="3"
							placeholder="Cuéntanos sobre tu experiencia..."
							>{form && 'mensaje' in form ? form.mensaje : ''}</textarea
						>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:bg-blue-800 active:scale-[0.98] disabled:opacity-50"
					>
						{#if isSubmitting}
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							Enviando...
						{:else}
							<Send size={18} />
							Enviar Postulación
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>
