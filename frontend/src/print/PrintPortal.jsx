import { createPortal } from "react-dom";
import { ensurePrintRoot } from "./printUtils";

/**
 * Renders children into the dedicated #print-root (outside #root).
 * `hidden print:block` keeps it off-screen but printable.
 * Content stays mounted so window.print() never fires on an empty tree.
 */
export default function PrintPortal({ children }) {
  return createPortal(
    <div className="hidden print:block">{children}</div>,
    ensurePrintRoot()
  );
}
