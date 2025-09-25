'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getNumberOrNull } from '@/lib/utils';

export async function assignStaff(formData: FormData) {
  const id_proyecto = Number(formData.get('id_proyecto'));
  const id_staff = Number(formData.get('id_staff'));

  if (!id_proyecto || !id_staff) return;

  await prisma.proyectoStaff.create({
    data: { id_proyecto, id_staff },
  });

  revalidatePath(`/proyectos/${id_proyecto}`);
}

export async function unassignStaff(formData: FormData) {
  const id_proyecto = Number(formData.get('id_proyecto'));
  const id_staff = Number(formData.get('id_staff'));

  if (!id_proyecto || !id_staff) return;

  await prisma.proyectoStaff.delete({
    where: {
      id_proyecto_id_staff: {
        id_proyecto,
        id_staff,
      },
    },
  });
  revalidatePath(`/proyectos/${id_proyecto}`);
}

export async function deleteProject(id_proyecto: number) {
  await prisma.proyecto.delete({ where: { id: id_proyecto } });
  revalidatePath('/');
  redirect('/');
}

export async function createOrUpdateTecnologia(prevState: any, formData: FormData) {
  const id_proyecto = Number(formData.get('id_proyecto'));

  if (!id_proyecto) {
    return { status: 'error', message: 'Project not found.' };
  }

  try {
    const existingTecnologia = await prisma.tecnologia.findUnique({
      where: { id_proyecto: id_proyecto },
    });

    const data = {
      id_proyecto: id_proyecto,
      id_control_versiones: getNumberOrNull(formData.get('id_control_versiones')),
      changelog: formData.get('changelog') === 'on',
      url_changelog: formData.get('url_changelog') as string,
      id_alojamiento_infra: getNumberOrNull(formData.get('id_alojamiento_infra')),
      id_alojamiento_infra_db: getNumberOrNull(formData.get('id_alojamiento_infra_db')),
      mantenimiento_soporte: formData.get('mantenimiento_soporte') === 'on',
      id_status_pmo: getNumberOrNull(formData.get('id_status_pmo')),
      id_status_salud: getNumberOrNull(formData.get('id_status_salud')),
      anio_inicio_sistema: getNumberOrNull(formData.get('anio_inicio_sistema')),
      usuarios_internos: getNumberOrNull(formData.get('usuarios_internos')),
      usuarios_externos: getNumberOrNull(formData.get('usuarios_externos')),
    };

    if (existingTecnologia) {
      await prisma.tecnologia.update({
        where: { id: existingTecnologia.id },
        data: data,
      });
    } else {
      await prisma.tecnologia.create({
        data: data,
      });
    }

    revalidatePath(`/proyectos/${id_proyecto}`);
    return { status: 'success', message: 'Tecnología guardada correctamente.' };
  } catch (error) {
    return { status: 'error', message: 'Error al guardar la tecnología.' };
  }
}

export async function deleteTecnologia(id_proyecto: number) {
  await prisma.tecnologia.delete({ where: { id_proyecto: id_proyecto } });
  revalidatePath(`/proyectos/${id_proyecto}`);
}

export async function updateApiKey(prevState: any, formData: FormData) {
  console.log('Form data:', Object.fromEntries(formData.entries()));
  const userId = Number(formData.get('userId'));
  const redmineApiKey = formData.get('redmine_api_key') as string;
  const redmineUrl = formData.get('redmine_url') as string;
  const gitlabApiKey = formData.get('gitlab_api_key') as string;
  const gitlabUrl = formData.get('gitlab_url') as string;
  const telegramBotToken = formData.get('telegram_bot_token') as string;
  const telegramChatId = formData.get('telegram_chat_id') as string;
  const glpiUrl = formData.get('glpi_url') as string;
  const glpiApiKey = formData.get('glpi_api_key') as string;
  const caldavUrl = formData.get('caldav_url') as string;
  const caldavUsername = formData.get('caldav_username') as string;
  const caldavPassword = formData.get('caldav_password') as string;
  const imapHost = formData.get('imap_host') as string;
  const imapPort = Number(formData.get('imap_port'));
  const imapSsl = formData.get('imap_ssl') === 'on';
  const zimbraUsername = formData.get('zimbra_username') as string;
  const zimbraPassword = formData.get('zimbra_password') as string;

  const redmineEnabled = formData.get('redmine_enabled') === 'on';
  const gitlabEnabled = formData.get('gitlab_enabled') === 'on';
  const telegramEnabled = formData.get('telegram_enabled') === 'on';
  const glpiEnabled = formData.get('glpi_enabled') === 'on';
  const caldavEnabled = formData.get('caldav_enabled') === 'on';
  const imapEnabled = formData.get('imap_enabled') === 'on';

  if (!userId) {
    return { status: 'error', message: 'User not found.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { 
        redmine_api_key: redmineApiKey,
        redmine_url: redmineUrl,
        gitlab_api_key: gitlabApiKey,
        gitlab_url: gitlabUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
        glpi_url: glpiUrl,
        glpi_api_key: glpiApiKey,
        caldav_url: caldavUrl,
        caldav_username: caldavUsername,
        caldav_password: caldavPassword,
        imap_host: imapHost,
        imap_port: imapPort,
        imap_ssl: imapSsl,
        zimbra_username: zimbraUsername,
        zimbra_password: zimbraPassword,
        dashboard_card_visibility: {
          redmine: redmineEnabled,
          gitlab: gitlabEnabled,
          telegram: telegramEnabled,
          glpi: glpiEnabled,
          caldav: caldavEnabled,
          imap: imapEnabled,
        },
      },
    });
    revalidatePath('/integrations');
    return { status: 'success', message: 'API Key guardada correctamente.' };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: `Error al guardar la API Key: ${error.message}` };
  }
}

export async function validateApiKey(redmineUrl: string, apiKey: string) {
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

export async function searchProjects(query: string) {
  if (!query) {
    return [];
  }

  const projects = await prisma.proyecto.findMany({
    where: {
      titulo: {
        contains: query,
      },
    },
    take: 10, // Limitar el número de resultados
    select: {
      id: true,
      titulo: true,
    },
  });

  return projects;
}