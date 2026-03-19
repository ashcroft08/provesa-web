<script>
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import ProductSection from '$lib/components/ProductSection.svelte';
	import NosotrosTeaser from '$lib/components/NosotrosTeaser.svelte';
	import SugerenciasForm from '$lib/components/SugerenciasForm.svelte';
	import RedesSociales from '$lib/components/RedesSociales.svelte';
	import Seo from '$lib/components/Seo.svelte';

	/** @type {{ data: { slides: any[], products: any[], nosotros: any, sugOptions: string[], footer: any } }} */
	let { data } = $props();
</script>

<Seo 
	title="Distribuidor Mayorista en La Concordia" 
	description="PROVESA SCC es el aliado estratégico para su negocio en La Concordia. Distribución mayorista de arroz, abarrotes y productos de consumo masivo con más de 18 años de trayectoria."
/>

<HeroSlider slides={data.slides} />
<ProductSection dbProducts={data.products} />
<NosotrosTeaser config={data.nosotros} />
<SugerenciasForm tipos={data.sugOptions} />
<RedesSociales footer={data.footer} />
