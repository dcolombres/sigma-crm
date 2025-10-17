'use client';

import { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { PieChart, BarChart } from '@mui/x-charts';

interface ChartData {
  id: string | number;
  value: number;
  label: string;
  [key: string]: string | number | Date | null | undefined;
}

interface DashboardVisibility {
  redmine?: boolean;
  gitlab?: boolean;
  telegram?: boolean;
  glpi?: boolean;
  caldav?: boolean;
  imap?: boolean;
}

const Card = ({ title, children, onRefresh }: { title: string, children: ReactNode, onRefresh?: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  // FIX: Added type React.MouseEvent to the event parameter
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="panel panel-default">
      <div className="panel-heading flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="panel-title">{title}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={handleRefresh}>
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}
          <button className="panel-toggle">
            {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="panel-body">
          {children}
        </div>
      )}
    </div>
  );
};

const PieChartCard = ({ title, data }: { title: string, data: ChartData[] }) => {
  if (!data || data.length === 0) {
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{title}</h3>
            </div>
            <div className="panel-body flex items-center justify-center h-[250px]">
                <p className="text-muted">No hay datos para mostrar.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{title}</h3>
        </div>
        <div className="panel-body" style={{ width: '100%', height: 250 }}>
            <PieChart
                series={[
                    {
                        data: data,
                        innerRadius: 60,
                        outerRadius: 80,
                        paddingAngle: 2,
                        cornerRadius: 5,
                        highlightScope: { fade: 'global', highlight: 'item' },
                    },
                ]}
            />
        </div>
    </div>
  );
};

const BarChartCard = ({ title, data }: { title: string, data: ChartData[] }) => {
    if (!data || data.length === 0) {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">{title}</h3>
                </div>
                <div className="panel-body flex items-center justify-center h-[250px]">
                    <p className="text-muted">No hay datos para mostrar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{title}</h3>
            </div>
            <div className="panel-body" style={{ width: '100%', height: 250 }}>
                <BarChart
                    dataset={data}
                    yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                    series={[{ dataKey: 'value', layout: 'horizontal' }]}
                    layout="horizontal"
                />
            </div>
        </div>
    );
};

interface DashboardProps {
  visibility: DashboardVisibility;
  roleChartData: ChartData[];
  infraChartData: ChartData[];
  dbChartData: ChartData[];
  tierChartData: ChartData[];
}

const Dashboard = ({ visibility, roleChartData, infraChartData, dbChartData, tierChartData }: DashboardProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = (setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 1000);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="p-8">
        <h1 className="h1">Dashboard</h1>

        {/* Global Charts Section */}
        <div className="mb-8">
            <h2 className="h2">Estadísticas Globales</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChartCard title="Roles de Staff" data={roleChartData} />
                <PieChartCard title="Distribución por Tier" data={tierChartData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <PieChartCard title="Alojamiento de Infraestructura" data={infraChartData} />
                <PieChartCard title="Bases de Datos" data={dbChartData} />
            </div>
        </div>

        {/* User-specific Cards Section - NOW SINGLE COLUMN */}
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
  );
};

export default Dashboard;