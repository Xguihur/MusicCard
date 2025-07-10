import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
}

export const useCopyToClipboard = (resetDelay: number = 2000): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return fallbackCopyTextToClipboard(text);
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetDelay);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      return fallbackCopyTextToClipboard(text);
    }
  }, [resetDelay]);

  const fallbackCopyTextToClipboard = (text: string): boolean => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
      }

      return successful;
    } catch (error) {
      console.error('Fallback copy failed', error);
      document.body.removeChild(textArea);
      return false;
    }
  };

  return { isCopied, copyToClipboard };
};