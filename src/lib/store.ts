import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FsReport, LocationIntel, SavedStudy, SiteScores } from "./types";

type StudioState = {
  idea: string;
  deep: boolean;
  pin: { lat: number; lng: number } | null;
  intel: LocationIntel | null;
  scores: SiteScores | null;
  report: FsReport | null;
  studies: SavedStudy[];
  activeId: string | null;
  generating: boolean;
  intelLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  setIdea: (idea: string) => void;
  setDeep: (deep: boolean) => void;
  setPin: (pin: { lat: number; lng: number } | null) => void;
  setIntel: (intel: LocationIntel | null, scores: SiteScores | null) => void;
  setScores: (scores: SiteScores | null) => void;
  setIntelLoading: (v: boolean) => void;
  setGenerating: (v: boolean) => void;
  setError: (error: string | null) => void;
  setReport: (report: FsReport | null) => void;
  saveStudy: (study: SavedStudy) => void;
  loadStudy: (id: string) => void;
  deleteStudy: (id: string) => void;
  newStudy: () => void;
  setSidebarOpen: (v: boolean) => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      idea: "",
      deep: false,
      pin: null,
      intel: null,
      scores: null,
      report: null,
      studies: [],
      activeId: null,
      generating: false,
      intelLoading: false,
      error: null,
      sidebarOpen: false,
      setIdea: (idea) => set({ idea }),
      setDeep: (deep) => set({ deep }),
      setPin: (pin) => set({ pin, report: null, error: null, activeId: null }),
      setIntel: (intel, scores) => set({ intel, scores, intelLoading: false }),
      setScores: (scores) => set({ scores }),
      setIntelLoading: (intelLoading) => set({ intelLoading }),
      setGenerating: (generating) => set({ generating }),
      setError: (error) => set({ error, generating: false }),
      setReport: (report) => set({ report, generating: false, error: null }),
      saveStudy: (study) =>
        set({
          studies: [study, ...get().studies.filter((s) => s.id !== study.id)].slice(0, 24),
          activeId: study.id,
        }),
      loadStudy: (id) => {
        const study = get().studies.find((s) => s.id === id);
        if (!study) return;
        set({
          activeId: id,
          idea: study.businessIdea,
          deep: study.deep,
          pin: { lat: study.intel.lat, lng: study.intel.lng },
          intel: study.intel,
          scores: study.scores,
          report: study.report,
          error: null,
        });
      },
      deleteStudy: (id) =>
        set({
          studies: get().studies.filter((s) => s.id !== id),
          activeId: get().activeId === id ? null : get().activeId,
        }),
      newStudy: () =>
        set({
          idea: "",
          pin: null,
          intel: null,
          scores: null,
          report: null,
          activeId: null,
          error: null,
          generating: false,
        }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "feasify-studio",
      partialize: (s) => ({
        studies: s.studies,
        deep: s.deep,
      }),
    },
  ),
);
