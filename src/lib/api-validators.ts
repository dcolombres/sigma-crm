import { Buffer } from 'buffer';

export async function validateRedmineApiKey(redmineUrl: string, apiKey: string) {
  if (!apiKey) {
    return { status: 'error', message: 'API Key no puede estar vacía.' };
  }
  if (!redmineUrl) {
    return { status: 'error', message: 'Redmine URL no puede estar vacía.' };
  }

  try {
    const url = new URL('/my/account.json', redmineUrl).toString();
    const response = await fetch(url, {
      headers: {
        'X-Redmine-API-Key': apiKey,
      },
    });

    if (response.ok) {
      return { status: 'success', message: 'API Key válida.' };
    } else {
      return { status: 'error', message: 'API Key inválida.' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al validar la API Key.' };
  }
}

export async function validateGitlabApiKey(apiKey: string, gitlabUrl: string) {
  if (!apiKey) {
    return { status: 'error', message: 'La clave de API de GitLab no puede estar vacía.' };
  }
  if (!gitlabUrl) {
    return { status: 'error', message: 'La URL de GitLab no puede estar vacía.' };
  }

  try {
    const response = await fetch(`${gitlabUrl}/api/v4/user`, {
      headers: {
        'PRIVATE-TOKEN': apiKey,
      },
    });

    if (response.ok) {
      return { status: 'success', message: 'La clave de API de GitLab es válida.' };
    } else {
      return { status: 'error', message: 'La clave de API de GitLab es inválida.' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al validar la clave de API de GitLab.' };
  }
}

export async function validateTelegramBotToken(token: string) {
  if (!token) {
    return { status: 'error', message: 'El token de Telegram no puede estar vacío.' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();

    if (data.ok) {
      return { status: 'success', message: 'El token de Telegram es válido.' };
    } else {
      return { status: 'error', message: 'El token de Telegram es inválido.' };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al validar el token de Telegram.' };
  }
}

export async function validateGlpiApiKey(url: string, apiKey: string) {
  if (!url) {
    return { status: 'error', message: 'La URL de GLPI no puede estar vacía.' };
  }
  if (!apiKey) {
    return { status: 'error', message: 'La clave de API de GLPI no puede estar vacía.' };
  }

  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const apiUrl = `${baseUrl}/apirest.php`;

  try {
    const response = await fetch(`${apiUrl}/initSession`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `user_token ${apiKey}`,
      },
    });

    if (response.ok) {
      const sessionData = await response.json();
      if (sessionData.session_token) {
        // Cerrar la sesión inmediatamente después de la validación
        await fetch(`${apiUrl}/killSession`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': sessionData.session_token,
          },
        });
        return { status: 'success', message: 'La clave de API de GLPI es válida.' };
      }
    }
    return { status: 'error', message: 'La clave de API de GLPI es inválida.' };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al validar la clave de API de GLPI.' };
  }
}

export async function validateCaldavCredentials(url: string, username: string, password: string) {
  if (!url) {
    return { status: 'error', message: 'La URL de CalDAV no puede estar vacía.' };
  }
  if (!username) {
    return { status: 'error', message: 'El nombre de usuario de CalDAV no puede estar vacío.' };
  }
  if (!password) {
    return { status: 'error', message: 'La contraseña de CalDAV no puede estar vacía.' };
  }

  try {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const response = await fetch(url, {
      method: 'PROPFIND',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${auth}`,
        'Depth': '0',
      },
      body: `<?xml version="1.0" encoding="utf-8" ?>
<D:propfind xmlns:D="DAV:" xmlns:CS="http://calendarserver.org/ns/">
  <D:prop>
    <D:current-user-principal/>
    <D:resourcetype/>
    <D:owner/>
    <CS:getctag/>
  </D:prop>
</D:propfind>`,
    });

    if (response.ok) {
      return { status: 'success', message: 'Credenciales de CalDAV válidas.' };
    } else {
      return { status: 'error', message: `Credenciales de CalDAV inválidas. El servidor respondió con: ${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al validar las credenciales de CalDAV.' };
  }
}

export async function sendTestTelegramMessage(botToken: string, chatId: string) {
  if (!botToken || !chatId) {
    return { status: 'error', message: 'Bot Token y Chat ID no pueden estar vacíos.' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Este es un mensaje de prueba desde SIGMA CRM.',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { status: 'success', message: 'Mensaje de prueba enviado correctamente.' };
    } else {
      return { status: 'error', message: `Error al enviar el mensaje: ${data.description}` };
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'Error al enviar el mensaje de prueba.' };
  }
}
