'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const TRIGGER_SHOWN_KEY = 'propelusai_chat_trigger_shown';
const EXIT_TRIGGER_KEY = 'propelusai_chat_exit_trigger';

interface ChatTriggerState {
  showEngagementPrompt: boolean;
  showExitPrompt: boolean;
  promptMessage: string;
  dismissPrompt: () => void;
  onChatOpened: () => void;
}

export function useChatTriggers(isChatOpen: boolean): ChatTriggerState {
  const [showEngagementPrompt, setShowEngagementPrompt] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef(false);

  const alreadyShown = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem(TRIGGER_SHOWN_KEY) === 'true';
  }, []);

  const exitAlreadyShown = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem(EXIT_TRIGGER_KEY) === 'true';
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowEngagementPrompt(false);
    setShowExitPrompt(false);
    sessionStorage.setItem(TRIGGER_SHOWN_KEY, 'true');
    sessionStorage.setItem(EXIT_TRIGGER_KEY, 'true');
  }, []);

  const onChatOpened = useCallback(() => {
    setShowEngagementPrompt(false);
    setShowExitPrompt(false);
    sessionStorage.setItem(TRIGGER_SHOWN_KEY, 'true');
    sessionStorage.setItem(EXIT_TRIGGER_KEY, 'true');
  }, []);

  // Trigger 1: Active user engagement (15s of browsing)
  useEffect(() => {
    if (isChatOpen || alreadyShown()) return;

    const onActivity = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;

      activityTimerRef.current = setTimeout(() => {
        if (!isChatOpen && !alreadyShown()) {
          setPromptMessage('Have questions about our services?');
          setShowEngagementPrompt(true);
        }
      }, 15000);
    };

    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('click', onActivity);

    return () => {
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('click', onActivity);
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [isChatOpen, alreadyShown]);

  // Trigger 2: Exit intent (desktop: mouse leaves viewport top; mobile: 30s inactivity)
  useEffect(() => {
    if (isChatOpen || exitAlreadyShown()) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isMobile) {
      const resetInactivity = () => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = setTimeout(() => {
          if (!isChatOpen && !exitAlreadyShown() && !showEngagementPrompt) {
            setPromptMessage('Before you go, let us help you find what you need.');
            setShowExitPrompt(true);
            sessionStorage.setItem(EXIT_TRIGGER_KEY, 'true');
          }
        }, 30000);
      };

      resetInactivity();
      window.addEventListener('scroll', resetInactivity, { passive: true });
      window.addEventListener('touchstart', resetInactivity);

      return () => {
        window.removeEventListener('scroll', resetInactivity);
        window.removeEventListener('touchstart', resetInactivity);
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      };
    } else {
      const onMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 5 && !exitAlreadyShown() && !showEngagementPrompt) {
          setPromptMessage('Before you go, let us help you find what you need.');
          setShowExitPrompt(true);
          sessionStorage.setItem(EXIT_TRIGGER_KEY, 'true');
        }
      };

      document.addEventListener('mouseleave', onMouseLeave);
      return () => document.removeEventListener('mouseleave', onMouseLeave);
    }
  }, [isChatOpen, exitAlreadyShown, showEngagementPrompt]);

  return {
    showEngagementPrompt,
    showExitPrompt,
    promptMessage,
    dismissPrompt,
    onChatOpened,
  };
}
