import {Asynkit} from "./collection.js";

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
})
