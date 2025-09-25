'use client';

import { RedmineIssues } from './RedmineIssues';
import { GitlabActivity } from './GitlabActivity';
import { TelegramMessages } from './TelegramMessages';
import { CalendarEvents } from './CalendarEvents';
import { ZimbraEmails } from './ZimbraEmails';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Card = ({ title, children, onRefresh }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleRefresh = (e) => {
    e.stopPropagation();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={handleRefresh} className="p-1 rounded-full hover:bg-slate-100">
              <ArrowPathIcon className="h-5 w-5 text-slate-500" />
            </button>
          )}
          <button className="p-1 rounded-full hover:bg-slate-100">
            {isOpen ? <ChevronUpIcon className="h-5 w-5 text-slate-500" /> : <ChevronDownIcon className="h-5 w-5 text-slate-500" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 1000); // Simulate a refresh
  };

  const visibility = user?.dashboard_card_visibility || {};

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="p-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Dashboard</h2>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-8/12 px-4">
            <div className="grid grid-cols-1 gap-8">
              {visibility.redmine && (
                <Card title="Mis tickets de RedMine pendientes" onRefresh={() => handleRefresh(setRefreshing)}>
                  <RedmineIssues refreshing={refreshing} />
                </Card>
              )}
              {visibility.imap && (
                <Card title="Ultimos mails" onRefresh={() => handleRefresh(setRefreshing)}>
                  <ZimbraEmails refreshing={refreshing} />
                </Card>
              )}
              {visibility.caldav && (
                <Card title="Mi Agenda" onRefresh={() => handleRefresh(setRefreshing)}>
                  <CalendarEvents refreshing={refreshing} />
                </Card>
              )}
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="grid grid-cols-1 gap-8">
              {visibility.gitlab && (
                <Card title="git.produccion" onRefresh={() => handleRefresh(setRefreshing)}>
                  <GitlabActivity refreshing={refreshing} />
                </Card>
              )}
              {visibility.telegram && (
                <Card title="Telegram" onRefresh={() => handleRefresh(setRefreshing)}>
                  <TelegramMessages refreshing={refreshing} />
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;