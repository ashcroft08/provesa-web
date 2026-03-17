<script>
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import ProductSection from '$lib/components/ProductSection.svelte';
	import NosotrosTeaser from '$lib/components/NosotrosTeaser.svelte';
	import SugerenciasForm from '$lib/components/SugerenciasForm.svelte';
	import RedesSociales from '$lib/components/RedesSociales.svelte';
	import SEO from '$lib/components/SEO.svelte';

	/** @type {{ data: { slides: any[], products: any[], nosotros: any, sugOptions: string[], footer: any } }} */
	let { data } = $props();
</script>

<SEO 
	title="Distribuidor Mayorista de Abarrotes y Consumo Masivo"
	description="Líderes en distribución mayorista en La Concordia. Ofrecemos el mejor surtido en abarrotes, productos de limpieza y consumo masivo con precios competitivos."
	jsonLd={{
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "PROVESA SCC",
		"url": "https://provesa.com.ec",
		"logo": "https://provesa.com.ec/logo.png",
		"description": "Distribuidor mayorista líder en productos de consumo masivo en La Concordia, Ecuador.",
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "La Concordia",
			"addressCountry": "EC"
		}
	}}
/>

<HeroSlider slides={data.slides} />
<ProductSection dbProducts={data.products} />
<NosotrosTeaser config={data.nosotros} />
<SugerenciasForm tipos={data.sugOptions} />
<RedesSociales footer={data.footer} />
