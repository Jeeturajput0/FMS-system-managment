import { createPortal } from "react-dom";
import { ensurePrintRoot } from "./printUtils";

/**
 * Renders children into the dedicated #print-root (outside #root).
 * Screen: hidden by print.css. Print: the ONLY visible content.
 * Content stays mounted so window.print() never fires on an empty tree.
 */
export default function PrintPortal({ children }) {
  return createPortal(children, ensurePrintRoot());
}
