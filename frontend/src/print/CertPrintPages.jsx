import CertificateView from "../feature/certificate/CertificateView";

/**
 * Certificate print pages (A4 landscape).
 * One certificate per page — never two on a page, never split.
 * The last page does not create a trailing blank page
 * (handled by .a4-certificate-page:last-child in print.css).
 */
export function CertPrintPages({ items = [] }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <>
      {list.map((item, i) => (
        <div className="a4-certificate-page" key={item.certificateNumber || i}>
          <div className="print-cert-slot">
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
