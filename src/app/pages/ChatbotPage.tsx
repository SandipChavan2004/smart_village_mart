import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Bot, User, Search, Store, MapPin, TrendingDown, ShoppingBag, HelpCircle } from 'lucide-react';
import api from '../../lib/api';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product-card' | 'shop-card' | 'action-buttons';
  data?: any;
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! 👋 Welcome to Smart Village Mart - your guide to discovering local village shops and products. I can help you:\n\n🔍 Find products in nearby shops\n🏪 Locate shops by category\n💰 Compare prices across shops\n📍 Get shop addresses and contact info\n\nHow can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get bot response
    setTimeout(async () => {
      const response = await getBotResponse(inputMessage);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = async (userMessage: string): Promise<Message> => {
    const lowerMessage = userMessage.toLowerCase();

    // Product search queries
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('show')) {
      const productKeywords = ['rice', 'wheat', 'oil', 'sugar', 'flour', 'dal', 'masoor', 'toor', 'chana'];
      const foundKeyword = productKeywords.find(keyword => lowerMessage.includes(keyword));

      if (foundKeyword) {
        try {
          const response = await api.get('/products');
          const matchingProducts = response.data.filter((p: any) =>
            p.name.toLowerCase().includes(foundKeyword)
          ).slice(0, 3);

          if (matchingProducts.length > 0) {
            return {
              id: Date.now(),
              text: `I found ${matchingProducts.length} product(s) matching "${foundKeyword}":`,
              sender: 'bot',
              timestamp: new Date(),
              type: 'product-card',
              data: matchingProducts,
            };
          }
        } catch (error) {
          console.error('Product search error:', error);
        }
      }
    }

    // Shop queries
    if (lowerMessage.includes('shop') || lowerMessage.includes('store') || lowerMessage.includes('seller')) {
      const categories = ['groceries', 'electronics', 'agricultural', 'fashion', 'health'];
      const foundCategory = categories.find(cat => lowerMessage.includes(cat));

      if (foundCategory) {
        return {
          id: Date.now(),
          text: `To find ${foundCategory} shops, I recommend:\n\n1. Visit our Products page\n2. Filter by "${foundCategory}" category\n3. Click on any product to see which shops sell it\n4. View shop details including address and contact info\n\nWould you like me to show you available products?`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'action-buttons',
          data: { action: 'browse-products', category: foundCategory },
        };
      }

      return {
        id: Date.now(),
        text: `You can find shops by:\n\n1. 🔍 Browsing products and seeing which shops sell them\n2. 💰 Using Price Comparison to see all shops for a product\n3. 📍 Viewing shop pages for address and contact details\n\nAll shops are local village stores - just browse online and visit in person!`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action-buttons',
        data: { action: 'quick-actions' },
      };
    }

    // Price comparison
    if (lowerMessage.includes('price') || lowerMessage.includes('compare') || lowerMessage.includes('cheap') || lowerMessage.includes('best deal')) {
      return {
        id: Date.now(),
        text: `💰 To compare prices:\n\n1. Go to our Price Comparison page\n2. Search for the product you want\n3. See prices from all shops side-by-side\n4. Find the shop with the best price\n5. Visit that shop with the address shown\n\nYou can save money by comparing before you visit!`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action-buttons',
        data: { action: 'price-comparison' },
      };
    }

    // How to buy/purchase
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('order') || lowerMessage.includes('how to get')) {
      return {
        id: Date.now(),
        text: `📍 Here's how to get products:\n\n1. Browse products on our platform\n2. Find the product you want\n3. See which shop sells it (with address)\n4. Note the shop's location and phone number\n5. Visit the shop in person to buy\n\n💡 We don't have online delivery - we help you discover what's available in your local village shops!`,
        sender: 'bot',
        timestamp: new Date(),
      };
    }

    // Delivery questions
    if (lowerMessage.includes('deliver') || lowerMessage.includes('shipping') || lowerMessage.includes('courier')) {
      return {
        id: Date.now(),
        text: `📦 Important: Smart Village Mart is a **discovery platform**, not a delivery service.\n\nWe help you:\n✅ Find products in nearby village shops\n✅ Compare prices across shops\n✅ Get shop addresses and contact info\n✅ Discover what's available locally\n\n❌ We don't offer:\n• Online ordering\n• Home delivery\n• Payment processing\n\nSimply browse online, then visit the shop in person! 🏪`,
        sender: 'bot',
        timestamp: new Date(),
      };
    }

    // Shopkeeper registration
    if (lowerMessage.includes('become') || lowerMessage.includes('register') || lowerMessage.includes('shopkeeper') || lowerMessage.includes('join')) {
      return {
        id: Date.now(),
        text: `👨‍💼 Want to list your shop on our platform?\n\n**Steps to register:**\n1. Click "Join as Shopkeeper" on homepage\n2. Fill in your shop details\n3. Upload documents (GSTIN, PAN, License)\n4. Wait for admin approval (1-2 days)\n5. Start adding your products!\n\n**Benefits:**\n✅ Reach more customers\n✅ Free product listings\n✅ Analytics dashboard\n✅ Increase shop visibility`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action-buttons',
        data: { action: 'shopkeeper-register' },
      };
    }

    // Location/address queries
    if (lowerMessage.includes('address') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('near me')) {
      return {
        id: Date.now(),
        text: `📍 To find shop locations:\n\n1. Click on any product\n2. View the shop name\n3. Click on the shop name\n4. See full address, phone, and email\n\nEach shop page shows:\n• Complete address\n• Contact phone number\n• Owner name\n• All products they sell\n\nYou can then visit the shop in person!`,
        sender: 'bot',
        timestamp: new Date(),
      };
    }

    // Payment questions
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('cash')) {
      return {
        id: Date.now(),
        text: `💳 Payment Information:\n\nSince we don't have online ordering, you'll pay directly at the shop when you visit.\n\nMost village shops accept:\n✅ Cash\n✅ UPI/Digital payments\n✅ Cards (some shops)\n\nCheck with the specific shop for their payment methods. You can call them using the phone number on their shop page!`,
        sender: 'bot',
        timestamp: new Date(),
      };
    }

    // Help/how it works
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('work') || lowerMessage.includes('use')) {
      return {
        id: Date.now(),
        text: `🎯 **How Smart Village Mart Works:**\n\n**For Customers:**\n1. Browse products online\n2. Compare prices across shops\n3. Find shop addresses\n4. Visit shops in person to buy\n\n**For Shopkeepers:**\n1. Register your shop\n2. List your products\n3. Get discovered by customers\n4. Manage inventory online\n\n**Key Features:**\n🔍 Product search\n💰 Price comparison\n🏪 Shop discovery\n📍 Location information`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action-buttons',
        data: { action: 'quick-actions' },
      };
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        id: Date.now(),
        text: `Hello${user ? ` ${user.name}` : ''}! 👋\n\nI'm here to help you discover local village shops and products. What would you like to find today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'action-buttons',
        data: { action: 'quick-actions' },
      };
    }

    // Default response
    return {
      id: Date.now(),
      text: `I can help you with:\n\n🔍 Finding products in village shops\n🏪 Locating shops by category\n💰 Comparing prices\n📍 Getting shop addresses\n👨‍💼 Shopkeeper registration\n\nWhat would you like to know?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'action-buttons',
      data: { action: 'quick-actions' },
    };
  };

  const quickQuestions = [
    'Find rice products',
    'Show grocery shops',
    'Compare prices',
    'How to become a shopkeeper?',
    'How does this work?',
  ];

  const renderMessage = (message: Message) => {
    if (message.type === 'product-card' && message.data) {
      return (
        <div className="space-y-2">
          <p className="text-sm mb-3">{message.text}</p>
          {message.data.map((product: any) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="block bg-white border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/60'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.shop_name}</p>
                  <p className="text-emerald-600 font-semibold">₹{product.price}</p>
                </div>
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
          <Link to="/products" className="text-emerald-600 text-sm hover:underline inline-block mt-2">
            View all products →
          </Link>
        </div>
      );
    }

    if (message.type === 'action-buttons' && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm whitespace-pre-line">{message.text}</p>
          <div className="flex flex-wrap gap-2">
            {message.data.action === 'quick-actions' && (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link to="/products">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/price-comparison">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Compare Prices
                  </Link>
                </Button>
              </>
            )}
            {message.data.action === 'browse-products' && (
              <Button asChild size="sm">
                <Link to="/products">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            )}
            {message.data.action === 'price-comparison' && (
              <Button asChild size="sm">
                <Link to="/price-comparison">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Go to Price Comparison
                </Link>
              </Button>
            )}
            {message.data.action === 'shopkeeper-register' && (
              <Button asChild size="sm">
                <Link to="/shopkeeper-login">
                  <Store className="h-4 w-4 mr-2" />
                  Register as Shopkeeper
                </Link>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-line">{message.text}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Chat Support"
        description="Get instant help with Smart Village Mart. Find products, locate shops, compare prices, and learn how to use our platform."
        keywords="chat support, help, customer service, smart village mart"
      />
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[700px] flex flex-col shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-emerald-100/50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-lg">Smart Village Mart Assistant</span>
                    <p className="text-xs text-gray-600 font-normal">Always here to help you discover local shops</p>
                  </div>
                </div>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%]`}>
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${message.sender === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                      {renderMessage(message)}
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Quick Questions */}
            <div className="border-t p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2 font-medium">Quick questions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setInputMessage(question);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) {
                          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }
                      }, 100);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about products or shops..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
