<script>
	import HeroSlider from '$lib/components/HeroSlider.svelte';
	import ProductSection from '$lib/components/ProductSection.svelte';

	let { data } = $props();
</script>

<HeroSlider slides={data.slides} />
<ProductSection dbProducts={data.products} />
