'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Send, Loader2, MessageCircle, X, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Message {
  sender: { _id: string; name: string };
  message: string;
  timestamp: string;
  isAdmin: boolean;
  isRead: boolean
}

interface DisputeMessagesProps {
  disputeId: string;
  initialMessages: Message[];
  disputeStatus?: string;
  currentUserId?: string; // <-- new optional prop to determine POV
}

export default function DisputeMessages({
  disputeId,
  initialMessages,
  disputeStatus = 'open',
  currentUserId,
}: DisputeMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  console.log('Messages:', messages);
  console.log('Current User ID:', currentUserId);
  
  // Calculate unread count - messages from others that are NOT read
  const unreadCount = messages.filter((m) => {
    const isFromOther = currentUserId && m.sender._id !== currentUserId;
    const notRead = m.isRead === false; // Explicitly check for false
    console.log('Message:', m.message.substring(0, 20), 'isFromOther:', isFromOther, 'isRead:', m.isRead, 'notRead:', notRead);
    return isFromOther && notRead;
  }).length;

  console.log('Unread Count:', unreadCount);

  const canSendMessages = !['resolved', 'closed'].includes(disputeStatus);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mark messages as read when dialog opens
  const markAsRead = async () => {
    try {
      await fetch(`/api/disputes/${disputeId}/messages/read`, {
        method: 'POST',
      });
      
      // Update local state
      setMessages((prev) =>
        prev.map((m) =>
          m.sender._id !== currentUserId ? { ...m, isRead: true } : m
        )
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // When dialog opens, mark messages as read
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        scrollToBottom();
        markAsRead();
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Scroll when new messages arrive and dialog is open
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !canSendMessages) return;

    setSending(true);
    try {
      const response = await fetch(`/api/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setMessages([...messages, data.message]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Support Chat
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Dispute #{disputeId.slice(-8)} • {messages.length} messages
                </DialogDescription>
              </div>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Start the conversation with our support team. We typically respond within 24
                  hours.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isFromCurrentUser = currentUserId && msg.sender._id === currentUserId;
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={msg.isAdmin ? 'dark:bg-sidebar bg-blue-100 text-sm' : 'dark:bg-zinc-800  bg-gray-500 text-sm'}>
                          {isFromCurrentUser ? 'You' : (msg.isAdmin ? '🛠️' : msg.sender.name.charAt(0).toUpperCase())}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col gap-1 max-w-[70%] ${
                          isFromCurrentUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isFromCurrentUser
                              ? 'bg-accent text-primary rounded-tr-none'
                              : msg.isAdmin
                              ? 'bg-muted text-foreground rounded-tl-none'
                              : 'bg-muted text-foreground rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                            {msg.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground px-1">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t px-6 py-4 bg-muted/30">
            {!canSendMessages ? (
              <div className="text-center py-3">
                <p className="text-sm text-muted-foreground">
                  This dispute is {disputeStatus}. You can no longer send messages.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex gap-3">
                <Textarea
                  ref={inputRef}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={2}
                  className="flex-1 resize-none"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="self-end bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}