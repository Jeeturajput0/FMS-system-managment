import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Production print utilities.
 *
 * Architecture:
 * - Printable documents are ALWAYS mounted inside #print-root
 *   (via <PrintPortal>), which is display:none on screen.
 * - On print: hide #root, set @page orientation for THIS job,
 *   wait for images, then window.print().
 * - afterprint always restores the UI + button state.
 */

export const PRINT_ROOT_ID = "print-root";
const PAGE_STYLE_ID = "print-page-style";

export function ensurePrintRoot() {
  let node = document.getElementById(PRINT_ROOT_ID);
  if (!node) {
    node = document.createElement("div");
    node.id = PRINT_ROOT_ID;
    document.body.appendChild(node);
  }
  return node;
}

/** Declare the intended @page orientation for the current print job. */
export function setPageOrientation(orientation = "portrait") {
  const size = orientation === "landscape" ? "A4 landscape" : "A4 portrait";
  let tag = document.getElementById(PAGE_STYLE_ID);
  if (!tag) {
    tag = document.createElement("style");
    tag.id = PAGE_STYLE_ID;
    document.head.appendChild(tag);
  }
  tag.textContent = `@page { size: ${size}; margin: 0; }`;
}

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

/** Wait until every <img> inside the print tree is loaded (or failed). */
export function waitForImages(container, timeout = 10000) {
  if (!container) return Promise.resolve();
  const images = Array.from(container.querySelectorAll("img"));
  if (!images.length) return Promise.resolve();
  return Promise.race([
    Promise.all(
      images.map((img) =>
        img.complete && img.naturalWidth !== 0
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // never block printing on a broken image
            })
      )
    ),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]);
}

let afterPrintHandlerInstalled = false;
const afterPrintCallbacks = new Set();

function installAfterPrintHandler() {
  if (afterPrintHandlerInstalled) return;
  afterPrintHandlerInstalled = true;
  window.addEventListener("afterprint", () => {
    document.body.classList.remove("printing-id", "printing-cert");
    afterPrintCallbacks.forEach((cb) => {
      try {
        cb();
      } catch {
        /* ignore */
      }
    });
    afterPrintCallbacks.clear();
  });
}

/**
 * Reliable print: prepare -> wait images -> print dialog.
 * Returns false if the print tree is missing (so callers can warn).
 */
export async function runPrintJob(orientation = "portrait") {
  installAfterPrintHandler();
  const root = ensurePrintRoot();
  const hasContent = root && root.childElementCount > 0;
  if (!hasContent) return false;
  document.body.classList.remove("printing-id", "printing-cert");
  document.body.classList.add(orientation === "landscape" ? "printing-cert" : "printing-id");
  setPageOrientation(orientation);
  await waitForImages(root);
  await nextFrame();
  await nextFrame();
  window.print();
  return true;
}

/**
 * Button-friendly hook:
 *   const { printing, handlePrint } = usePrint("portrait");
 *   <button disabled={printing} onClick={handlePrint}>
 *     {printing ? "Preparing print..." : "Print"}
 *   </button>
 * Button is disabled + labelled while preparing, restored via afterprint
 * AND via fallback timeout (some browsers skip afterprint on cancel).
 */
export function usePrint(orientation = "portrait") {
  const [printing, setPrinting] = useState(false);
  const timer = useRef(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handlePrint = useCallback(async () => {
    if (printing) return false;
    setPrinting(true);
    try {
      const started = await runPrintJob(orientation);
      if (!started) {
        setPrinting(false);
        return false;
      }
      // Restore state on dialog close; fallback in case afterprint is missed.
      afterPrintCallbacks.add(() => setPrinting(false));
      timer.current = setTimeout(() => setPrinting(false), 15000);
      return true;
    } catch {
      setPrinting(false);
      return false;
    }
  }, [orientation, printing]);

  return { printing, handlePrint };
}
