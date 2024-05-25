<script lang="ts">
    import Word from "./Word.svelte";

	export let name: string;
	let result = 123;

	async function calculateResult() {
        for (let i = 0; i < 100; i++) {
            await new Promise(resolve => setTimeout(resolve, 21	)); // delay for 0.1 second
            result += 1;
        }
    }

    calculateResult();
</script>

<main>
	<Word />
</main>

<style>
	:global(*) {
		box-sizing: border-box;
		text-transform: uppercase;
	}

	:global(body), :global(html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
		color: #757575;
		margin: 0;
		padding: 0;
		background: #1C1C1E;
	}

	main {
		display: flex;
		align-items: center;

		height: 100%;
	}
</style>