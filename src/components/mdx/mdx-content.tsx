import * as runtime from "react/jsx-runtime";
import type { ComponentType, ReactNode } from "react";
import { Callout } from "./callout";
import { Terminal } from "./terminal";

// Components available inside every MDX file without importing them.
const sharedComponents = { Callout, Terminal };

type MDXComponents = Record<string, ComponentType<never>>;
type MDXRender = (props: { components?: MDXComponents }) => ReactNode;

// Velite compiles MDX to a function body at build time. Evaluating it happens
// during server prerendering, never in the browser. The compiled module is a
// plain hook-free function, so it is called directly rather than mounted as a
// component created during render.
function compileMDX(code: string): MDXRender {
  return new Function(code)({ ...runtime }).default;
}

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  const render = compileMDX(code);
  return <>{render({ components: { ...sharedComponents, ...components } })}</>;
}
