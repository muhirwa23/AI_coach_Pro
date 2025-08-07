// Advanced Speech Processing Utilities for Rwanda AI Career Coach

export class SpeechProcessor {
  constructor() {
    this.recognition = null;
    this.synthesis = null;
    this.audioContext = null;
    this.analyser = null;
    this.isListening = false;
    this.callbacks = {};
  }

  // Initialize speech recognition with Rwanda-specific settings
  initializeSpeechRecognition() {
    if (typeof window === 'undefined') return null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure for Rwanda context
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // Primary language
      this.recognition.maxAlternatives = 3;
      
      // Handle results
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            this.callbacks.onFinalTranscript?.(transcript, confidence);
          } else {
            interimTranscript += transcript;
            this.callbacks.onInterimTranscript?.(transcript);
          }
        }

        this.callbacks.onTranscriptUpdate?.({
          interim: interimTranscript,
          final: finalTranscript
        });
      };

      // Handle errors
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.callbacks.onError?.(event.error);
      };

      // Handle end
      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();
      };

      return this.recognition;
    }
    return null;
  }

  // Start listening with real-time processing
  startListening(callbacks = {}) {
    this.callbacks = callbacks;
    
    if (!this.recognition) {
      this.initializeSpeechRecognition();
    }

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
        this.callbacks.onStart?.();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        this.callbacks.onError?.(error.message);
      }
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text-to-Speech with Rwanda recruiter personalities
  speak(text, options = {}) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply Rwanda recruiter voice settings
    const {
      rate = 0.9,
      pitch = 1.0,
      volume = 0.8,
      voice = null,
      recruiterType = 'default'
    } = options;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Select appropriate voice based on recruiter
    const voices = speechSynthesis.getVoices();
    if (voice) {
      utterance.voice = voice;
    } else {
      // Try to find suitable voice for recruiter type
      const suitableVoice = this.selectVoiceForRecruiter(voices, recruiterType);
      if (suitableVoice) utterance.voice = suitableVoice;
    }

    // Event handlers
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = (event) => options.onError?.(event);

    speechSynthesis.speak(utterance);
    return utterance;
  }

  // Select voice based on recruiter personality
  selectVoiceForRecruiter(voices, recruiterType) {
    const voicePreferences = {
      'bank-of-kigali': ['female', 'professional', 'clear'],
      'mtn-rwanda': ['male', 'technical', 'confident'],
      'zipline': ['female', 'warm', 'innovative']
    };

    const preferences = voicePreferences[recruiterType] || ['neutral'];
    
    // Try to find matching voice
    for (const pref of preferences) {
      const matchingVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(pref) ||
        voice.lang.includes('en')
      );
      if (matchingVoice) return matchingVoice;
    }

    // Fallback to first available English voice
    return voices.find(voice => voice.lang.includes('en')) || voices[0];
  }

  // Real-time audio analysis
  async setupAudioAnalysis(stream) {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      return {
        analyser: this.analyser,
        dataArray,
        bufferLength
      };
    } catch (error) {
      console.error('Audio analysis setup failed:', error);
      return null;
    }
  }

  // Calculate speech metrics
  calculateSpeechMetrics(dataArray) {
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const volume = Math.round((average / 255) * 100);
    
    // Calculate frequency distribution for speech analysis
    const lowFreq = dataArray.slice(0, 85).reduce((a, b) => a + b) / 85;
    const midFreq = dataArray.slice(85, 170).reduce((a, b) => a + b) / 85;
    const highFreq = dataArray.slice(170).reduce((a, b) => a + b) / 86;

    return {
      volume,
      clarity: midFreq > lowFreq ? 'clear' : 'muffled',
      energy: average,
      timestamp: Date.now(),
      frequencies: { low: lowFreq, mid: midFreq, high: highFreq }
    };
  }

  // Detect speech patterns for confidence analysis
  analyzeSpeechPattern(transcript) {
    const words = transcript.toLowerCase().split(' ');
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically'];
    const confidenceWords = ['definitely', 'certainly', 'confident', 'sure', 'absolutely'];
    
    const fillerCount = words.filter(word => fillerWords.includes(word)).length;
    const confidenceCount = words.filter(word => confidenceWords.includes(word)).length;
    const wordsPerMinute = words.length; // Simplified calculation
    
    const confidenceScore = Math.max(0, 100 - (fillerCount * 10) + (confidenceCount * 5));
    
    return {
      fillerWords: fillerCount,
      confidenceWords: confidenceCount,
      wordsPerMinute,
      confidenceScore: Math.min(100, confidenceScore),
      clarity: fillerCount < 3 ? 'high' : fillerCount < 6 ? 'medium' : 'low'
    };
  }

  // Rwanda-specific speech analysis
  analyzeRwandaContext(transcript) {
    const rwandaKeywords = [
      'rwanda', 'kigali', 'vision 2050', 'digital transformation',
      'mobile money', 'fintech', 'agritech', 'kinyarwanda',
      'bank of kigali', 'mtn rwanda', 'zipline', 'umuganda',
      'ubuntu', 'community', 'innovation', 'technology'
    ];

    const culturalWords = [
      'community', 'collaboration', 'respect', 'integrity',
      'excellence', 'teamwork', 'innovation', 'impact'
    ];

    const rwandaScore = rwandaKeywords.filter(keyword => 
      transcript.toLowerCase().includes(keyword)
    ).length;

    const culturalScore = culturalWords.filter(word => 
      transcript.toLowerCase().includes(word)
    ).length;

    return {
      rwandaContextScore: Math.min(100, rwandaScore * 20),
      culturalFitScore: Math.min(100, culturalScore * 15),
      mentionedKeywords: rwandaKeywords.filter(keyword => 
        transcript.toLowerCase().includes(keyword)
      ),
      culturalAlignment: culturalScore >= 2 ? 'high' : culturalScore >= 1 ? 'medium' : 'low'
    };
  }

  // Cleanup resources
  cleanup() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    speechSynthesis.cancel();
    this.isListening = false;
    this.callbacks = {};
  }
}

