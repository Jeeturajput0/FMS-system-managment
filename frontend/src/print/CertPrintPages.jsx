import CertificateView from "../feature/certificate/CertificateView";

/**
 * Certificate print pages (A4 landscape) — Tailwind only, no CSS file.
 * One certificate per page — never two on a page, never split.
 * `last:break-after-auto` prevents a trailing blank page.
 * The wrapper is exactly 297mm wide, so the aspect-[297/210]
 * certificate inside is exactly 297mm x 210mm.
 */
export function CertPrintPages({ items = [] }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      {list.map((item, i) => (
        <div
          key={item.certificateNumber || i}
          className="flex h-[210mm] w-[297mm] items-center justify-center overflow-hidden break-after-page break-inside-avoid bg-white last:break-after-auto"
        >
          <div className="h-[210mm] w-[297mm] shrink-0 break-inside-avoid">
            <CertificateView {...item} />
          </div>
        </div>
      ))}
    </>
  );
}

/** Single certificate on one A4 landscape page. */
export function SingleCertPrintPage({ item }) {
  if (!item) return null;
  return <CertPrintPages items={[item]} />;
}
