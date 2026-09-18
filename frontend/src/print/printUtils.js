import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Production print engine — JavaScript only, no print CSS file.
 * Tailwind handles all sizes/layout (mm arbitrary values + print: variant).
 * This module only does what Tailwind cannot:
 *   1. @page orientation per print job (dynamic <style> tag).
 *   2. Hide the app (#root) during print via inline styles.
 *   3. Wait for images, then window.print(), then restore everything.
 *
 * Printable documents are ALWAYS mounted inside #print-root
 * (via <PrintPortal>, `hidden print:block`), so window.print()
 * never fires on an empty tree.
 */

export const PRINT_ROOT_ID = "print-root";
const PAGE_STYLE_ID = "print-page-style";

export function ensurePrintRoot() {
  let node = document.getElementById(PRINT_ROOT_ID);
  if (!node) {
    node = document.createElement("div");
    node.id = PRINT_ROOT_ID;
    // NOTE: no inline display style here — visibility is controlled by
    // the `hidden print:block` Tailwind classes on each portal wrapper.
    // (Inline display:none would override print:block and print blank.)
    document.body.appendChild(node);
  }
  return node;
}

/**
 * Declare the intended @page orientation for the current print job,
 * plus tiny print-only normalizations for legacy CSS components
 * (ID-card shadows/borders). Rewritten on every job, so ID (portrait)
 * and certificate (landscape) jobs never fight each other.
 */
export function setPageOrientation(orientation = "portrait") {
  const size = orientation === "landscape" ? "A4 landscape" : "A4 portrait";
  let tag = document.getElementById(PAGE_STYLE_ID);
  if (!tag) {
    tag = document.createElement("style");
    tag.id = PAGE_STYLE_ID;
    document.head.appendChild(tag);
  }
  tag.textContent = `
@page { size: ${size}; margin: 0; }
@media print {
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  #print-root, #print-root *,
  .id-card-print-root, .id-card-print-root *,
  .certificate-print-root, .certificate-print-root * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .sid { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
  .student-id-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
  .certificate-template { box-shadow: none !important; }
}`;
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

const APP_ROOT_ID = "root";
const prevInlineStyles = new Map();

function hideAppForPrint() {
  const app = document.getElementById(APP_ROOT_ID);
  if (app) {
    prevInlineStyles.set(app, app.style.display);
    app.style.display = "none";
  }
  prevInlineStyles.set(document.body, document.body.style.cssText);
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.background = "#fff";
  document.body.style.webkitPrintColorAdjust = "exact";
  document.body.style.printColorAdjust = "exact";
}

function restoreAppAfterPrint() {
  const app = document.getElementById(APP_ROOT_ID);
  if (app && prevInlineStyles.has(app)) {
    app.style.display = prevInlineStyles.get(app);
  }
  if (prevInlineStyles.has(document.body)) {
    document.body.style.cssText = prevInlineStyles.get(document.body);
  }
  prevInlineStyles.clear();
}

let afterPrintHandlerInstalled = false;
const afterPrintCallbacks = new Set();

function installAfterPrintHandler() {
  if (afterPrintHandlerInstalled) return;
  afterPrintHandlerInstalled = true;
  window.addEventListener("afterprint", () => {
    restoreAppAfterPrint();
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
  hideAppForPrint();
  setPageOrientation(orientation);
  // Let webfonts settle (never block printing if this fails).
  try {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
    }
  } catch {
    /* ignore */
  }
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
        restoreAppAfterPrint();
        setPrinting(false);
        return false;
      }
      // Restore state on dialog close; fallback in case afterprint is missed.
      afterPrintCallbacks.add(() => setPrinting(false));
      timer.current = setTimeout(() => {
        restoreAppAfterPrint();
        setPrinting(false);
      }, 15000);
      return true;
    } catch {
      restoreAppAfterPrint();
      setPrinting(false);
      return false;
    }
  }, [orientation, printing]);

  return { printing, handlePrint };
}
