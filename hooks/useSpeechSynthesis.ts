
import { useState, useEffect, useCallback } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis;

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (synth.speaking) {
      console.error('SpeechSynthesis.speaking');
      return;
    }
    if (text !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
      };
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  }, [synth]);

  const cancel = useCallback(() => {
    synth.cancel();
    setIsSpeaking(false);
  }, [synth]);

  useEffect(() => {
    // Cancel speech when component unmounts
    return () => {
      synth.cancel();
    };
  }, [synth]);

  return { isSpeaking, speak, cancel };
};

export default useSpeechSynthesis;
