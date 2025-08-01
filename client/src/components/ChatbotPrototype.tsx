import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, User, ShoppingBag, Package, RotateCcw, Search, SendHorizontal, ArrowRight, ThumbsUp, ShoppingCart, Home, HelpCircle } from 'lucide-react';

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
          <div className="w-full">
            <p className="text-sm mb-3">{message.text}</p>
            <div className="flex flex-col gap-3 mt-2">
              {message.products?.map(product => (
                <Card key={product.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-700 w-full">
                  <div className="flex p-2">
                    <div className="w-16 h-16 flex-shrink-0 mr-3 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                      <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate">{product.name}</h4>
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
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">{product.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-2 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm" className="text-xs">View</Button>
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
          <div className="w-full">
            <p className="text-sm mb-3">{message.text}</p>
            <Card className="p-3 border border-neutral-200 dark:border-neutral-700 w-full">
              <div className="mb-3 flex justify-between items-start">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="font-medium truncate">Order #{message.order?.id}</h4>
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
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {message.order?.status === 'shipped' && (
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                  <p className="text-sm font-medium">Tracking Information</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    Tracking #: {message.order?.tracking}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Delivery: {message.order?.estimatedDelivery?.toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Package className="mr-1 h-3 w-3" />
                      Track
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Return
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        );
        
      case 'buttons':
        return (
          <div className="w-full">
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
    <div className="flex flex-col h-[650px] max-w-md mx-auto border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 shadow-lg">
      {/* Chatbot header */}
      <div className="flex items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <Avatar className="h-8 w-8 mr-2 bg-primary">
          <Bot className="h-4 w-4 text-white" />
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">Shop Assistant</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Online</p>
        </div>
        <div className="ml-auto flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Quick navigation tabs */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 rounded-none h-12">
          <TabsTrigger value="chat" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
            <Bot className="h-4 w-4 mr-1" />
            <span className="text-xs">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
            <ShoppingBag className="h-4 w-4 mr-1" />
            <span className="text-xs">Shop</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
            <Package className="h-4 w-4 mr-1" />
            <span className="text-xs">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Help</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="m-0 p-0 flex flex-col flex-1 h-full">
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
                    rounded-lg p-3 w-full
                    ${message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                    }
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
          
          {/* Quick suggestion buttons */}
          <div className="px-4 py-2 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <Button variant="outline" size="sm" className="text-xs whitespace-nowrap" onClick={() => handleButtonClick("Find products")}>
                <Search className="h-3 w-3 mr-1" />
                Find Products
              </Button>
              <Button variant="outline" size="sm" className="text-xs whitespace-nowrap" onClick={() => handleButtonClick("Check order status")}>
                <Package className="h-3 w-3 mr-1" />
                Track Order
              </Button>
              <Button variant="outline" size="sm" className="text-xs whitespace-nowrap" onClick={() => handleButtonClick("Help with returns")}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Returns
              </Button>
              <Button variant="outline" size="sm" className="text-xs whitespace-nowrap" onClick={() => handleButtonClick("Browse recent items")}>
                <ShoppingBag className="h-3 w-3 mr-1" />
                Recent Items
              </Button>
            </div>
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
        </TabsContent>
        
        <TabsContent value="products" className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          <h3 className="font-medium text-sm mb-3">Featured Products</h3>
          <div className="grid grid-cols-2 gap-3">
            {sampleProducts.map(product => (
              <Card key={product.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <div className="h-24 bg-neutral-100 dark:bg-neutral-800">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">${product.price.toFixed(2)}</p>
                  <Button size="sm" className="w-full mt-2 text-xs">Add to Cart</Button>
                </div>
              </Card>
            ))}
          </div>
          
          <h3 className="font-medium text-sm mb-3 mt-6">Recently Viewed</h3>
          <div className="grid grid-cols-2 gap-3">
            {sampleProducts.slice(0, 2).map(product => (
              <Card key={product.id} className="overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <div className="h-24 bg-neutral-100 dark:bg-neutral-800">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-white truncate">{product.name}</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">${product.price.toFixed(2)}</p>
                  <Button size="sm" className="w-full mt-2 text-xs">Add to Cart</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          <h3 className="font-medium text-sm mb-3">Your Orders</h3>
          <Card className="p-3 border border-neutral-200 dark:border-neutral-700 mb-4">
            <div className="mb-3 flex justify-between items-start">
              <div>
                <h4 className="font-medium">Order #{sampleOrder.id}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Placed on {sampleOrder.date.toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Shipped
              </Badge>
            </div>
            
            <div className="space-y-2 mb-3">
              {sampleOrder.items.map((item, index) => (
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
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
              <p className="text-sm font-medium">Tracking Information</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Tracking #: {sampleOrder.tracking}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Estimated delivery: {sampleOrder.estimatedDelivery?.toLocaleDateString()}
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
          </Card>
          
          <Card className="p-3 border border-neutral-200 dark:border-neutral-700">
            <div className="mb-3 flex justify-between items-start">
              <div>
                <h4 className="font-medium">Order #ORD-67890</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Placed on {new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Delivered
              </Badge>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm">
                <div className="w-10 h-10 flex-shrink-0 mr-2 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
                  <img src={sampleProducts[1].image} alt={sampleProducts[1].name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium">{sampleProducts[1].name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: 1</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
              <div className="mt-2 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs">
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Return Items
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          <h3 className="font-medium text-sm mb-3">How Can We Help?</h3>
          
          <div className="space-y-3">
            <Card className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                  <RotateCcw className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Returns & Refunds</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Request returns and track refunds</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Order Issues</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Missing items or delivery problems</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <ShoppingBag className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Product Support</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Usage guides and troubleshooting</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Contact Human Agent</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Speak with our customer service team</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}