// components/disputes/DisputeMessages.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  sender: { _id: string; name: string };
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

interface DisputeMessagesProps {
  disputeId: string;
  initialMessages: Message[];
}

export default function DisputeMessages({
  disputeId,
  initialMessages,
}: DisputeMessagesProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

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
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 border rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {msg.isAdmin ? 'A' : msg.sender.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex-1 ${msg.isAdmin ? 'items-start' : 'items-end'} flex flex-col`}
            >
              <Card className={msg.isAdmin ? 'bg-muted' : 'bg-primary text-primary-foreground'}>
                <CardContent className="p-3">
                  <p className="text-sm">{msg.message}</p>
                </CardContent>
              </Card>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDate(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message */}
      <form onSubmit={handleSend} className="flex gap-2">
        <Textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button type="submit" disabled={sending || !newMessage.trim()}>
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}