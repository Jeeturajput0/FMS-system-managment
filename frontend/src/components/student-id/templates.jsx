import StudentIdTemplate1 from "./StudentIdTemplate1";
import StudentIdTemplate2 from "./StudentIdTemplate2";
import StudentIdTemplate3 from "./StudentIdTemplate3";
import StudentIdTemplate4 from "./StudentIdTemplate4";

/* =========================================================
   TEMPLATE REGISTRY
   To add Template 5 later, only add:
     StudentIdTemplate5.jsx
   and:
     "template-5": StudentIdTemplate5
   (+ its meta entry below)
========================================================= */

export const TEMPLATE_COMPONENTS = {
  "template-1": StudentIdTemplate1,
  "template-2": StudentIdTemplate2,
  "template-3": StudentIdTemplate3,
  "template-4": StudentIdTemplate4,
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
    description: "Maroon · gold premium elegant theme",
    orientation: "Landscape",
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
    orientation: "Portrait",
  },
];

export const DEFAULT_TEMPLATE = "template-1";

export const isKnownTemplate = (id) =>
  Boolean(id && TEMPLATE_COMPONENTS[id]);

export const resolveTemplate = (id) =>
  TEMPLATE_COMPONENTS[id] || TEMPLATE_COMPONENTS[DEFAULT_TEMPLATE];
