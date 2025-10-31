import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

import * as fs from 'fs';
import * as path from 'path';

async function getAuth() {
  const credentialsPath = path.join(process.cwd(), 'src', 'dpr-sigma-35f84791aa74.json');
  const credentialsJson = fs.readFileSync(credentialsPath, 'utf-8');

  const credentials = JSON.parse(credentialsJson);

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  return auth;
}

export async function getSheetData(sheetName: string) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SHEETS_DOCUMENT_ID;
  const range = `${sheetName}!A:Z`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
}
