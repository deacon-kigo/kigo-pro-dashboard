"use client";

import { useCallback, useMemo, useState } from "react";

export type FieldStatus = "unconfirmed" | "editing" | "confirmed";

export interface FieldState {
  status: FieldStatus;
  value: string;
  prev?: FieldStatus;
}

export interface ChecklistSeed {
  key: string;
  value: string;
}

export interface Checklist {
  fields: Record<string, FieldState>;
  done: number;
  total: number;
  allDone: boolean;
  confirm: (key: string) => void;
  edit: (key: string) => void;
  cancel: (key: string) => void;
  save: (key: string, value: string) => void;
  confirmAll: (skip?: readonly string[]) => void;
}

const seedState = (
  seeds: readonly ChecklistSeed[]
): Record<string, FieldState> =>
  Object.fromEntries(
    seeds.map((seed) => [
      seed.key,
      { status: "unconfirmed" as const, value: seed.value },
    ])
  );

const useChecklist = (seeds: readonly ChecklistSeed[]): Checklist => {
  const [fields, setFields] = useState<Record<string, FieldState>>(() =>
    seedState(seeds)
  );

  const confirm = useCallback((key: string) => {
    setFields((state) => {
      const field = state[key];
      if (!field || !field.value.trim()) return state;
      return { ...state, [key]: { status: "confirmed", value: field.value } };
    });
  }, []);

  const edit = useCallback((key: string) => {
    setFields((state) => {
      const field = state[key];
      if (!field) return state;
      return {
        ...state,
        [key]: {
          prev: field.status === "editing" ? field.prev : field.status,
          status: "editing",
          value: field.value,
        },
      };
    });
  }, []);

  const cancel = useCallback((key: string) => {
    setFields((state) => {
      const field = state[key];
      if (!field) return state;
      const restored =
        field.prev === "confirmed" && field.value.trim()
          ? "confirmed"
          : "unconfirmed";
      return { ...state, [key]: { status: restored, value: field.value } };
    });
  }, []);

  const save = useCallback((key: string, value: string) => {
    setFields((state) => {
      const field = state[key];
      if (!field) return state;
      return {
        ...state,
        [key]: { status: value.trim() ? "confirmed" : "unconfirmed", value },
      };
    });
  }, []);

  const confirmAll = useCallback((skip: readonly string[] = []) => {
    setFields((state) => {
      const next = { ...state };
      Object.entries(state).forEach(([key, field]) => {
        if (
          skip.includes(key) ||
          field.status !== "unconfirmed" ||
          !field.value.trim()
        )
          return;
        next[key] = { status: "confirmed", value: field.value };
      });
      return next;
    });
  }, []);

  return useMemo(() => {
    const entries = Object.values(fields);
    const done = entries.filter((field) => field.status === "confirmed").length;
    return {
      allDone: done === entries.length,
      cancel,
      confirm,
      confirmAll,
      done,
      edit,
      fields,
      save,
      total: entries.length,
    };
  }, [fields, cancel, confirm, confirmAll, edit, save]);
};

export { useChecklist };
