import { useState, useEffect, useCallback } from 'react';

interface DraftData {
  content: string;
  timestamp: number;
}

export const useDraftPersistence = (threadId: string) => {
  const [draft, setDraft] = useState('');
  const storageKey = `message-draft-${threadId}`;

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const draftData: DraftData = JSON.parse(stored);
        // Only restore if draft is less than 24 hours old
        if (Date.now() - draftData.timestamp < 24 * 60 * 60 * 1000) {
          setDraft(draftData.content);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [storageKey]);

  // Save draft to localStorage
  const saveDraft = useCallback((content: string) => {
    setDraft(content);
    try {
      if (content.trim()) {
        const draftData: DraftData = {
          content: content.trim(),
          timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(draftData));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [storageKey]);

  // Clear draft
  const clearDraft = useCallback(() => {
    setDraft('');
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [storageKey]);

  return {
    draft,
    saveDraft,
    clearDraft
  };
};