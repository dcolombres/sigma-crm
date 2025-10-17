import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required.' }, { status: 400 });
  }

  const staff = await prisma.staff.findFirst();

  if (!staff || !staff.gitlab_api_key || !staff.gitlab_url) {
    return NextResponse.json({ error: 'GitLab API key or URL not configured.' }, { status: 401 });
  }

  try {
    const response = await fetch(`${staff.gitlab_url}/api/v4/projects/${projectId}/repository/commits`, {
      headers: {
        'PRIVATE-TOKEN': staff.gitlab_api_key,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch commits from GitLab.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}