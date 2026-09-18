import StudentIdTemplate1 from "./StudentIdTemplate1";
import StudentIdTemplate2 from "./StudentIdTemplate2";
import StudentIdTemplate3 from "./StudentIdTemplate3";
import StudentIdTemplate4 from "./StudentIdTemplate4";
import StudentIdTemplate5 from "./StudentIdTemplate5";

/* =========================================================
   TEMPLATE REGISTRY
   Portrait templates : 54mm x 85.6mm (aspect 54 / 85.6)
   Landscape templates: 85.6mm x 54mm (aspect 85.6 / 54)
   Template 1 + 4 = landscape; 2 + 3 + 5 = portrait.
======================================================== */

export const TEMPLATE_COMPONENTS = {
  "template-1": StudentIdTemplate1,
  "template-2": StudentIdTemplate2,
  "template-3": StudentIdTemplate3,
  "template-4": StudentIdTemplate4,
  "template-5": StudentIdTemplate5,
};

export const TEMPLATE_META = [
  {
    id: "template-1",
    name: "Classic Blue",
    description: "White · blue geometric professional theme",
    orientation: "Landscape",
  },
  {
    id: "template-2",
    name: "Maroon Gold",
    description: "Maroon · gold premium theme with sheet",
    orientation: "Portrait",
  },
  {
    id: "template-3",
    name: "Corporate Cyan",
    description: "Cyan · navy modern corporate theme",
    orientation: "Portrait",
  },
  {
    id: "template-4",
    name: "Minimal Beige",
    description: "Beige · navy clean minimal theme",
    orientation: "Landscape",
  },
  {
    id: "template-5",
    name: "School Cream",
    description: "Cream · mauve school theme with barcode",
    orientation: "Portrait",
  },
];

export const DEFAULT_TEMPLATE = "template-1";

/** Landscape templates print at 85.6mm x 54mm; portrait at 54mm x 85.6mm. */
export const PORTRAIT_TEMPLATES = ["template-2", "template-3", "template-5"];

export const LANDSCAPE_TEMPLATES = ["template-1", "template-4"];

export const isPortraitTemplate = (id) => PORTRAIT_TEMPLATES.includes(id);

export const isKnownTemplate = (id) =>
  Boolean(id && TEMPLATE_COMPONENTS[id]);

export const resolveTemplate = (id) =>
  TEMPLATE_COMPONENTS[id] || TEMPLATE_COMPONENTS[DEFAULT_TEMPLATE];
