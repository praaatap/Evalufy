import { create } from "zustand";

interface Question {
  question: string;
  options: Record<string, string>;
  correctAnswer?: string;
}

interface QuestionStore {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: () => void;
}

const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  isLoading: true,
  error: null,

  fetchQuestions: () => {
    set({ isLoading: true, error: null });

   const worker = new Worker("/jsonWorker.js");

    worker.postMessage("load");

    worker.onmessage = (event: MessageEvent) => {
      const { success, data, error } = event.data;
      if (success) {
        set({ questions: data, isLoading: false });
      } else {
        set({ error: error, isLoading: false });
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      set({ error: `Worker error: ${err.message}`, isLoading: false });
      worker.terminate();
    };
  },
}));

export default useQuestionStore;
