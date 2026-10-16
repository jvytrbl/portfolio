import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ViewCounter } from "@/components/projects/view-counter";

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
    const fetchMock = mockFetch({ ok: true, body: { views: 42 } });

    const first = render(<ViewCounter slug="demo" />);
    expect(await screen.findByText("42 views")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/views/demo",
      expect.objectContaining({ method: "POST" }),
    );
    first.unmount();

    render(<ViewCounter slug="demo" />);
    await screen.findByText("42 views");
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/views/demo",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("uses the singular for one view", async () => {
    mockFetch({ ok: true, body: { views: 1 } });
    render(<ViewCounter slug="demo" />);
    expect(await screen.findByText("1 view")).toBeInTheDocument();
  });

  it("stays hidden when the counter is unavailable", async () => {
    const fetchMock = mockFetch({ ok: false });
    const { container } = render(<ViewCounter slug="demo" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
    expect(sessionStorage.getItem("viewed:demo")).toBeNull();
  });
});
