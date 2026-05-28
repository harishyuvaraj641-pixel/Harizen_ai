import { useState, useRef, useEffect, useCallback } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // base64 string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('moonshotai/kimi-k2.6');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-load voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Remove markdown symbols for cleaner speech
    const cleanText = text.replace(/[*#_`~]/g, '').replace(/\[.*?\]\(.*?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Choose a better voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find a premium/natural sounding voice
    const premiumVoice = voices.find(v => 
      (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Natural')) && 
      v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.pitch = 1.05;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachedImage) || isLoading) return;

    // Stop speaking when user sends a new message
    stopSpeaking();

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      ...(attachedImage && { image: attachedImage })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const formattedMessages = [...messages, userMessage].map(msg => {
        if (msg.role === 'user' && msg.image) {
          return {
            role: msg.role,
            content: [
              { type: "text", text: msg.content || "Analyze this image:" },
              { type: "image_url", image_url: { url: msg.image } }
            ]
          };
        }
        return { role: msg.role, content: msg.content };
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: formattedMessages, model: selectedModel }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No reader available');

      let assistantContent = '';
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        assistantContent += text;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: assistantContent
          };
          return newMessages;
        });
      }

      // Speak the completed message
      if (voiceEnabled) {
        speak(assistantContent);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      const errorMsg = 'System Error: Connection to neural network lost.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMsg },
      ]);
      if (voiceEnabled) speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setAttachedImage(null);
  };

  return {
    messages,
    input,
    setInput,
    attachedImage,
    handleImageUpload,
    removeImage,
    selectedModel,
    setSelectedModel,
    isLoading,
    isListening,
    isSpeaking,
    voiceEnabled,
    setVoiceEnabled,
    toggleListening,
    stopSpeaking,
    sendMessage,
    messagesEndRef,
  };
}
