
/**
 * Utility for handling browser speech recognition
 */

// Check if the browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

interface SpeechRecognitionOptions {
  onResult?: (text: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

class SpeechRecognitionService {
  private recognition: any | null = null;
  private isListening: boolean = false;

  constructor() {
    if (isSpeechRecognitionSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  public startListening(options: SpeechRecognitionOptions = {}): boolean {
    if (!isSpeechRecognitionSupported || !this.recognition) {
      if (options.onError) {
        options.onError('Speech recognition is not supported in this browser');
      }
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    // Configure options
    this.recognition.continuous = options.continuous || false;
    this.recognition.lang = options.language || 'en-US';

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      if (options.onResult) {
        options.onResult(text);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      if (options.onStart) {
        options.onStart();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (options.onEnd) {
        options.onEnd();
      }
    };

    this.recognition.onerror = (event: any) => {
      if (options.onError) {
        options.onError(event.error);
      }
    };

    // Start listening
    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (options.onError) {
        options.onError('Failed to start speech recognition');
      }
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  public isSupported(): boolean {
    return isSpeechRecognitionSupported;
  }
}

// Create a singleton instance
const speechRecognition = new SpeechRecognitionService();

export default speechRecognition;
