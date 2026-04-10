import { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { resumeApi } from "@/services/api";
import { createEmptyResume } from "@/utils/resume";
import type { Resume, ResumeUpdatePayload } from "@/types";

const AUTOSAVE_DELAY_MS = 3000;

interface Options {
  resumeId: string;
}

export function useResumeBuilder({ resumeId }: Options) {
  const [resume,    setResume]    = useState<Resume>(createEmptyResume());
  const [isSaving,  setIsSaving]  = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty,   setIsDirty]   = useState(false);

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref always holds latest resume so autosave closure doesn't go stale
  const latestResume  = useRef<Resume>(resume);

  useEffect(() => {
    latestResume.current = resume;
  }, [resume]);

  // Load on mount / resumeId change
  useEffect(() => {
    if (!resumeId) return;
    let cancelled = false;
    setIsLoading(true);
    setIsDirty(false);

    resumeApi
      .get(resumeId)
      .then(({ data }) => {
        if (!cancelled && data.data) {
          setResume(data.data);
          latestResume.current = data.data;
          document.title = `${data.data.title} — ResumeBuilder`;
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load resume");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      // Reset title on unmount
      document.title = "ResumeBuilder";
    };
  }, [resumeId]);

  // Core persist — always reads from the ref so it never has stale closure data
  const persist = useCallback(async (): Promise<void> => {
    if (!resumeId) return;
    setIsSaving(true);
    try {
      // Strip server-managed fields before sending
      const { _id: _a, userId: _b, createdAt: _c, updatedAt: _d, ...payload } =
        latestResume.current;
      // Explicitly acknowledge unused destructured vars to satisfy the linter
      void _a; void _b; void _c; void _d;

      const { data } = await resumeApi.update(resumeId, payload);
      if (data.data) {
        setResume(data.data);
        latestResume.current = data.data;
      }
      setIsDirty(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [resumeId]);

  // Manual save — cancels pending autosave and saves immediately
  const save = useCallback(async (): Promise<void> => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    await persist();
    toast.success("Saved");
  }, [persist]);

  // Update a top-level field and schedule autosave
  const updateField = useCallback(
    <K extends keyof ResumeUpdatePayload>(key: K, value: Resume[K]) => {
      setResume((prev) => {
        const next = { ...prev, [key]: value };
        latestResume.current = next;
        return next;
      });
      setIsDirty(true);

      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        void persist();
      }, AUTOSAVE_DELAY_MS);
    },
    [persist]
  );

  const toggleVisibility = useCallback(async () => {
    try {
      const { data } = await resumeApi.update(resumeId, {
        isPublic: !latestResume.current.isPublic,
      });
      if (data.data) {
        setResume(data.data);
        latestResume.current = data.data;
      }
      toast.success(data.message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update visibility");
    }
  }, [resumeId]);

  return { resume, updateField, save, isSaving, isLoading, isDirty, toggleVisibility };
}
