'use client';

import { useState, useEffect, useCallback } from 'react';

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

const ConsoleLogger = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const addLog = useCallback((level: LogLevel, message: any[]) => {
    setTimeout(() => {
      const formattedMessage = message
        .map(msg => {
          if (typeof msg === 'object' && msg !== null) {
            try {
              return JSON.stringify(msg, null, 2);
            } catch (e) {
              return 'Unserializable Object';
            }
          }
          return String(msg);
        })
        .join(' ');

      setLogs(prevLogs => [
        ...prevLogs,
        {
          level,
          message: formattedMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 0);
  }, []);

  useEffect(() => {
    const originalConsole = { ...console };

    const overrideConsole = (level: LogLevel) => {
      const originalMethod = originalConsole[level];
      (console as any)[level] = (...args: any[]) => {
        addLog(level, args);
        originalMethod.apply(console, args);
      };
    };

    const levels: LogLevel[] = ['log', 'warn', 'error', 'info', 'debug'];
    levels.forEach(overrideConsole);

    return () => {
      levels.forEach(level => {
        (console as any)[level] = originalConsole[level];
      });
    };
  }, [addLog]);



  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warn':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-lg h-64 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-2xl z-50 flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-900 rounded-t-lg">
        <h3 className="font-bold text-sm">Console Logs</h3>
        <div>
          <button onClick={() => setLogs([])} className="text-xs text-gray-400 hover:text-white mr-2">Clear</button>
          <button onClick={() => setIsVisible(false)} className="text-xs text-gray-400 hover:text-white">&times;</button>
        </div>
      </div>
      <div className="overflow-y-auto p-2 text-xs flex-grow">
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`flex items-start border-b border-gray-700 py-1 font-mono`}>
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              <span className={`font-bold mr-2 ${getLogColor(log.level)}`}>[{log.level.toUpperCase()}]</span>
              <pre className="whitespace-pre-wrap break-all flex-grow">{log.message}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsoleLogger;
