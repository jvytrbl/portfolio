import { compile } from "@mdx-js/mdx";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MDXContent } from "@/components/mdx/mdx-content";

async function compileToCode(source: string) {
  return String(await compile(source, { outputFormat: "function-body" }));
}

describe("<MDXContent />", () => {
  it("renders compiled MDX with shared components like <Callout>", async () => {
    const code = await compileToCode("## Problem\n\n<Callout>Heads up</Callout>");
    render(<MDXContent code={code} />);

    expect(screen.getByRole("heading", { level: 2, name: "Problem" })).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveTextContent("Heads up");
  });

  it("lets callers override components", async () => {
    const code = await compileToCode("# Title");
    render(<MDXContent code={code} components={{ h1: () => <p>custom heading</p> }} />);
    expect(screen.getByText("custom heading")).toBeInTheDocument();
  });
});
