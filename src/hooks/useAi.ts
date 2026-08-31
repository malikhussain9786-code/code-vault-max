import { useState, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/apiClient';

function extractErrorMessage(err: unknown): string {
  if (isAxiosError(err) && err.response) {
    const data = err.response.data as { error?: string };
    return data.error || 'Something went wrong';
  }
  return 'Could not reach the server. Check your connection and try again.';
}

export function useAi() {
  const [generating, setGenerating] = useState(false);
  const [generateUnavailable, setGenerateUnavailable] = useState<string | null>(null);

  const [explanation, setExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);
  const [explainUnavailable, setExplainUnavailable] = useState<string | null>(null);

  const [findingErrors, setFindingErrors] = useState(false);
  const [foundErrors, setFoundErrors] = useState<{ hasIssues: boolean; explanation: string } | null>(null);
  const [findErrorsUnavailable, setFindErrorsUnavailable] = useState<string | null>(null);

  const [fixing, setFixing] = useState(false);
  const [fixUnavailable, setFixUnavailable] = useState<string | null>(null);

  const [improving, setImproving] = useState(false);
  const [improveResult, setImproveResult] = useState<{ improvedCode: string; explanation: string } | null>(null);
  const [improveUnavailable, setImproveUnavailable] = useState<string | null>(null);

  const [documenting, setDocumenting] = useState(false);
  const [documentResult, setDocumentResult] = useState<{ documentedCode: string; readme: string } | null>(null);
  const [documentUnavailable, setDocumentUnavailable] = useState<string | null>(null);

  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [askUnavailable, setAskUnavailable] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  /** Writes new code from a plain-language prompt, from scratch — not tied to any existing code in the editor. */
  const generate = useCallback(
    async (language: string, prompt: string): Promise<{ code: string; explanation: string } | null> => {
      setGenerating(true);
      setError(null);
      setGenerateUnavailable(null);
      try {
        const res = await apiClient.post('/api/ai/generate', { language, prompt });
        if (res.data.available === false) {
          setGenerateUnavailable(res.data.message);
          return null;
        }
        return res.data;
      } catch (err) {
        setError(extractErrorMessage(err));
        return null;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  /** Explains the code by reading it — no execution involved. */
  const explain = useCallback(async (language: string, code: string) => {
    setExplaining(true);
    setError(null);
    setExplainUnavailable(null);
    try {
      const res = await apiClient.post('/api/ai/explain', { language, code });
      if (res.data.available === false) {
        setExplainUnavailable(res.data.message);
      } else {
        setExplanation(res.data.explanation);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setExplaining(false);
    }
  }, []);

  /**
   * Finds likely errors by having the AI read the code — an honest static review,
   * not a confirmed runtime error (there's no code execution in this build).
   */
  const findErrors = useCallback(async (language: string, code: string) => {
    setFindingErrors(true);
    setError(null);
    setFindErrorsUnavailable(null);
    setFoundErrors(null);
    try {
      const res = await apiClient.post('/api/ai/find-errors', { language, code });
      if (res.data.available === false) {
        setFindErrorsUnavailable(res.data.message);
      } else {
        setFoundErrors(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setFindingErrors(false);
    }
  }, []);

  const fix = useCallback(async (language: string, code: string): Promise<{ fixedCode: string; explanation: string } | null> => {
    setFixing(true);
    setError(null);
    setFixUnavailable(null);
    try {
      const res = await apiClient.post('/api/ai/fix-errors', { language, code });
      if (res.data.available === false) {
        setFixUnavailable(res.data.message);
        return null;
      }
      return res.data;
    } catch (err) {
      setError(extractErrorMessage(err));
      return null;
    } finally {
      setFixing(false);
    }
  }, []);

  const improve = useCallback(async (language: string, code: string) => {
    setImproving(true);
    setError(null);
    setImproveUnavailable(null);
    setImproveResult(null);
    try {
      const res = await apiClient.post('/api/ai/improve', { language, code });
      if (res.data.available === false) {
        setImproveUnavailable(res.data.message);
      } else {
        setImproveResult(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setImproving(false);
    }
  }, []);

  const document = useCallback(async (language: string, code: string) => {
    setDocumenting(true);
    setError(null);
    setDocumentUnavailable(null);
    setDocumentResult(null);
    try {
      const res = await apiClient.post('/api/ai/document', { language, code });
      if (res.data.available === false) {
        setDocumentUnavailable(res.data.message);
      } else {
        setDocumentResult(res.data);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setDocumenting(false);
    }
  }, []);

  const ask = useCallback(async (question: string, language?: string, code?: string) => {
    setAsking(true);
    setError(null);
    setAskUnavailable(null);
    setAnswer(null);
    try {
      const res = await apiClient.post('/api/ai/learn', { question, language, code });
      if (res.data.available === false) {
        setAskUnavailable(res.data.message);
      } else {
        setAnswer(res.data.answer);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setAsking(false);
    }
  }, []);

  return {
    generate,
    generating,
    generateUnavailable,
    explain,
    explanation,
    explaining,
    explainUnavailable,
    findErrors,
    findingErrors,
    foundErrors,
    findErrorsUnavailable,
    fix,
    fixing,
    fixUnavailable,
    improve,
    improving,
    improveResult,
    improveUnavailable,
    document,
    documenting,
    documentResult,
    documentUnavailable,
    ask,
    asking,
    answer,
    askUnavailable,
    error,
  };
}
