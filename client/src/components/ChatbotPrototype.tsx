import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User, ShoppingBag, Package, RotateCcw, Search, SendHorizontal, ArrowRight, ThumbsUp } from 'lucide-react';

// Interfaces for our chat component
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'products' | 'order' | 'buttons';
  products?: Product[];
  order?: Order;
  buttons?: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  type?: 'cross-sell' | 'up-sell' | 'related';
  reason?: string;
}

interface Order {
  id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  items: { product: Product; quantity: number }[];
  tracking?: string;
  estimatedDelivery?: Date;
}

export default function ChatbotPrototype() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! I\'m your shopping assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'buttons',
      buttons: ['Find products', 'Check order status', 'Browse recent items', 'Help with returns']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinueShopping, setShowContinueShopping] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample data for demonstration
  const sampleProducts: Product[] = [
    {
      id: 'p1',
      name: 'Wireless Noise-Cancelling Headphones',
      price: 199.99,
      image: 'https://placehold.co/100x100/333/white?text=Headphones',
      description: 'Premium over-ear headphones with active noise cancellation.',
    },
    {
      id: 'p2',
      name: 'Bluetooth Earbuds',
      price: 89.99,
      image: 'https://placehold.co/100x100/333/white?text=Earbuds',
      description: 'Compact earbuds with crystal-clear sound quality.',
      type: 'related',
      reason: 'Popular with people who viewed headphones'
    },
    {
      id: 'p3',
      name: 'Premium Headphone Stand',
      price: 34.99,
      image: 'https://placehold.co/100x100/333/white?text=Stand',
      description: 'Elegant stand to display and store your headphones.',
      type: 'cross-sell',
      reason: 'Perfect accessory for your headphones'
    },
    {
      id: 'p4',
      name: 'Pro Audio Studio Headphones',
      price: 299.99,
      image: 'https://placehold.co/100x100/333/white?text=Pro+Headphones',
      description: 'Professional-grade studio headphones for audiophiles.',
      type: 'up-sell',
      reason: 'Upgrade option with better sound quality'
    }
  ];

  const sampleOrder: Order = {
    id: 'ORD-12345',
    status: 'shipped',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    items: [
      { product: sampleProducts[0], quantity: 1 },
      { product: sampleProducts[2], quantity: 1 }
    ],
    tracking: 'TRK-7890123',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle user input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Process input with NLP (simulated)
    setTimeout(() => {
      handleBotResponse(input);
      setIsTyping(false);
    }, 1500);
  };

  // Handle predefined button clicks
  const handleButtonClick = (text: string) => {
    // Add user message for the button click
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Process button click
    setTimeout(() => {
      handleBotResponse(text);
      setIsTyping(false);
    }, 1000);
  };

  // Handle continue shopping (pick up where left off)
  const handleContinueShopping = () => {
    setShowContinueShopping(false);
    setIsTyping(true);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: "I noticed you were looking at headphones during your last visit. Would you like to continue browsing?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'products',
        products: [sampleProducts[0], sampleProducts[1]]
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle simulated bot responses
  const handleBotResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase();
    
    // Simple NLP logic for demonstration
    if (lowercaseInput.includes('headphone') || lowercaseInput.includes('earphone') || lowercaseInput.includes('find product')) {
      // Product search response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'Here are some headphones that match what you\'re looking for:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'products',
        products: [sampleProducts[0], sampleProducts[1]]
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Follow up with recommendations after a delay
      setTimeout(() => {
        const recommendationMessage: Message = {
          id: Date.now().toString(),
          text: 'You might also be interested in these related items:',
          sender: 'bot',
          timestamp: new Date(),
          type: 'products',
          products: [sampleProducts[2], sampleProducts[3]]
        };
        setMessages(prev => [...prev, recommendationMessage]);
      }, 2000);
    } 
    else if (lowercaseInput.includes('order') || lowercaseInput.includes('track') || lowercaseInput.includes('package') || lowercaseInput.includes('check order status')) {
      // Order tracking response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'I found your recent order:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'order',
        order: sampleOrder
      };
      setMessages(prev => [...prev, botMessage]);
    } 
    else if (lowercaseInput.includes('return') || lowercaseInput.includes('refund') || lowercaseInput.includes('help with return')) {
      // Return/refund response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'I can help you process a return. For which order would you like to request a return?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'buttons',
        buttons: ['Order #ORD-12345', 'Order #ORD-67890', 'Different order']
      };
      setMessages(prev => [...prev, botMessage]);
    }
    else if (lowercaseInput.includes('browse recent') || lowercaseInput.includes('recent item')) {
      // Recently viewed items
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'Here are items you recently viewed:',
        sender: 'bot',
        timestamp: new Date(),
        type: 'products',
        products: [sampleProducts[0], sampleProducts[3]]
      };
      setMessages(prev => [...prev, botMessage]);
    }
    else {
      // Generic response for unrecognized inputs
      const botMessage: Message = {
        id: Date.now().toString(),
        text: 'How else can I assist you with your shopping today?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'buttons',
        buttons: ['Find products', 'Check order status', 'Help with returns', 'Talk to a human']
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  // Function to render different message types
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm">{message.text}</p>;
        
      case 'products':
        return (
          <div>
            <p className="text-sm mb-3">{message.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {message.products?.map(product => (
                <Card key={product.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <div className="flex p-2">
                    <div className="w-20 h-20 flex-shrink-0 mr-3 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h4 className="font-medium text-sm text-neutral-900 dark:text-white">{product.name}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">${product.price.toFixed(2)}</p>
                      
                      {product.type && (
                        <Badge 
                          className={
                            product.type === 'up-sell' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 mt-1 self-start' 
                              : product.type === 'cross-sell'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100 mt-1 self-start'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 mt-1 self-start'
                          }
                        >
                          {product.type === 'up-sell' ? 'Premium Option' : 
                           product.type === 'cross-sell' ? 'Goes Well With' : 
                           'Related Item'}
                        </Badge>
                      )}
                      
                      {product.reason && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{product.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                      <Button size="sm" className="text-xs">Add to Cart</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 'order':
        return (
          <div>
            <p className="text-sm mb-3">{message.text}</p>
            <Card className="p-3 border border-neutral-200 dark:border-neutral-700">
              <div className="mb-3 flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Order #{message.order?.id}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Placed on {message.order?.date.toLocaleDateString()}
                  </p>
                </div>
                <Badge className={
                  message.order?.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  message.order?.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                  message.order?.status === 'processing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }>
                  {message.order?.status.charAt(0).toUpperCase() + message.order?.status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-3">
                {message.order?.items.map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-10 h-10 flex-shrink-0 mr-2 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {message.order?.status === 'shipped' && (
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                  <p className="text-sm font-medium">Tracking Information</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tracking #: {message.order?.tracking}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Estimated delivery: {message.order?.estimatedDelivery?.toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Package className="mr-1 h-3 w-3" />
                      Track Package
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Return Items
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        );
        
      case 'buttons':
        return (
          <div>
            <p className="text-sm mb-3">{message.text}</p>
            <div className="flex flex-wrap gap-2">
              {message.buttons?.map((button, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleButtonClick(button)}
                >
                  {button}
                </Button>
              ))}
            </div>
          </div>
        );
        
      default:
        return <p className="text-sm">{message.text}</p>;
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-md mx-auto border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-lg">
      {/* Chatbot header */}
      <div className="flex items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <Avatar className="h-8 w-8 mr-2 bg-primary">
          <Bot className="h-4 w-4 text-white" />
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">Shop Assistant</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Online</p>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Continue shopping banner (pick up where left off) */}
      {showContinueShopping && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 text-primary mr-2" />
              <p className="text-xs text-neutral-700 dark:text-neutral-200">Continue your shopping journey?</p>
            </div>
            <Button 
              size="sm" 
              className="text-xs h-7"
              onClick={handleContinueShopping}
            >
              Resume
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              flex max-w-[85%]
              ${message.sender === 'user' 
                ? 'flex-row-reverse' 
                : 'flex-row'
              }
            `}>
              <div className={`
                flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                ${message.sender === 'user' 
                  ? 'ml-2 bg-primary' 
                  : 'mr-2 bg-neutral-200 dark:bg-neutral-700'
                }
              `}>
                {message.sender === 'user' 
                  ? <User className="h-4 w-4 text-white" /> 
                  : <Bot className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
                }
              </div>
              
              <div className={`
                rounded-lg p-3
                ${message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                }
                ${message.type !== 'text' ? 'max-w-[300px]' : ''}
              `}>
                {renderMessageContent(message)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Bot is typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-2 bg-neutral-200 dark:bg-neutral-700">
                <Bot className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
              </div>
              <div className="rounded-lg p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{animationDelay: '300ms'}}></div>
                  <div className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{animationDelay: '600ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 bg-white dark:bg-neutral-800">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Button type="button" variant="ghost" className="h-10 w-10 p-0 mr-1 rounded-full">
            <Search className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button type="submit" className="h-10 w-10 p-0 ml-1 rounded-full">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}