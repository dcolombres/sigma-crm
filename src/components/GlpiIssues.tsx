'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export function GlpiIssues({ refreshing }) {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/glpi/issues');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch issues');
      }
      const data = await response.json();
      setIssues(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    if (refreshing) {
      fetchIssues();
    }
  }, [refreshing, fetchIssues]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link href="/settings" className="text-blue-500 hover:underline">
          Configure your GLPI API key and URL
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {issues.map((issue: any) => (
        <li key={issue.id} className="mb-2">
          <a href={`https://glpi.produccion.gob.ar/front/ticket.form.php?id=${issue.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            #{issue.id}: {issue.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
