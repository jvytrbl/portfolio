import { existsSync } from "node:fs";
import { join } from "node:path";

export const RESUME_PATH = "/resume.pdf";

// Evaluated at build time: the download button only renders once the PDF
// has been added to public/.
export function hasResume(): boolean {
  return existsSync(join(process.cwd(), "public", RESUME_PATH));
}
