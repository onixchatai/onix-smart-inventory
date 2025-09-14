
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, CornerDownLeft, X, Loader2 } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { InventoryItem } from '@/api/entities';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm Onix, your smart inventory assistant. How can I help you today? You can ask me about your items, their total value, and more." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
        setTimeout(() => {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const inventoryItems = await InventoryItem.list();
      const prompt = `You are Onix, a helpful AI assistant for an inventory management app. A user has a question about their inventory. Here is their inventory data in JSON format: ${JSON.stringify(inventoryItems)}. Here is the user's question: "${input}". Please answer the user's question based on the provided inventory data. Be friendly, helpful, and concise. If the question is not related to their inventory, you can try to answer it generally or politely state that your main purpose is inventory assistance.`;
      
      const response = await InvokeLLM({ prompt });

      const aiMessage = { sender: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage = { sender: 'ai', text: "I'm sorry, I encountered an error while processing your request. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 hover:scale-110 transition-transform duration-300"
        >
          <Bot className="w-8 h-8" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Onix - AI Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                    )}
                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-100 dark:text-slate-700" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                      </div>
                    </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <form onSubmit={handleSendMessage} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your inventory..."
                  className="pr-12 rounded-full dark:bg-slate-800 dark:border-slate-700"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full w-8 h-8 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  <CornerDownLeft className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
