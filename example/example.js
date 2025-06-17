import {AsyncCollection} from "../dist/index.js";

const pipeline = AsyncCollection.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
	.map(x => x * 2)
	.chunk(2);

for await (const value of pipeline) {
	console.log(value);
}
