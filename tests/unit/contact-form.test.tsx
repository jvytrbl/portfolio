import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/contact-form";
import type { ContactState } from "@/lib/contact/schema";

const submitContact = vi.fn<(prev: ContactState, data: FormData) => Promise<ContactState>>();
vi.mock("@/app/actions/contact", () => ({
  submitContact: (prev: ContactState, data: FormData) => submitContact(prev, data),
}));

describe("<ContactForm />", () => {
  beforeEach(() => submitContact.mockReset());

  it("moves focus to the first invalid field and keeps typed values", async () => {
    submitContact.mockResolvedValueOnce({
      status: "error",
      message: "Please fix the 2 highlighted fields.",
      fieldErrors: {
        email: "Enter an email address like name@example.com.",
        message: "Message needs at least 10 characters.",
      },
      values: { name: "Ada", email: "nope", subject: "", message: "hi" },
    });
    // configured without a Turnstile key = no human check gating the submit.
    render(<ContactForm configured />);

    await userEvent.type(screen.getByLabelText("Name (required)"), "Ada");
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));

    const email = await screen.findByLabelText("Email (required)");
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Enter an email address like name@example.com.");
    expect(screen.getByLabelText("Name (required)")).toHaveValue("Ada");
    expect(screen.getByText("Please fix the 2 highlighted fields.")).toBeInTheDocument();
  });

  it("counts message characters", async () => {
    render(<ContactForm configured />);
    await userEvent.type(screen.getByLabelText("Message (required)"), "Hello");
    expect(screen.getByText("5 / 5,000")).toBeInTheDocument();
  });

  it("blocks submission while unconfigured and explains why", async () => {
    render(<ContactForm configured={false} />);
    const submit = screen.getByRole("button", { name: "Send message" });
    expect(submit).toHaveAttribute("aria-disabled", "true");
    expect(submit).toHaveAccessibleDescription(/being set up/);
    await userEvent.click(submit);
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("shows the success state", async () => {
    submitContact.mockResolvedValueOnce({ status: "success", message: "Thanks." });
    render(<ContactForm configured />);
    await userEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Message sent");
    expect(screen.getByRole("status")).toHaveFocus();
  });
});
