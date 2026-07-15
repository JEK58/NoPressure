import { getFlymasterPosition } from "@/server/api/routers/flymaster";

describe("getFlymasterPosition", () => {
  it("reads rankings from Flymaster's current scoring endpoint", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ st: 837435287 }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({
          aaData: [["674826", 3, "", "Darko Stankovski"]],
        }),
      } as Response);
    Object.defineProperty(global, "fetch", {
      configurable: true,
      value: fetchMock,
    });

    await expect(getFlymasterPosition("7784", "674826")).resolves.toEqual({
      position: 3,
    });

    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://lt.flymaster.net/scoring/7784/837435240",
      expect.any(Object),
    );
  });
});
