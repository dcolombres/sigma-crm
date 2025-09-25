'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export function ZimbraEmails({ refreshing }) {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/imap/emails');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data.emails);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  useEffect(() => {
    if (refreshing) {
      fetchEmails();
    }
  }, [refreshing, fetchEmails]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link href="/settings" className="text-blue-500 hover:underline">
          Configure your Zimbra/IMAP settings
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {emails.map((email: any, index: number) => (
        <li key={index} className="mb-4 border-b pb-2">
          <div className="flex justify-between items-center mb-1">
            <p className="font-bold text-sm">{email.from}</p>
            <p className="text-xs text-gray-500">{new Date(email.date).toLocaleString()}</p>
          </div>
          <p className="text-sm">{email.subject}</p>
        </li>
      ))}
    </ul>
  );
}
