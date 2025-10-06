'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface TelegramMessage {
  text: string;
  date: string;
}

export function TelegramMessages({ refreshing }) {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/telegram/messages');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (refreshing) {
      fetchMessages();
    }
  }, [refreshing, fetchMessages]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">Error: {error}</p>
        <Link href="/settings" className="text-blue-500 hover:underline">
          Configure your Telegram Bot Token
        </Link>
      </div>
    );
  }

  return (
    <div>
      {messages && messages.length > 0 ? (
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li key={index} className="text-xs bg-background p-2 rounded-md">
              <p className="font-bold">{new Date(message.date).toLocaleString()}:</p>
              <p>{message.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent messages</p>
      )}
    </div>
  );
}
