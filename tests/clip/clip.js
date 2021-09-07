function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const arr = [1, 2, 3];

(async () => {
	const lst = await Promise.all(
		arr.map(async (i) => {
			await sleep(10 - i);
			console.log(i);
			return i * 4;
		})
	);

	// 3
	// 2
	// 1

	console.log('Finished async', JSON.stringify(lst));
})().catch((err) => {
	console.error(err);
});
