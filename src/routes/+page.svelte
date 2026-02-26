<script>
	import HeroSlider from '$lib/components/HeroSlider.svelte';

	let { data } = $props();
</script>

<HeroSlider slides={data.slides} />
