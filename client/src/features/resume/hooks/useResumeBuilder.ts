import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { resumeApi } from "@/services/api";
import { createEmptyResume } from "@/utils/resume";
import type { Resume, ResumeUpdatePayload } from "@/types";

interface Options {
  resumeId: string;
}

export function useResumeBuilder({ resumeId }: Options) {
  const [resume,    setResume]    = useState<Resume>(createEmptyResume());
  const [isSaving,  setIsSaving]  = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load resume on mount / resumeId change
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    resumeApi
      .get(resumeId)
      .then(({ data }) => {
        if (!cancelled && data.data) {
          setResume(data.data);
          document.title = data.data.title;
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load resume");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [resumeId]);

  // Update a single top-level field optimistically
  const updateField = useCallback(
    <K extends keyof ResumeUpdatePayload>(key: K, value: Resume[K]) => {
      setResume((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Persist current state to the server
  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      // Strip server-managed fields before sending
      const { _id, userId, createdAt, updatedAt, ...payload } = resume;
      // Explicitly void to satisfy the no-unused-vars rule cleanly
      void [_id, userId, createdAt, updatedAt];

      const { data } = await resumeApi.update(resumeId, payload);
      if (data.data) setResume(data.data);
      toast.success("Saved successfully");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [resume, resumeId]);

  // Toggle public/private visibility
  const toggleVisibility = useCallback(async () => {
    try {
      const { data } = await resumeApi.update(resumeId, {
        isPublic: !resume.isPublic,
      });
      if (data.data) setResume(data.data);
      toast.success(data.message);
    } catch {
      toast.error("Failed to update visibility");
    }
  }, [resume.isPublic, resumeId]);

  return { resume, updateField, save, isSaving, isLoading, toggleVisibility };
}
