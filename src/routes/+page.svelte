<script>
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import ProductSection from '$lib/components/ProductSection.svelte';
	import NosotrosTeaser from '$lib/components/NosotrosTeaser.svelte';
	import SugerenciasForm from '$lib/components/SugerenciasForm.svelte';
	import RedesSociales from '$lib/components/RedesSociales.svelte';

	let { data } = $props();
</script>

<HeroSlider slides={data.slides} />
<ProductSection dbProducts={data.products} />
<NosotrosTeaser config={data.nosotros} />
<SugerenciasForm tipos={data.sugOptions} />
<RedesSociales footer={data.footer} />
