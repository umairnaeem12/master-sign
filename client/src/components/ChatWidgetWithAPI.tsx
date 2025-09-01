import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Multiple free API options
const FREE_APIS = {
  // Option 1: Hugging Face (requires free token)
  HUGGING_FACE: {
    url: 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
    requiresToken: true,
    description: 'Hugging Face (30k requests/month free)'
  },
  
  // Option 2: Free AI API (no token required)
  FREE_AI: {
    url: 'https://api.free-ai.com/v1/chat/completions',
    requiresToken: false,
    description: 'Free AI API (limited requests)'
  },
  
  // Option 3: Local fallback (no API needed)
  LOCAL: {
    url: null,
    requiresToken: false,
    description: 'Local responses (unlimited)'
  }
};

// Local chatbot responses as fallback
const getLocalResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('service') || message.includes('offer')) {
    return "We offer LED Digital Signs, Vehicle Wraps, Laser Engraving, Custom Banners, and Architectural Signs. What interests you most?";
  }
  
  if (message.includes('cost') || message.includes('price')) {
    return "Pricing varies by project. Call us at (555) 123-4567 for a custom quote!";
  }
  
  if (message.includes('time') || message.includes('turnaround')) {
    return "Simple signs: 1-3 days. Complex projects: 1-2 weeks. We'll give you a timeline upfront!";
  }
  
  if (message.includes('install')) {
    return "Yes! We provide professional installation services. Licensed, insured, and experienced.";
  }
  
  return "Great question! For specific details, call us at (555) 123-4567. What else would you like to know?";
};

const ChatWidgetWithAPI: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Master Signs assistant. I can help with general questions, or connect you to our team for specific details.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAPI, setCurrentAPI] = useState<keyof typeof FREE_APIS>('LOCAL');
  const [apiStatus, setApiStatus] = useState<string>('Local mode active');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let botResponse = '';
      
      if (currentAPI === 'LOCAL') {
        // Use local responses
        botResponse = getLocalResponse(text.trim());
      } else if (currentAPI === 'HUGGING_FACE') {
        // Try Hugging Face API (requires token)
        try {
          const response = await fetch(FREE_APIS.HUGGING_FACE.url, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer hf_xxx', // User needs to add their token
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: text.trim() }),
          });

          if (response.ok) {
            const data = await response.json();
            botResponse = data[0]?.generated_text || getLocalResponse(text.trim());
          } else {
            throw new Error('API request failed');
          }
        } catch (error) {
          console.log('Hugging Face API failed, falling back to local');
          botResponse = getLocalResponse(text.trim());
        }
      } else if (currentAPI === 'FREE_AI') {
        // Try Free AI API
        try {
          const response = await fetch(FREE_APIS.FREE_AI.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [{ role: 'user', content: text.trim() }],
              model: 'gpt-3.5-turbo',
              max_tokens: 150
            }),
          });

          if (response.ok) {
            const data = await response.json();
            botResponse = data.choices?.[0]?.message?.content || getLocalResponse(text.trim());
          } else {
            throw new Error('Free AI API request failed');
          }
        } catch (error) {
          console.log('Free AI API failed, falling back to local');
          botResponse = getLocalResponse(text.trim());
        }
      }

      // Add typing delay for better UX
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 800);

    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getLocalResponse(text.trim()),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const switchAPI = () => {
    const apis = Object.keys(FREE_APIS) as (keyof typeof FREE_APIS)[];
    const currentIndex = apis.indexOf(currentAPI);
    const nextIndex = (currentIndex + 1) % apis.length;
    const nextAPI = apis[nextIndex];
    
    setCurrentAPI(nextAPI);
    setApiStatus(`${FREE_APIS[nextAPI].description} - ${nextAPI === 'LOCAL' ? 'No API needed' : 'May require setup'}`);
    
    // Add system message about API change
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `Switched to ${FREE_APIS[nextAPI].description}. ${nextAPI === 'LOCAL' ? 'Using local responses.' : 'API responses when available.'}`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const quickQuestions = [
    "What services do you offer?",
    "How much do signs cost?",
    "What's your turnaround time?",
    "Do you do installations?"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-8 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[var(--master-blue)] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Master Signs Assistant</h3>
                <p className="text-xs text-blue-100">{apiStatus}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={switchAPI}
                className="text-white hover:bg-blue-700 rounded-full"
                title="Switch API mode"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-blue-700 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-[350px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-[var(--master-blue)] text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--master-blue)] focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputText.trim()}
                className="bg-[var(--master-blue)] hover:bg-blue-700 text-white rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidgetWithAPI;
