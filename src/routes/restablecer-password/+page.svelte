<script>
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/images/provesa-logo.png';
	import { ArrowLeft, Lock, Save, CheckCircle, Eye, EyeOff } from 'lucide-svelte';
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';

	let { form } = $props();
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

	// Lógica para medir la fuerza de la contraseña (Svelte 5 $derived)
	let strength = $derived.by(() => {
		if (!password) return 0;
		let score = 0;
		if (password.length >= 8) score += 25;
		if (/[A-Z]/.test(password)) score += 25;
		if (/[0-9]/.test(password)) score += 25;
		if (/[^A-Za-z0-9]/.test(password)) score += 25;
		return score;
	});

	let strengthLabel = $derived.by(() => {
		if (strength === 0) return '';
		if (strength <= 25) return 'Muy débil';
		if (strength <= 50) return 'Débil';
		if (strength <= 75) return 'Media';
		return 'Fuerte';
	});

	let strengthColor = $derived.by(() => {
		if (strength <= 25) return 'bg-red-500';
		if (strength <= 50) return 'bg-orange-500';
		if (strength <= 75) return 'bg-yellow-500';
		return 'bg-green-500';
	});

	// Requisitos individuales para el checklist
	let hasMinLength = $derived(password.length >= 8);
	let hasUppercase = $derived(/[A-Z]/.test(password));
	let hasNumber = $derived(/[0-9]/.test(password));
	let hasSpecial = $derived(/[^A-Za-z0-9]/.test(password));

	let isAllValid = $derived(hasMinLength && hasUppercase && hasNumber && hasSpecial);
</script>

<Seo title="Nueva Contraseña" noindex={true} />

<div
	class="bg-mesh relative flex h-screen w-full items-center justify-center overflow-hidden p-4 antialiased sm:p-6"
>
	<!-- Elementos decorativos -->
	<div
		class="pointer-events-none fixed top-0 -left-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]"
	></div>
	<div
		class="pointer-events-none fixed -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[100px]"
	></div>

	<div class="relative z-10 w-full max-w-[420px]">
		<div class="glass-card rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
			<div class="mb-8 text-center">
				<img src={logo} alt="Provesa" class="mx-auto mb-6 h-12 w-auto object-contain" />
				<h1 class="text-2xl font-bold tracking-tight text-slate-900">Nueva Contraseña</h1>
				<p class="mt-2 text-sm text-slate-500">
					Crea una contraseña segura para tu cuenta administrativa.
				</p>
			</div>

			{#if form?.success}
				<!-- Estado de Éxito -->
				<div class="rounded-2xl bg-green-50 p-6 text-center shadow-sm">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600"
					>
						<CheckCircle size={24} />
					</div>
					<h2 class="text-lg font-bold text-green-900">¡Contraseña Cambiada!</h2>
					<p class="mt-2 text-sm text-green-700">
						Tu contraseña ha sido actualizada correctamente. Ya puedes acceder al panel.
					</p>
					<button
						onclick={() => window.location.assign(`${base}/login`)}
						class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:brightness-90"
					>
						Ir al Login
					</button>
				</div>
			{:else}
				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="space-y-5"
				>
					<div>
						<label for="password" class="mb-1.5 ml-1 block text-sm font-semibold text-slate-700"
							>Nueva Contraseña</label
						>
						<div class="group relative">
							<Lock
								size={18}
								class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
							/>
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								id="password"
								bind:value={password}
								placeholder="••••••••"
								required
								class="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-12 pl-11 text-sm transition-all outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
							>
								{#if showPassword}
									<EyeOff size={18} />
								{:else}
									<Eye size={18} />
								{/if}
							</button>
						</div>

						<!-- Requisitos y Fuerza -->
						{#if password}
							<div class="mt-4 space-y-3 px-1">
								<!-- Barra de Fuerza -->
								<div class="space-y-1">
									<div
										class="flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase"
									>
										<span>Fuerza: {strengthLabel}</span>
										<span>{strength}%</span>
									</div>
									<div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											class="h-full transition-all duration-500 {strengthColor}"
											style="width: {strength}%"
										></div>
									</div>
								</div>

								<!-- Checklist de Requisitos -->
								<div class="grid grid-cols-2 gap-2 text-[10px] font-semibold">
									<div
										class="flex items-center gap-1.5 {hasMinLength
											? 'text-green-600'
											: 'text-slate-400'}"
									>
										<div
											class="h-1 w-1 rounded-full {hasMinLength ? 'bg-green-600' : 'bg-slate-300'}"
										></div>
										8+ caracteres
									</div>
									<div
										class="flex items-center gap-1.5 {hasUppercase
											? 'text-green-600'
											: 'text-slate-400'}"
									>
										<div
											class="h-1 w-1 rounded-full {hasUppercase ? 'bg-green-600' : 'bg-slate-300'}"
										></div>
										Una mayúscula
									</div>
									<div
										class="flex items-center gap-1.5 {hasNumber
											? 'text-green-600'
											: 'text-slate-400'}"
									>
										<div
											class="h-1 w-1 rounded-full {hasNumber ? 'bg-green-600' : 'bg-slate-300'}"
										></div>
										Un número
									</div>
									<div
										class="flex items-center gap-1.5 {hasSpecial
											? 'text-green-600'
											: 'text-slate-400'}"
									>
										<div
											class="h-1 w-1 rounded-full {hasSpecial ? 'bg-green-600' : 'bg-slate-300'}"
										></div>
										Un símbolo
									</div>
								</div>
							</div>
						{/if}
					</div>

					<div>
						<label
							for="confirmPassword"
							class="mb-1.5 ml-1 block text-sm font-semibold text-slate-700"
							>Confirmar Contraseña</label
						>
						<div class="group relative">
							<Lock
								size={18}
								class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
							/>
							<input
								type={showPassword ? 'text' : 'password'}
								name="confirmPassword"
								id="confirmPassword"
								bind:value={confirmPassword}
								placeholder="••••••••"
								required
								class="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-4 pl-11 text-sm transition-all outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
							/>
						</div>
					</div>

					{#if form?.error}
						<div class="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
							<p class="text-sm font-bold text-accent">Error</p>
							<p class="mt-0.5 text-xs text-accent/80">{form.error}</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading || !isAllValid}
						class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25 hover:brightness-90 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
					>
						{loading ? 'Guardando...' : 'Restablecer Contraseña'}
						{#if !loading}
							<Save size={18} />
						{/if}
					</button>

					<div class="mt-4 text-center">
						<button
							onclick={() => window.location.assign(`${base}/login`)}
							class="group inline-flex items-center gap-1.5 text-slate-400 transition-colors hover:text-primary"
						>
							<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
							<span class="text-xs font-semibold">Cancelar y volver</span>
						</button>
					</div>
				</form>
			{/if}
		</div>
		<p class="mt-8 text-center text-[10px] font-medium text-slate-400">
			&copy; 2026 Provesa SCC. Acceso administrativo.
		</p>
	</div>
</div>

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 1);
	}

	.bg-mesh {
		background-color: var(--color-background);
		background-image:
			radial-gradient(at 0% 0%, hsla(210, 100%, 94%, 0.7) 0, transparent 50%),
			radial-gradient(at 50% 0%, hsla(208, 100%, 92%, 0.7) 0, transparent 50%),
			radial-gradient(at 100% 0%, hsla(210, 100%, 94%, 0.7) 0, transparent 50%);
	}
</style>
