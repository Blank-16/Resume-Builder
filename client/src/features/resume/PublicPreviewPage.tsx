import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resumeApi } from "@/services/api";
import { ResumePreview } from "@/features/resume/components/ResumePreview";
import { createEmptyResume } from "@/utils/resume";
import type { Resume } from "@/types";

export function PublicPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [resume,   setResume]   = useState<Resume>(createEmptyResume());
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const { data } = await resumeApi.getPublic(id);
        if (data.data) setResume(data.data);
      } catch { setNotFound(true); }
      finally   { setLoading(false); }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
        <span className="spinner mr-2" />Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm"
        style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
        Resume not found or is private.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 print:p-0" style={{ background: "var(--bg-subtle)" }}>
      <div className="max-w-4xl mx-auto print:max-w-none">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
