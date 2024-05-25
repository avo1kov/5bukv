<script lang="ts">
    import Word from "./Word.svelte";
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