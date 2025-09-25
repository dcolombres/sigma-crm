import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (!user || !user.imap_host || !user.imap_port || !user.zimbra_username || !user.zimbra_password) {
    return NextResponse.json({ error: 'IMAP settings not configured.' }, { status: 401 });
  }

  const { imap_host, imap_port, zimbra_username, zimbra_password, imap_ssl } = user;

  const imapConfig = {
    user: zimbra_username,
    password: zimbra_password,
    host: imap_host,
    port: imap_port,
    tls: imap_ssl,
    tlsOptions: {
      rejectUnauthorized: false
    }
  };

  const fetchEmails = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);
      const emails = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }
          
          imap.search(['ALL'], (err, uids) => {
            if (err) {
              imap.end();
              return reject(err);
            }

            const last10Uids = uids.slice(-10);

            if (last10Uids.length === 0) {
              imap.end();
              return resolve([]);
            }

            const f = imap.fetch(last10Uids, {
              bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)'],
              byUid: true
            });

            f.on('message', (msg, seqno) => {
              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  simpleParser(buffer, (err, parsed) => {
                    if (err) {
                      // ignore parsing errors
                    } else {
                      emails.push({
                        from: parsed.from?.text,
                        subject: parsed.subject,
                        date: parsed.date,
                      });
                    }
                  });
                });
              });
            });

            f.once('error', (err) => {
              imap.end();
              reject(err);
            });

            f.once('end', () => {
              imap.end();
              // Sort by date descending to be sure
              emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              resolve(emails);
            });
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.connect();
    });
  };

  try {
    const emails = await fetchEmails();
    return NextResponse.json({ emails });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch emails.' }, { status: 500 });
  }
}