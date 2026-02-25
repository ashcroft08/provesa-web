<script>
	import { enhance } from '$app/forms';
	import logo from '$lib/assets/images/provesa-logo.png';
	import { ArrowLeft, Mail, Send } from 'lucide-svelte';

	// Svelte 5: Usamos descargas de props sutiles
	let { form } = $props();

	// Svelte 5: Declaramos estados reactivos con $state()
	let email = $state('');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Recuperar Contraseña - PROVESA SCC</title>
</svelte:head>

<div
	class="bg-mesh relative flex h-screen w-full items-center justify-center overflow-hidden p-6 antialiased"
>
	<!-- Elementos decorativos de fondo -->
	<div class="fixed top-20 -left-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
	<div class="fixed -right-20 bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>

	<div class="relative z-10 w-full max-w-md text-center">
		<!-- Tarjeta de Recuperación -->
		<div class="glass-card rounded-[40px] p-8 text-left md:p-10">
			<div class="mb-8 text-center">
				<img src={logo} alt="Provesa" class="mx-auto mb-6 h-12 w-auto object-contain" />

				<h1 class="text-2xl font-bold tracking-tight text-slate-900">¿Olvidaste tu contraseña?</h1>
				<p class="mt-2 text-sm text-slate-500">
					No te preocupes, dinos tu correo y te enviaremos instrucciones.
				</p>
			</div>

			{#if form?.success}
				<!-- Estado de Éxito -->
				<div class="rounded-2xl bg-blue-50 p-6 text-center shadow-sm">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600"
					>
						<Mail size={24} />
					</div>
					<h2 class="text-lg font-bold text-blue-900">¡Correo enviado!</h2>
					<p class="mt-2 text-sm text-blue-700">
						Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un enlace de
						recuperación pronto.
					</p>
					<a
						href="/login"
						class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
					>
						<ArrowLeft size={16} /> Volver al login
					</a>
				</div>
			{:else}
				<!-- Formulario -->
				<form
					method="POST"
					use:enhance={() => {
						loading = true; // Svelte 5: Modificamos el estado directamente
						return async ({ update }) => {
							loading = false;
							await update(); // SvelteKit: Actualiza la prop 'form' con el resultado
						};
					}}
					class="space-y-6"
				>
					<div>
						<label for="email" class="mb-1.5 ml-1 block text-sm font-bold text-slate-700"
							>Tu correo electrónico</label
						>
						<div class="relative">
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

					{#if form?.error}
						<div class="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
							<p class="text-sm font-bold text-accent">Error</p>
							<p class="mt-0.5 text-xs text-accent/80">{form.error}</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/25 hover:brightness-90 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
					>
						{loading ? 'Enviando...' : 'Enviar instrucciones'}
						{#if !loading}
							<Send size={18} />
						{/if}
					</button>

					<div class="mt-4 text-center">
						<a
							href="/login"
							class="group inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-primary"
						>
							<ArrowLeft size={14} class="transition-transform group-hover:-translate-x-1" />
							<span class="text-xs font-bold">Volver al login</span>
						</a>
					</div>
				</form>
			{/if}
		</div>

		<!-- Footer sutil -->
		<p class="mt-8 text-[10px] font-medium text-slate-400">
			&copy; 2026 Provesa SCC. Todos los derechos reservados.<br />
			Acceso restringido para personal autorizado.
		</p>
	</div>
</div>

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 1);
		box-shadow: 0 8px 32px 0 rgba(0, 82, 165, 0.05);
	}

	.bg-mesh {
		background-color: var(--color-background);
		background-image:
			radial-gradient(at 0% 0%, hsla(210, 100%, 94%, 0.7) 0, transparent 50%),
			radial-gradient(at 50% 0%, hsla(208, 100%, 92%, 0.7) 0, transparent 50%),
			radial-gradient(at 100% 0%, hsla(210, 100%, 94%, 0.7) 0, transparent 50%);
	}

	.input-focus {
		transition: all 0.3s ease;
	}

	.input-focus:focus {
		transform: translateY(-1px);
		box-shadow: 0 10px 20px -5px rgba(0, 82, 165, 0.1);
	}
</style>