// Conversation flow manager
export class ConversationManager {
  constructor() {
    this.history = [];
    this.currentContext = {};
    this.interviewPhase = 'introduction';
  }

  addMessage(type, content, metadata = {}) {
    const message = {
      id: Date.now(),
      type, // 'user' or 'ai'
      content,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        phase: this.interviewPhase
      }
    };

    this.history.push(message);
    this.updateContext(message);
    return message;
  }

  updateContext(message) {
    // Update conversation context based on message
    if (message.type === 'user') {
      this.currentContext.lastUserInput = message.content;
      this.currentContext.userEngagement = this.calculateEngagement();
    } else {
      this.currentContext.lastAIResponse = message.content;
    }

    // Determine interview phase
    this.updateInterviewPhase();
  }

  updateInterviewPhase() {
    const messageCount = this.history.filter(m => m.type === 'user').length;
    
    if (messageCount <= 2) {
      this.interviewPhase = 'introduction';
    } else if (messageCount <= 5) {
      this.interviewPhase = 'experience';
    } else if (messageCount <= 8) {
      this.interviewPhase = 'technical';
    } else {
      this.interviewPhase = 'closing';
    }
  }

  calculateEngagement() {
    const recentMessages = this.history.slice(-5);
    const avgLength = recentMessages.reduce((sum, msg) => 
      sum + (msg.content?.length || 0), 0
    ) / recentMessages.length;

    return avgLength > 50 ? 'high' : avgLength > 20 ? 'medium' : 'low';
  }

  getConversationSummary() {
    return {
      totalMessages: this.history.length,
      userMessages: this.history.filter(m => m.type === 'user').length,
      aiMessages: this.history.filter(m => m.type === 'ai').length,
      currentPhase: this.interviewPhase,
      engagement: this.currentContext.userEngagement,
      duration: this.history.length > 0 ? 
        Date.now() - this.history[0].timestamp.getTime() : 0
    };
  }
}

// Export instances
export const speechProcessor = new SpeechProcessor();
export const conversationManager = new ConversationManager();