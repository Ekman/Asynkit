import {Asynkit} from "./collection";
import {asynkitEvery, asynkitFromArray, asynkitSome} from "./functions";

describe("collections", () => {
    it("should be able to map", async () => {
        const result = await Asynkit.fromArray([1, 2, 3])
            .map(x => x * 2)
            .toArray();
        expect(result).toEqual([2, 4, 6]);
    });

    it("should be able to filter", async () => {
        const result = await Asynkit.fromArray( [2, 4, 5, 6, 8, 9, 10])
                .filter(x => x % 2 === 0)
                .toArray();
        expect(result).toEqual([2, 4, 6, 8, 10]);
    })

	it("should be able to append a value", async () => {
		const result = await Asynkit.fromArray([1, 2, 3, 4])
			.append(100)
			.toArray();

		expect(result).toEqual([100, 1, 2, 3, 4]);
	})

	it("should be able to prepend a value", async () => {
		const result = await Asynkit.fromArray([1, 2, 3, 4])
			.prepend(23)
			.toArray();

		expect(result).toEqual([1, 2, 3, 4, 23]);
	})

	it("should be able to test some", async () => {
		const result = await Asynkit.fromArray([1, 2, 3, 4])
			.some(x => x === 3);

		expect(result).toBeTruthy();
	})

	it("should be able to test every", async () => {
		const result = await Asynkit.fromArray([2, 2, 2, 2])
			.every(x => x === 2);

		expect(result).toBeTruthy();
	})
})
