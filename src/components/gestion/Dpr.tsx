'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dpr.css';

import ChartComponent from './ChartComponent';

import Modal from './Modal';
import './Modal.css';

// Interfaz para un registro de datos genérico
interface DataRecord {
  [key: string]: any;
}

// Define los nombres de las hojas disponibles
type SheetName = 'PROYECTOS' | 'STAFF';

function Dpr() {
  const [sheet, setSheet] = useState<SheetName>('PROYECTOS');
  const [columns, setColumns] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [data, setData] = useState<DataRecord[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, string[]>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Definir columnas por defecto y filtrables
  const defaultColumnsConfig: Record<SheetName, string[]> = {
    PROYECTOS: ['sistema', 'tier', 'estado', 'salud', 'prioridad', 'area'],
    STAFF: ['nombreYApellido', 'rol', 'tecnologia', 'remNetaAbril'],
  };

  const filterableColumnsConfig: Record<SheetName, string[]> = {
    PROYECTOS: ['tier', 'estado', 'salud', 'prioridad', 'area'],
    STAFF: ['rol', 'tecnologia'],
  };

  const chartConfigs: Record<SheetName, { title: string; field: string }[]> = {
    PROYECTOS: [
      { title: 'Distribución por Tier', field: 'tier' },
      { title: 'Distribución por Area', field: 'area' },
    ],
    STAFF: [
      { title: 'Distribución por Rol', field: 'rol' },
      { title: 'Distribución por Tecnologia', field: 'tecnologia' },
    ],
  };

  // Carga las columnas cada vez que se cambia de hoja
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(`/api/gestion/columns?sheet=${sheet}`);
        const fetchedColumns = response.data.columns || [];
        setColumns(fetchedColumns);
        setVisibleColumns(defaultColumnsConfig[sheet]);
        setFilters({}); // Limpia los filtros al cambiar de hoja
      } catch (err) {
        setError('Error al cargar las columnas. Asegúrate de que el backend está corriendo.');
        console.error(err);
      }
    };

    fetchColumns();
  }, [sheet]);

  // Carga las opciones para los desplegables
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const options: Record<string, string[]> = {};
        for (const column of filterableColumnsConfig[sheet]) {
            const response = await axios.get(`/api/gestion/unique-values?sheet=${sheet}&column=${column}`);
            if (Array.isArray(response.data.values)) {
                options[column] = response.data.values;
            }
        }
        setDropdownOptions(options);
      } catch (err) {
        console.error('Error al cargar las opciones de los desplegables:', err);
      }
    };

    fetchDropdownOptions();
  }, [sheet]);

  // Carga los datos filtrados
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Construye los parámetros de filtro, excluyendo los que están vacíos
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      const response = await axios.get(`/api/gestion/filter?sheet=${sheet}`, {
        params: activeFilters,
      });
      
      // Comprobación de seguridad: asegúrate de que la respuesta es un array
      if (Array.isArray(response.data)) {
        setData(response.data);
        setError(null);
      } else {
        // Si no es un array, podría ser un objeto de error del backend
        setData([]);
        const errorMessage = response.data?.error || 'La respuesta del backend no es un formato válido.';
        setError(errorMessage);
        console.error('La respuesta del backend no es un array:', response.data);
      }
    } catch (err) {
      setError('Error al cargar los datos. Asegúrate de que el backend está corriendo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sheet, filters]);

  // Carga los datos al inicio y cuando cambian la hoja o los filtros
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleColumnToggle = (column: string) => {
    setVisibleColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const handleChartClick = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const renderColumnSelector = () => (
    <div className="column-selector">
      <button onClick={() => setIsModalOpen(true)} className="modal-open-button">
        Seleccionar Columnas Visibles
      </button>
    </div>
  );

  const renderFilterControls = () => (
    <div className="filter-controls">
      <div className="filter-header">
        <h3>Filtros para "{sheet}"</h3>
        {renderColumnSelector()}
      </div>
      <div className="filters-grid">
        {columns.map(column => {
          const isFilterable = filterableColumnsConfig[sheet].includes(column);
          return (
            <div key={column} className="filter-item">
              <label htmlFor={column}>{column}</label>
              {isFilterable ? (
                <select
                  id={column}
                  value={filters[column] || ''}
                  onChange={e => handleFilterChange(column, e.target.value)}
                >
                  <option value="">Todos</option>
                  {(dropdownOptions[column] || []).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={column}
                  type="text"
                  value={filters[column] || ''}
                  onChange={e => handleFilterChange(column, e.target.value)}
                  placeholder={`Filtrar por ${column}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="filter-buttons">
        <button onClick={handleApplyFilters}>Aplicar Filtros</button>
        <button onClick={handleClearFilters} className="clear-button">Limpiar Filtros</button>
      </div>
    </div>
  );

  const renderTable = () => {
    if (loading) {
      return <p>Cargando datos...</p>;
    }
    // El error ahora se muestra fuera de la tabla
    if (!Array.isArray(data) || data.length === 0) {
      return <p>No hay datos para mostrar con los filtros actuales.</p>;
    }

    const headers = visibleColumns.length > 0 ? visibleColumns : (data.length > 0 ? Object.keys(data[0]) : []);

    return (
      <table>
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>{String(row[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <main>
        <div className="top-nav">
          <button onClick={() => setSheet('PROYECTOS')} disabled={sheet === 'PROYECTOS'}>Proyectos</button>
          <button onClick={() => setSheet('STAFF')} disabled={sheet === 'STAFF'}>Staff</button>
        </div>
        <div className="controls-container">
          {renderFilterControls()}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="summary-stats">
          {sheet === 'PROYECTOS' ? (
            <h3>Cantidad de Proyectos: {data.length}</h3>
          ) : (
            <h3>Cantidad de Personas en DDS: {data.length}</h3>
          )}
        </div>
        <ChartComponent data={data} chartConfigs={chartConfigs[sheet]} onChartClick={handleChartClick} />
        <div className="table-container">
          {renderTable()}
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="column-checkboxes">
            {columns.map(column => (
              <div key={column} className="column-checkbox-item">
                <input
                  type="checkbox"
                  id={`col-${column}`}
                  checked={visibleColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                <label htmlFor={`col-${column}`}>{column}</label>
              </div>
            ))}
          </div>
        </Modal>
      </main>
    </div>
  );
}

export default Dpr;