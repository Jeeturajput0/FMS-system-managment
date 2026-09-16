import { StudentIdCardView } from "../components/StudentIdCardModal";
import { isPortraitTemplate } from "../components/student-id/templates";

/**
 * ID-card print pages (A4 portrait) — Tailwind only, no CSS file.
 * - Every card keeps its physical size/orientation (never stretched):
 *   landscape templates -> 85.6mm x 54mm, portrait -> 54mm x 85.6mm.
 * - Front+back of one student stay together (chunked as a pair).
 * - 4 pairs per A4 page; overflow flows to the next page automatically.
 */

const PAIRS_PER_PAGE = 4;

export const chunkPairs = (pairs, perPage = PAIRS_PER_PAGE) => {
  const pages = [];
  for (let i = 0; i < pairs.length; i += perPage) {
    pages.push(pairs.slice(i, i + perPage));
  }
  return pages;
};

const PrintCard = ({ student, side, template }) => {
  const portrait = isPortraitTemplate(template);
  return (
    <div
      className={`shrink-0 break-inside-avoid ${
        portrait ? "h-[85.6mm] w-[54mm]" : "h-[54mm] w-[85.6mm]"
      }`}
    >
      <StudentIdCardView student={student} side={side} template={template} />
    </div>
  );
};

/** One card (single print) centered on an A4 portrait page. */
export function SingleIdPrintPage({ student, side = "front", template }) {
  if (!student) return null;
  return (
    <div className="flex h-[297mm] w-[210mm] items-center justify-center overflow-hidden break-after-auto bg-white p-[10mm]">
      <PrintCard student={student} side={side} template={template} />
    </div>
  );
}

/**
 * Bulk print: pairs = [{ student, template }].
 * Prints FRONT + BACK for every student, 4 pairs per A4 page.
 */
export function BulkIdPrintPages({ pairs = [] }) {
  const pages = chunkPairs(pairs.filter((p) => p?.student));
  if (!pages.length) return null;
  return (
    <>
      {pages.map((pagePairs, pageIndex) => (
        <div
          key={pageIndex}
          className="flex h-[297mm] w-[210mm] flex-wrap content-start justify-center gap-[8mm] overflow-hidden break-after-page bg-white p-[10mm] last:break-after-auto"
        >
          {pagePairs.map(({ student, template }, i) => (
            <span key={student._id || student.studentId || `${pageIndex}-${i}`} className="contents">
              <PrintCard student={student} side="front" template={template} />
              <PrintCard student={student} side="back" template={template} />
            </span>
          ))}
        </div>
      ))}
    </>
  );
}
