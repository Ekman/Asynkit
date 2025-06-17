import {
	asyncIterableFilter, asyncIterableFirst,
	asyncIterableFirstOrDefault,
	asyncIterableFromArray,
	asyncIterableMap
} from "./functions.js";
import {utilTestRun} from "./utils-test.js";
import {AsyncCollectionEmptyError} from "./errors.js";

describe("functions", () => {
    it("should be able to map", async () => {
        const result = await utilTestRun(
            [1, 2, 3],
            it => asyncIterableMap(it, x => x * 2),
        );
        expect(result).toEqual([2, 4, 6]);
    });

    it("should be able to filter", async () => {
        const result = await utilTestRun(
            [2, 4, 5, 6, 8, 9, 10],
            it => asyncIterableFilter(it, x => x % 2 === 0),
        );
        expect(result).toEqual([2, 4, 6, 8, 10]);
    })

	it("should be able to get the first or default", async () => {
		const result = await asyncIterableFirstOrDefault(
			asyncIterableFromArray([2, 4, 5, 6, 8, 9, 10]),
			undefined
		);
		expect(result).toEqual(2);
	})

	it("should be able to get the first", async () => {
		const result = await asyncIterableFirst(
			asyncIterableFromArray([4, 5, 6, 8, 9, 10])
		);
		expect(result).toEqual(4);
	})

	it("throws if it gets first first in an empty iterable", async () => {
		const result = () => {
			return asyncIterableFirst(
				asyncIterableFromArray([])
			);
		}

		expect(result).toThrow(AsyncCollectionEmptyError);
	})
})
