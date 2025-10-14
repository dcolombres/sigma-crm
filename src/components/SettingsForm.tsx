'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import toast from 'react-hot-toast';
import { updateApiKey, validateApiKey, validateGitlabApiKey, validateTelegramBotToken, validateGlpiApiKey, validateCaldavCredentials, sendTestTelegramMessage } from '@/lib/actions';
import { Staff } from '@prisma/client';

export function SettingsForm({ staff }: { staff: Staff }) {
  const [state, formAction] = useFormState(updateApiKey, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [redmineApiKey, setRedmineApiKey] = useState(staff.redmine_api_key || '');
  const [redmineUrl, setRedmineUrl] = useState(staff.redmine_url || '');
  const [gitlabApiKey, setGitlabApiKey] = useState(staff.gitlab_api_key || '');
  const [gitlabUrl, setGitlabUrl] = useState(staff.gitlab_url || '');
  const [telegramBotToken, setTelegramBotToken] = useState(staff.telegram_bot_token || '');
  const [telegramChatId, setTelegramChatId] = useState(staff.telegram_chat_id || '');
  const [glpiUrl, setGlpiUrl] = useState(staff.glpi_url || '');
  const [glpiApiKey, setGlpiApiKey] = useState(staff.glpi_api_key || '8faDyoHy3ni5u6FaHc2eOCut56LiLcR7rIL07ZWd');
  const [caldavUrl, setCaldavUrl] = useState(staff.caldav_url || '');
  const [caldavUsername, setCaldavUsername] = useState(staff.caldav_username || '');
  const [caldavPassword, setCaldavPassword] = useState(staff.caldav_password || '');
  const [imapHost, setImapHost] = useState(staff.imap_host || '');
  const [imapPort, setImapPort] = useState(staff.imap_port || '');
  const [imapSsl, setImapSsl] = useState(staff.imap_ssl || false);
  const [zimbraUsername, setZimbraUsername] = useState(staff.zimbra_username || '');
  const [zimbraPassword, setZimbraPassword] = useState(staff.zimbra_password || '');

  const [redmineVisible, setRedmineVisible] = useState(staff.dashboard_card_visibility?.redmine ?? false);
  const [gitlabVisible, setGitlabVisible] = useState(staff.dashboard_card_visibility?.gitlab ?? false);
  const [telegramVisible, setTelegramVisible] = useState(staff.dashboard_card_visibility?.telegram ?? false);
  const [glpiVisible, setGlpiVisible] = useState(staff.dashboard_card_visibility?.glpi ?? false);
  const [caldavVisible, setCaldavVisible] = useState(staff.dashboard_card_visibility?.caldav ?? false);
  const [imapVisible, setImapVisible] = useState(staff.dashboard_card_visibility?.imap ?? false);


  useEffect(() => {
    if (state?.status === 'success') {
      toast.success(state.message);
    }
    if (state?.status === 'error') {
      toast.error(state.message);
    }
  }, [state]);

  const handleValidateRedmine = async () => {
    const result = await validateApiKey(redmineUrl, redmineApiKey);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleValidateGitlab = async () => {
    const result = await validateGitlabApiKey(gitlabApiKey, gitlabUrl);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleValidateTelegram = async () => {
    const result = await validateTelegramBotToken(telegramBotToken);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleSendTestTelegramMessage = async () => {
    const result = await sendTestTelegramMessage(telegramBotToken, telegramChatId);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleValidateGlpi = async () => {
    const result = await validateGlpiApiKey(glpiUrl, glpiApiKey);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleValidateCaldav = async () => {
    const result = await validateCaldavCredentials(caldavUrl, caldavUsername, caldavPassword);
    if (result.status === 'success') {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form ref={formRef} action={formAction} className="bg-white p-8 rounded-lg shadow-md">
      <input type="hidden" name="staffId" value={staff.id} />
      
      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Redmine</h2>
          <div className="flex items-center">
            <label htmlFor="redmine_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="redmine_enabled"
              id="redmine_enabled"
              checked={redmineVisible}
              onChange={(e) => setRedmineVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="redmine_url" className="block text-sm font-medium text-primary mb-1">Redmine URL</label>
          <input
            type="text"
            name="redmine_url"
            id="redmine_url"
            value={redmineUrl}
            onChange={(e) => setRedmineUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!redmineVisible}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="redmine_api_key" className="block text-sm font-medium text-primary mb-1">Redmine API Key</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="redmine_api_key"
              id="redmine_api_key"
              value={redmineApiKey}
              onChange={(e) => setRedmineApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!redmineVisible}
            />
            <button type="button" onClick={handleValidateRedmine} className="px-6 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75" disabled={!redmineVisible}>
              Validar
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Gitlab</h2>
          <div className="flex items-center">
            <label htmlFor="gitlab_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="gitlab_enabled"
              id="gitlab_enabled"
              checked={gitlabVisible}
              onChange={(e) => setGitlabVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="gitlab_url" className="block text-sm font-medium text-primary mb-1">GitLab URL</label>
          <input
            type="text"
            name="gitlab_url"
            id="gitlab_url"
            value={gitlabUrl}
            onChange={(e) => setGitlabUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!gitlabVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="gitlab_api_key" className="block text-sm font-medium text-primary mb-1">GitLab API Key</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="gitlab_api_key"
              id="gitlab_api_key"
              value={gitlabApiKey}
              onChange={(e) => setGitlabApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!gitlabVisible}
            />
            <button type="button" onClick={handleValidateGitlab} className="px-6 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75" disabled={!gitlabVisible}>
              Validar
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Telegram</h2>
          <div className="flex items-center">
            <label htmlFor="telegram_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="telegram_enabled"
              id="telegram_enabled"
              checked={telegramVisible}
              onChange={(e) => setTelegramVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="telegram_bot_token" className="block text-sm font-medium text-primary mb-1">Telegram Bot Token</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="telegram_bot_token"
              id="telegram_bot_token"
              value={telegramBotToken}
              onChange={(e) => setTelegramBotToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!telegramVisible}
            />
            <button type="button" onClick={handleValidateTelegram} className="px-6 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75" disabled={!telegramVisible}>
              Validar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="telegram_chat_id" className="block text-sm font-medium text-primary mb-1">Telegram Chat ID</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="telegram_chat_id"
              id="telegram_chat_id"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!telegramVisible}
            />
            <button type="button" onClick={handleSendTestTelegramMessage} className="px-6 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-75" disabled={!telegramVisible}>
              Enviar Mensaje de Prueba
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">GLPI</h2>
          <div className="flex items-center">
            <label htmlFor="glpi_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="glpi_enabled"
              id="glpi_enabled"
              checked={glpiVisible}
              onChange={(e) => setGlpiVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="glpi_url" className="block text-sm font-medium text-primary mb-1">GLPI URL</label>
          <input
            type="text"
            name="glpi_url"
            id="glpi_url"
            value={glpiUrl}
            onChange={(e) => setGlpiUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!glpiVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="glpi_api_key" className="block text-sm font-medium text-primary mb-1">GLPI API Key</label>
          <div className="flex gap-4">
            <input
              type="text"
              name="glpi_api_key"
              id="glpi_api_key"
              value={glpiApiKey}
              onChange={(e) => setGlpiApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!glpiVisible}
            />
            <button type="button" onClick={handleValidateGlpi} className="px-6 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75" disabled={!glpiVisible}>
              Validar
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">CalDAV</h2>
          <div className="flex items-center">
            <label htmlFor="caldav_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="caldav_enabled"
              id="caldav_enabled"
              checked={caldavVisible}
              onChange={(e) => setCaldavVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="caldav_url" className="block text-sm font-medium text-primary mb-1">CalDAV URL</label>
          <input
            type="text"
            name="caldav_url"
            id="caldav_url"
            value={caldavUrl}
            onChange={(e) => setCaldavUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!caldavVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="caldav_username" className="block text-sm font-medium text-primary mb-1">CalDAV Username</label>
          <input
            type="text"
            name="caldav_username"
            id="caldav_username"
            value={caldavUsername}
            onChange={(e) => setCaldavUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!caldavVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="caldav_password" className="block text-sm font-medium text-primary mb-1">CalDAV Password</label>
          <div className="flex gap-4">
            <input
              type="password"
              name="caldav_password"
              id="caldav_password"
              value={caldavPassword}
              onChange={(e) => setCaldavPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              disabled={!caldavVisible}
            />
            <button type="button" onClick={handleValidateCaldav} className="px-6 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75" disabled={!caldavVisible}>
              Validar
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Zimbra / IMAP</h2>
          <div className="flex items-center">
            <label htmlFor="imap_enabled" className="mr-2">Enable</label>
            <input
              type="checkbox"
              name="imap_enabled"
              id="imap_enabled"
              checked={imapVisible}
              onChange={(e) => setImapVisible(e.target.checked)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="imap_host" className="block text-sm font-medium text-primary mb-1">IMAP Host</label>
          <input
            type="text"
            name="imap_host"
            id="imap_host"
            value={imapHost}
            onChange={(e) => setImapHost(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!imapVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="imap_port" className="block text-sm font-medium text-primary mb-1">IMAP Port</label>
          <input
            type="number"
            name="imap_port"
            id="imap_port"
            value={imapPort}
            onChange={(e) => setImapPort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!imapVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="imap_ssl" className="block text-sm font-medium text-primary mb-1">IMAP SSL</label>
          <input
            type="checkbox"
            name="imap_ssl"
            id="imap_ssl"
            checked={imapSsl}
            onChange={(e) => setImapSsl(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            disabled={!imapVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="zimbra_username" className="block text-sm font-medium text-primary mb-1">Zimbra Username</label>
          <input
            type="text"
            name="zimbra_username"
            id="zimbra_username"
            value={zimbraUsername}
            onChange={(e) => setZimbraUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!imapVisible}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="zimbra_password" className="block text-sm font-medium text-primary mb-1">Zimbra Password</label>
          <input
            type="password"
            name="zimbra_password"
            id="zimbra_password"
            value={zimbraPassword}
            onChange={(e) => setZimbraPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            disabled={!imapVisible}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="submit" className="px-6 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-75">
          Guardar
        </button>
      </div>
    </form>
  );
}
