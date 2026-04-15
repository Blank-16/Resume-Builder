import type { ComponentType } from "react";
import type { TemplateId, TemplateProps, TemplateDefinition } from "@/types";
import { ClassicTemplate }      from "../components/ClassicTemplate";
import { ModernTemplate }       from "../components/ModernTemplate";
import { MinimalTemplate }      from "../components/MinimalTemplate";
import { ExecutiveTemplate }    from "../components/ExecutiveTemplate";
import { HomeCollegeTemplate }  from "../components/HomeCollegeTemplate";
import { GeneralTemplate }      from "../components/GeneralTemplate";

// Registry maps template IDs to their React components.
// To add a new template:
//   1. Create a new component in ../components/
//   2. Import it here
//   3. Add entries in templateRegistry and templateDefinitions
export const templateRegistry: Record<TemplateId, ComponentType<TemplateProps>> = {
  classic:          ClassicTemplate,
  modern:           ModernTemplate,
  minimal:          MinimalTemplate,
  executive:        ExecutiveTemplate,
  home_college:     HomeCollegeTemplate,
  general_template: GeneralTemplate,
};

export const templateDefinitions: TemplateDefinition[] = [
  {
    id:          "classic",
    name:        "Classic",
    description: "Traditional layout, universally ATS-compatible",
  },
  {
    id:          "modern",
    name:        "Modern",
    description: "Sidebar design with accent colour, great for tech roles",
  },
  {
    id:          "minimal",
    name:        "Minimal",
    description: "Clean, airy layout with generous whitespace",
  },
  {
    id:          "executive",
    name:        "Executive",
    description: "Bold typographic hierarchy for senior professionals",
  },
  {
    id:          "home_college",
    name:        "Home / College",
    description: "Classic campus recruitment style — blue headings, clean borders",
  },
  {
    id:          "general_template",
    name:        "General",
    description: "Structured single-column with blockquote header and bullet points",
  },
];

export function getTemplate(id: TemplateId): ComponentType<TemplateProps> {
  return templateRegistry[id] ?? templateRegistry.classic;
}
