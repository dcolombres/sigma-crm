import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.staff.findUnique({ where: { email: session.user.email } });

  if (!user || !user.glpi_url || !user.glpi_api_key) {
    return NextResponse.json({ error: 'GLPI URL or API key not configured.' }, { status: 401 });
  }

  const { glpi_url, glpi_api_key, glpi_app_token } = user;
  const baseUrl = glpi_url.endsWith('/') ? glpi_url.slice(0, -1) : glpi_url;
  const apiUrl = `${baseUrl}/apirest.php`;

  try {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `user_token ${glpi_api_key}`,
    };

    if (glpi_app_token) {
      headers['App-Token'] = glpi_app_token;
    }

    // 1. Init Session to get session_token
    const sessionResponse = await fetch(`${apiUrl}/initSession`, {
      method: 'GET',
      headers: headers,
    });

    if (!sessionResponse.ok) {
      console.error('GLPI initSession failed:', await sessionResponse.text());
      return NextResponse.json({ error: 'Failed to initiate GLPI session.' }, { status: sessionResponse.status });
    }

    const sessionData = await sessionResponse.json();
    const session_token = sessionData.session_token;

    const sessionHeaders = {
        'Content-Type': 'application/json',
        'Session-Token': session_token,
    };

    if (glpi_app_token) {
        sessionHeaders['App-Token'] = glpi_app_token;
    }

    // 2. Get current user id
    const userResponse = await fetch(`${apiUrl}/getFullSession`, {
        method: 'GET',
        headers: sessionHeaders,
    });

    if (!userResponse.ok) {
        console.error('GLPI getFullSession failed:', await userResponse.text());
        return NextResponse.json({ error: 'Failed to get user from GLPI.' }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const userId = userData.session.glpiID;


    // 3. Fetch tickets
    // We are fetching tickets that are assigned to the user and are in a pending state.
    // GLPI API uses numeric IDs for fields and statuses. We assume:
    // - '4' is the field for the assigned user (users_id_recipient)
    // - '12' is the field for the status.
    // - Statuses '1' (New), '2' (Processing (assigned)), '3' (Processing (planned)) are considered pending.
    const ticketsResponse = await fetch(`${apiUrl}/search/Ticket?is_deleted=0&criteria[0][field]=4&criteria[0][searchtype]=equals&criteria[0][value]=${userId}&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=1|2|3`, {
      headers: sessionHeaders,
    });

    if (!ticketsResponse.ok) {
      console.error('GLPI search/Ticket failed:', await ticketsResponse.text());
      return NextResponse.json({ error: 'Failed to fetch tickets from GLPI.' }, { status: ticketsResponse.status });
    }

    const ticketsData = await ticketsResponse.json();

    // 4. Kill Session
    await fetch(`${apiUrl}/killSession`, {
        method: 'GET',
        headers: sessionHeaders,
    });

    return NextResponse.json(ticketsData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}