import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectFilter } from "@/components/projects/project-filter";

const items = [
  { key: "a", category: "AI/ML", card: <p>Alpha</p> },
  { key: "b", category: "Full-Stack", card: <p>Beta</p> },
  { key: "c", category: "AI/ML", card: <p>Gamma</p> },
];

describe("<ProjectFilter />", () => {
  it("shows everything by default with per-category counts", () => {
    render(<ProjectFilter items={items} categories={["AI/ML", "Full-Stack"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "All 3" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "AI/ML 2" })).toBeInTheDocument();
  });

  it("filters to the selected category and can reset", async () => {
    render(<ProjectFilter items={items} categories={["AI/ML", "Full-Stack"]} />);
    await userEvent.click(screen.getByRole("button", { name: "AI/ML 2" }));

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
    expect(screen.getByText("Showing 2 projects")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "All 3" }));
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });
});
