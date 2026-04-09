import { getTemplate } from "@/features/templates/registry";
import type { Resume } from "@/types";

interface Props { resume: Resume; }

export function ResumePreview({ resume }: Props) {
  const Template = getTemplate(resume.template);
  return (
    <div id="resume-preview"
      className="bg-white overflow-hidden"
      style={{ minHeight: "1000px", borderRadius: "8px", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
      <Template resume={resume} />
    </div>
  );
}
