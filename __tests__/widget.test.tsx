import { render, screen } from "@testing-library/react";
import Widget from "@/components/Widget";

describe("Widget leading percentage", () => {
  it("renders the Flymaster percentage without raw leading points", () => {
    render(<Widget data={{ position: 33, leadingPercentage: 77 }} />);

    expect(screen.getByText("LO: 77%")).toBeTruthy();
    expect(screen.queryByText(/154\.9/)).toBeNull();
  });

  it("retains the PWC leading-points presentation", () => {
    render(
      <Widget
        data={{ position: 1, leadingPoints: "166.2", percentage: "85" }}
      />,
    );

    expect(screen.getByText("LO: 85% (166.2)")).toBeTruthy();
  });
});
