import { Component, type ReactNode, type ErrorInfo } from "react";
import { getTemplate } from "@/features/templates/registry";
import type { Resume } from "@/types";

// Error boundary prevents a template crash from bringing down the whole builder
class TemplateErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("[TemplateErrorBoundary]", err, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[600px] flex flex-col items-center justify-center gap-3 p-8 text-center bg-white"
        >
          <p className="text-sm font-semibold text-gray-700">
            Failed to render this template
          </p>
          <p className="text-xs text-gray-400 max-w-xs">{this.state.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="btn btn-surface text-xs px-3 py-1.5"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface Props {
  resume: Resume;
}

export function ResumePreview({ resume }: Props) {
  const Template = getTemplate(resume.template);
  return (
    <div
      id="resume-preview"
      className="bg-white overflow-hidden"
      style={{ minHeight: "1000px", borderRadius: "8px", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <TemplateErrorBoundary>
        <Template resume={resume} />
      </TemplateErrorBoundary>
    </div>
  );
}
