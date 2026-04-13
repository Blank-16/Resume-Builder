import { useState, useCallback } from "react";
import { aiApi } from "@/services/api";
import type { AIField, AISuggestRequest } from "@/types";
import toast from "react-hot-toast";

interface UseAISuggestOptions {
  field:   AIField;
  context: AISuggestRequest["context"];
  onAccept: (suggestion: string) => void;
}

interface UseAISuggestResult {
  suggestion:   string;
  isLoading:    boolean;
  isOpen:       boolean;
  generate:     () => Promise<void>;
  accept:       () => void;
  dismiss:      () => void;
}

export function useAISuggest({
  field,
  context,
  onAccept,
}: UseAISuggestOptions): UseAISuggestResult {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading,  setIsLoading]  = useState(false);
  const [isOpen,     setIsOpen]     = useState(false);

  const generate = useCallback(async () => {
    setIsLoading(true);
    setIsOpen(false);
    setSuggestion("");
    try {
      const { data } = await aiApi.suggest({ field, context });
      if (data.data?.suggestion) {
        setSuggestion(data.data.suggestion);
        setIsOpen(true);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "AI suggestion failed");
    } finally {
      setIsLoading(false);
    }
  }, [field, context]);

  const accept = useCallback(() => {
    if (suggestion) onAccept(suggestion);
    setIsOpen(false);
    setSuggestion("");
  }, [suggestion, onAccept]);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    setSuggestion("");
  }, []);

  return { suggestion, isLoading, isOpen, generate, accept, dismiss };
}
