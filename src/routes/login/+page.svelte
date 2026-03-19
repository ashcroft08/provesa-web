<script>
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/images/provesa-logo.png';
	import { ArrowLeft, Mail, Lock, LogIn } from 'lucide-svelte';
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';

	let { form } = $props();
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let visibleError = $state(null);

	// Sincronizar error del formulario con el estado local y ocultarlo después de 5 segundos
	$effect(() => {
		if (form?.error) {
			visibleError = form.error;
			const timer = setTimeout(() => {
				visibleError = null;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<Seo title="Acceso Administrativo" noindex={true} />

<div
	class="bg-mesh relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4 antialiased sm:p-6"
>
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

				<h1 class="text-2xl font-bold tracking-tight text-slate-900">Iniciar Sesión</h1>
				<p class="mt-2 text-sm text-slate-500">Ingrese sus credenciales para continuar</p>
			</div>

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
				{#if visibleError}
					<div
						class="animate-in fade-in slide-in-from-top-2 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center ring-1 ring-accent/10 duration-300"
					>
						<p class="text-sm font-bold text-accent">Error de Acceso</p>
						<p class="mt-0.5 text-xs font-medium text-accent/80">{visibleError}</p>
					</div>
				{/if}

				<div>
					<label for="email" class="mb-1.5 ml-1 block text-sm font-semibold text-slate-700"
						>Correo electrónico</label
					>
					<div class="group relative">
						<Mail
							size={18}
							class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
						/>
						<input
							type="email"
							name="email"
							id="email"
							bind:value={email}
							placeholder="admin@provesa.com"
							required
							class="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-4 pl-11 text-sm transition-all outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="mb-1.5 ml-1 block text-sm font-semibold text-slate-700"
						>Contraseña</label
					>
					<div class="group relative">
						<Lock
							size={18}
							class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
						/>
						<input
							type="password"
							name="password"
							id="password"
							bind:value={password}
							placeholder="••••••••"
							required
							class="w-full rounded-xl border border-slate-200 bg-white/60 py-3 pr-4 pl-11 text-sm transition-all outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
						/>
					</div>
				</div>

				<div class="text-right">
					<button
						onclick={() => window.location.assign(`${base}/recuperar`)}
						class="text-xs font-semibold text-primary/70 transition-colors hover:text-primary"
					>
						¿Olvidaste tu contraseña?
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25 hover:brightness-90 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
				>
					{loading ? 'Accediendo...' : 'Acceder al Panel'}
					{#if !loading}
						<LogIn size={18} />
					{/if}
				</button>

				<div class="mt-4 text-center">
					<button
						onclick={() => window.location.assign(`${base}/`)}
						class="group inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-primary"
					>
						<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
						<span class="text-xs font-bold">Volver al sitio principal</span>
					</button>
				</div>
			</form>
		</div>
		<!-- Footer sutil -->
		<p class="mt-8 text-center text-[10px] font-medium text-slate-400">
			&copy; 2026 Provesa SCC. Todos los derechos reservados.<br />
			Acceso restringido para personal autorizado.
		</p>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Work Sans', sans-serif;
	}

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
