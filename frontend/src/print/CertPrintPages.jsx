import CertificateView from "../feature/certificate/CertificateView";

/**
 * Certificate print pages (A4 landscape) — .certificate-* CSS.
 * ONE certificate per A4 landscape page — never two on a page,
 * never split. Last page never forces a trailing blank page.
 * Each page wrapper is exactly 297mm x 210mm, so the
 * aspect-[297/210] certificate inside is exactly A4 landscape.
 */
export function CertPrintPages({ items = [] }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <div className="certificate-print-root">
      {list.map((item, i) => (
        <div
          key={item.certificateNumber || i}
          className="certificate-print-page"
        >
          <CertificateView {...item} />
        </div>
      ))}
    </div>
  );
}

/** Single certificate on one A4 landscape page. */
export function SingleCertPrintPage({ item }) {
  if (!item) return null;
  return <CertPrintPages items={[item]} />;
}
