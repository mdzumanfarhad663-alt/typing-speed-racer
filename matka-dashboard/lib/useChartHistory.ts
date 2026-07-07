"use client";
import { useState } from "react";

const MAX_HISTORY = 20;

/**
 * Snapshot-based undo/redo for the chart week editors.
 * Call `remember(entries)` with the PRE-mutation entries right after a
 * successful add / edit / delete / import; undo() and redo() restore a
 * snapshot to the server via the provided `restore` callback.
 */
export function useChartHistory<T>(restore: (snapshot: T[]) => Promise<void>) {
  const [undoStack, setUndoStack] = useState<T[][]>([]);
  const [redoStack, setRedoStack] = useState<T[][]>([]);
  const [busy, setBusy] = useState(false);

  function remember(current: T[]) {
    setUndoStack((s) => [...s.slice(-(MAX_HISTORY - 1)), current]);
    setRedoStack([]);
  }

  async function undo(current: T[]) {
    if (undoStack.length === 0 || busy) return;
    const snap = undoStack[undoStack.length - 1];
    setBusy(true);
    try {
      await restore(snap);
      setUndoStack((s) => s.slice(0, -1));
      setRedoStack((s) => [...s, current]);
    } finally {
      setBusy(false);
    }
  }

  async function redo(current: T[]) {
    if (redoStack.length === 0 || busy) return;
    const snap = redoStack[redoStack.length - 1];
    setBusy(true);
    try {
      await restore(snap);
      setRedoStack((s) => s.slice(0, -1));
      setUndoStack((s) => [...s, current]);
    } finally {
      setBusy(false);
    }
  }

  return { remember, undo, redo, canUndo: undoStack.length > 0 && !busy, canRedo: redoStack.length > 0 && !busy };
}
