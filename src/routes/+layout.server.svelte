<script lang="ts">
	export const load = async ({ locals: { getSession } }) => {
		return {
			session: await getSession()
		};
	};
</script>
