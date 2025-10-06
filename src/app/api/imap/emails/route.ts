import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

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
    tls: imap_ssl || false,
    tlsOptions: {
      rejectUnauthorized: false
    }
  };

  const fetchEmails = (): Promise<Array<Record<string, unknown>>> => {
    return new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);
      const emails: Array<Record<string, unknown>> = [];

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err) => {
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
            });

            f.on('message', (msg) => {
              msg.on('body', (stream) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.once('end', () => {
                  simpleParser(buffer, (err, parsed) => {
                    if (err) {
                      // ignorar errores de análisis
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
              // Ordenar por fecha descendente para estar seguros
              emails.sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime());
              resolve(emails);
            });
          });
        });
      });

      imap.once('error', (err: Error) => {
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