import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_VIEW_THRESHOLD, ViewCounter } from "@/components/projects/view-counter";

function mockFetch(response: { ok: boolean; body?: unknown }) {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    json: async () => response.body,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("<ViewCounter />", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("counts the first view in a session, then only reads", async () => {
    const fetchMock = mockFetch({ ok: true, body: { views: 120 } });

    const first = render(<ViewCounter slug="demo" />);
    expect(await screen.findByText("120 views")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/views/demo",
      expect.objectContaining({ method: "POST" }),
    );
    first.unmount();

    render(<ViewCounter slug="demo" />);
    await screen.findByText("120 views");
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/views/demo",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("keeps counts below the public threshold invisible but reserves the space", async () => {
    const fetchMock = mockFetch({ ok: true, body: { views: PUBLIC_VIEW_THRESHOLD - 1 } });
    render(<ViewCounter slug="demo" />);
    await waitFor(() => expect(sessionStorage.getItem("viewed:demo")).toBe("1"));

    const slot = screen.getByTestId("view-counter");
    expect(slot).toHaveClass("invisible");
    expect(slot).toHaveAttribute("aria-hidden", "true");
    expect(slot).not.toHaveTextContent(String(PUBLIC_VIEW_THRESHOLD - 1));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("stays hidden when the counter is unavailable", async () => {
    const fetchMock = mockFetch({ ok: false });
    render(<ViewCounter slug="demo" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.getByTestId("view-counter")).toHaveClass("invisible");
    expect(sessionStorage.getItem("viewed:demo")).toBeNull();
  });
});
