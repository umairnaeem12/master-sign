import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
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

// Local chatbot responses - completely free, no API needed
const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Service-related questions
  if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
    return "We offer a comprehensive range of signage services including LED Digital Signs, Vehicle Wraps, Laser Engraving, Custom Banners, Architectural Signs, and Installation & Service. What specific service are you interested in?";
  }
  
  if (message.includes('led') || message.includes('digital')) {
    return "Our LED Digital Signs are perfect for businesses looking to make a dynamic impact. We offer indoor and outdoor LED displays, message boards, and video walls. They're energy-efficient and highly visible!";
  }
  
  if (message.includes('vehicle') || message.includes('wrap') || message.includes('car')) {
    return "Vehicle wraps are a great way to turn your car into a moving advertisement! We offer full wraps, partial wraps, and decals. They're durable, weather-resistant, and can last 5-7 years with proper care.";
  }
  
  if (message.includes('laser') || message.includes('engrave')) {
    return "Our laser engraving service works on wood, acrylic, metal, glass, and more. Perfect for personalized gifts, business signage, and industrial applications. We can handle both small and large projects.";
  }
  
  if (message.includes('banner') || message.includes('flag')) {
    return "We create custom banners and flags for all occasions - trade shows, events, business promotions, and more. Available in various sizes and materials with quick turnaround times.";
  }
  
  if (message.includes('architectural') || message.includes('building')) {
    return "Our architectural signs include building identification, wayfinding systems, and dimensional letters. We work with various materials like aluminum, acrylic, and illuminated options.";
  }
  
  // Pricing questions
  if (message.includes('cost') || message.includes('price') || message.includes('how much') || message.includes('quote')) {
    return "Pricing varies based on size, materials, and complexity. For an accurate quote, I'd recommend calling us at (555) 123-4567 or using our online quote form. We offer competitive pricing and can work within your budget!";
  }
  
  // Turnaround time
  if (message.includes('turnaround') || message.includes('how long') || message.includes('time') || message.includes('delivery')) {
    return "Turnaround times vary by project complexity. Simple signs can be ready in 1-3 days, while complex projects may take 1-2 weeks. We'll always give you a realistic timeline when you place your order.";
  }
  
  // Installation
  if (message.includes('install') || message.includes('delivery') || message.includes('setup')) {
    return "Yes, we provide professional installation services! Our team handles everything from site surveys to final installation. We're licensed and insured, and we work with both residential and commercial properties.";
  }
  
  // Materials
  if (message.includes('material') || message.includes('durable') || message.includes('weather')) {
    return "We use high-quality, weather-resistant materials suitable for both indoor and outdoor use. Our materials are UV-resistant, waterproof, and designed to last. We can recommend the best options for your specific needs.";
  }
  
  // Design
  if (message.includes('design') || message.includes('custom') || message.includes('template')) {
    return "We offer custom design services! Our designers can create unique signage that perfectly represents your brand. We also have templates you can customize, or you can use our online design tool to create your own.";
  }
  
  // Contact
  if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('location')) {
    return "You can reach us at (555) 123-4567 or email info@mastersigns.com. We're located at 123 Sign Street, City, State. We're open Monday-Friday 8AM-6PM and Saturday 9AM-3PM.";
  }
  
  // Hours
  if (message.includes('hours') || message.includes('open') || message.includes('when')) {
    return "We're open Monday-Friday 8AM-6PM and Saturday 9AM-3PM. We're closed on Sundays. For urgent projects, we can arrange after-hours consultations.";
  }
  
  // General greeting
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm your Master Signs assistant. I'm here to help you with any questions about our signage services. What would you like to know?";
  }
  
  // Help
  if (message.includes('help') || message.includes('support')) {
    return "I'm here to help! I can answer questions about our services, pricing, turnaround times, and more. Just ask me anything about signage!";
  }
  
  // Default response
  return "That's a great question! While I can help with general information about our signage services, for specific details about your project, I'd recommend calling us at (555) 123-4567 or visiting our website. What other questions do you have about our services?";
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Master Signs assistant. How can I help you with your signage needs today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    // Simulate typing delay for better UX
    setTimeout(() => {
      const botResponse = getBotResponse(text.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
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
          className="fixed bottom-16 sm:bottom-24 right-4 sm:right-8 z-[9999] w-80 sm:w-96 h-[400px] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-[var(--master-blue)] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Master Signs Assistant</h3>
                <p className="text-sm text-blue-100">AI-powered support</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMessages([{
                    id: '1',
                    text: "Hi! I'm your Master Signs assistant. How can I help you with your signage needs today?",
                    sender: 'bot',
                    timestamp: new Date()
                  }]);
                  setInputText('');
                }}
                className="text-white hover:bg-blue-700 rounded-full"
                title="New Chat"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMessages([{
                    id: '1',
                    text: "Hi! I'm your Master Signs assistant. How can I help you with your signage needs today?",
                    sender: 'bot',
                    timestamp: new Date()
                  }]);
                  setInputText('');
                }}
                className="text-white hover:bg-blue-700 rounded-full"
                title="Clear Chat"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
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
          <div className="flex-1 p-4 overflow-y-auto min-h-0 flex-shrink">
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
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${
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
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-xs text-gray-500 ml-2">Typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-3">
              <p className="text-xs text-gray-500 mb-3 font-medium">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 text-left border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit} className="flex space-x-2">
                             <input
                 type="text"
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="Type your message..."
                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--master-blue)] focus:border-transparent text-gray-900 bg-white"
                 disabled={isLoading}
                 autoFocus
                 style={{
                   color: '#111827',
                   backgroundColor: '#ffffff',
                   zIndex: 1000,
                   position: 'relative'
                 }}
               />
                             <Button
                 type="submit"
                 size="icon"
                 disabled={isLoading || !inputText.trim()}
                 className="bg-[var(--master-blue)] hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ChatWidget;
