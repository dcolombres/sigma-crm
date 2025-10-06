'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface GitlabActivityProps {
  refreshing: boolean;
}

export function GitlabActivity({ refreshing }: GitlabActivityProps) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gitlab/projects');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCommits = useCallback(async () => {
    if (!selectedProject) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/gitlab/commits?project_id=${selectedProject}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch commits');
      }
      const data = await response.json();
      setCommits(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchCommits();
  }, [fetchCommits]);

  useEffect(() => {
    if (refreshing) {
      fetchProjects();
    }
  }, [refreshing, fetchProjects]);

  if (isLoading && projects.length === 0) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-500">{error}</p>
        <Link href="/settings" className="text-blue-500 hover:underline">
          Configure your GitLab API key and URL
        </Link>
      </div>
    );
  }

  return (
    <div>
      <select onChange={(e) => setSelectedProject(e.target.value)} className="mb-4">
        <option value="">Select a project</option>
        {projects.map((project: { id: string; name: string }) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {isLoading && <p>Loading commits...</p>}

      <ul>
        {commits.map((commit: { id: string; short_id: string; title: string; web_url: string }) => (
          <li key={commit.id} className="mb-2">
            <a href={commit.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {commit.short_id}: {commit.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
