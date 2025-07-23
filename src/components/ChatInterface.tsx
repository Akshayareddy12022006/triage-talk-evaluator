import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Heart, AlertCircle, CheckCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  severity?: "info" | "warning" | "urgent";
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

export const ChatInterface = ({ onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Healthcare Assistant with PhD-level medical knowledge. I'm here to help with medical triage, health assessments, and provide evidence-based medical guidance. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
      severity: "info"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on your symptoms, I recommend monitoring your condition closely. The symptoms you've described could indicate several possibilities. Let me ask some follow-up questions to better assess your situation: \n\n1. How long have you been experiencing these symptoms?\n2. On a scale of 1-10, how would you rate your pain/discomfort?\n3. Have you noticed any patterns or triggers?",
          severity: "info" as const
        },
        {
          content: "Your symptoms warrant immediate medical attention. Please consider visiting an emergency room or urgent care facility. While I can provide general guidance, these symptoms could indicate a serious condition that requires immediate professional evaluation.",
          severity: "urgent" as const
        },
        {
          content: "Based on current medical literature and clinical guidelines, this appears to be a common condition that typically resolves with proper care. Here's what I recommend: \n\n• Rest and hydration\n• Monitor symptoms\n• Consider over-the-counter pain relief\n• Schedule a follow-up with your primary care physician",
          severity: "info" as const
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.content,
        role: "assistant",
        timestamp: new Date(),
        severity: randomResponse.severity
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "urgent":
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case "warning":
        return <Badge variant="secondary" className="text-xs bg-warning text-warning-foreground">Caution</Badge>;
      case "info":
        return <Badge variant="secondary" className="text-xs bg-success text-success-foreground">Information</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">HealthTriage AI</h1>
              <p className="text-sm text-muted-foreground">PhD-Level Medical Assistant</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Card className="h-full flex flex-col shadow-medium">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-accent-foreground"
                )}>
                  {message.role === "user" ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 shadow-soft",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-card border border-border"
                  )}>
                    <div className="flex items-start justify-between space-x-2 mb-2">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                      {message.role === "assistant" && message.severity && (
                        <div className="flex-shrink-0">
                          {getSeverityIcon(message.severity)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={cn(
                    "flex items-center space-x-2 text-xs text-muted-foreground",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === "assistant" && getSeverityBadge(message.severity)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-soft">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms or ask a medical question..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                variant="medical"
                disabled={!input.trim() || isTyping}
                className="px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This AI assistant provides general health information and is not a substitute for professional medical advice.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};