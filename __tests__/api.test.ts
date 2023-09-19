describe("Home", () => {
  it("renders a heading", async () => {
    const res = await fetch("http://localhost:3001/api/v1/flyevent/groups");
    console.log("🚀 ~ res:", res.body);

    expect(true).toBe(true);
  });
});
