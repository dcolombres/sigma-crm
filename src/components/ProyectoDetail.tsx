'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Proyecto, Staff, Cliente, Categoria, Subcategoria, Dependencia, Tecnologia, ControlVersiones, StatusPmo, StatusSalud, AlojamientoInfra } from '@prisma/client';
import { useEffect, useRef } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { assignStaff, unassignStaff } from '@/lib/actions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

function DetailItem({ label, value }: DetailItemProps) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div>
      <dt className="text-sm font-medium text-secondary">{label}</dt>
      <dd className="mt-1 text-sm text-primary">{value}</dd>
    </div>
  );
}

const ProyectoPrintable = ({ proyecto }: { proyecto: ProyectoDetailProps['proyecto'] }) => {
  const styles = {
    container: { padding: '32px', backgroundColor: '#ffffff', color: '#2d3436', width: '210mm', minHeight: '297mm' },
    h1: { fontSize: '30px', fontWeight: 'bold', color: '#2d3436' },
    h2: { fontSize: '24px', fontWeight: 'bold', color: '#2d3436', marginTop: '32px', marginBottom: '24px', borderBottom: '2px solid #6c5ce7', paddingBottom: '8px' },
    p: { marginTop: '4px', fontSize: '18px', color: '#636e72' },
    hr: { borderTop: '1px solid #e5e7eb', margin: '32px 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' },
    detailItemLabel: { fontSize: '14px', fontWeight: '500', color: '#636e72' },
    detailItemValue: { marginTop: '4px', fontSize: '14px', color: '#2d3436' },
    ul: { listStyleType: 'none', padding: 0, margin: 0 },
    li: { color: '#2d3436', borderBottom: '1px solid #e5e7eb', padding: '8px 0' },
    liSpan: { fontWeight: '600' },
  };

  const PrintableDetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <div>
        <dt style={styles.detailItemLabel}>{label}</dt>
        <dd style={styles.detailItemValue}>{value}</dd>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>{proyecto.titulo}</h1>
      <p style={styles.p}>{proyecto.storyline}</p>
      
      <h2 style={styles.h2}>Detalles del Proyecto</h2>
      <div style={styles.grid}>
        <PrintableDetailItem label="Categoría" value={proyecto.categoria?.nombre} />
        <PrintableDetailItem label="Subcategoría" value={proyecto.subcategoria?.nombre} />
        <PrintableDetailItem label="Dependencia Origen" value={proyecto.dependenciaOrigen?.nombre} />
        <PrintableDetailItem label="Dependencia Actual" value={proyecto.dependenciaActual?.nombre} />
        <PrintableDetailItem label="Tier" value={proyecto.tier} />
        <PrintableDetailItem label="Estado" value={proyecto.activo ? 'Activo' : 'Inactivo'} />
      </div>

      {proyecto.tecnologia && (
        <>
          <h2 style={styles.h2}>Tecnología</h2>
          <div style={styles.grid}>
            <PrintableDetailItem label="Alojamiento Infra" value={proyecto.tecnologia.alojamientoInfra?.nombre} />
            <PrintableDetailItem label="Alojamiento DB" value={proyecto.tecnologia.alojamientoInfraDB?.nombre} />
            <PrintableDetailItem label="Control de Versiones" value={proyecto.tecnologia.controlVersiones?.nombre} />
            <PrintableDetailItem label="Estado PMO" value={proyecto.tecnologia.statusPmo?.nombre} />
            <PrintableDetailItem label="Salud del Sistema" value={proyecto.tecnologia.statusSalud?.nombre} />
            <PrintableDetailItem label="Año de Inicio" value={proyecto.tecnologia.anio_inicio_sistema} />
            <PrintableDetailItem label="Usuarios Internos" value={proyecto.tecnologia.usuarios_internos} />
            <PrintableDetailItem label="Usuarios Externos" value={proyecto.tecnologia.usuarios_externos} />
          </div>
        </>
      )}

      {proyecto.staff.length > 0 && (
        <>
          <h2 style={styles.h2}>Staff Asignado</h2>
          <ul style={styles.ul}>
            {proyecto.staff.map(s => (
              <li key={s.staff.id} style={styles.li}>
                <span style={styles.liSpan}>{s.staff.nombre_completo}</span> ({s.staff.rol_staff})
              </li>
            ))}
          </ul>
        </>
      )}

      {proyecto.clientes.length > 0 && (
        <>
          <h2 style={styles.h2}>Clientes Asociados</h2>
          <ul style={styles.ul}>
            {proyecto.clientes.map(c => (
              <li key={c.id} style={styles.li}>
                <span style={styles.liSpan}>{c.nombre}</span> ({c.email})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

interface ProyectoDetailProps {
  proyecto: Proyecto & {
    categoria: Categoria | null;
    subcategoria: Subcategoria | null;
    dependenciaOrigen: Dependencia | null;
    dependenciaActual: Dependencia | null;
    tecnologia: (Tecnologia & {
      controlVersiones: ControlVersiones | null;
      statusPmo: StatusPmo | null;
      statusSalud: StatusSalud | null;
      alojamientoInfra: AlojamientoInfra | null;
      alojamientoInfraDB: AlojamientoInfra | null;
    }) | null;
    staff: { staff: Staff }[];
    clientes: Cliente[];
  };
  allStaff: Staff[];
  deleteProjectWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
  deleteTecnologiaWithId: (prevState: { message: string; error: boolean; }, formData: FormData) => Promise<{ message: string; error: boolean; }>;
}

function DeleteProjectButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 font-semibold text-white bg-tag-red rounded-lg shadow-md hover:bg-tag-red/90 disabled:bg-tag-red/50">
      {pending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}

function DeleteTecnologiaButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 text-sm font-semibold text-white bg-tag-red rounded-lg shadow-md hover:bg-tag-red/90 disabled:bg-tag-red/50">
      {pending ? 'Eliminando...' : 'Eliminar Tecnología'}
    </button>
  );
}

export default function ProyectoDetail({ proyecto, allStaff, deleteProjectWithId, deleteTecnologiaWithId }: ProyectoDetailProps) {
  const router = useRouter();
  const initialState = { message: "", error: false };
  const [deleteProjectState, deleteProjectDispatch] = useFormState(deleteProjectWithId, initialState);
  const [deleteTecnologiaState, deleteTecnologiaDispatch] = useFormState(deleteTecnologiaWithId, initialState);
  const printableRef = useRef(null);

  const handleExportPDF = () => {
    const input = printableRef.current;
    if (input) {
      html2canvas(input, { scale: 1 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const pdfHeight = canvasHeight * pdfWidth / canvasWidth;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`proyecto-${proyecto.titulo}.pdf`);
      });
    }
  };

  useEffect(() => {
    if (deleteProjectState.message) {
      if (deleteProjectState.error) {
        toast.error(deleteProjectState.message);
      } else {
        toast.success(deleteProjectState.message);
        router.push('/');
      }
    }
  }, [deleteProjectState, router]);

  useEffect(() => {
    if (deleteTecnologiaState.message) {
      if (deleteTecnologiaState.error) {
        toast.error(deleteTecnologiaState.message);
      } else {
        toast.success(deleteTecnologiaState.message);
      }
    }
  }, [deleteTecnologiaState]);

  const assignedStaffIds = new Set(proyecto.staff.map(s => s.staff.id));
  const availableStaff = allStaff.filter(s => !assignedStaffIds.has(s.id));

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={printableRef}>
          <ProyectoPrintable proyecto={proyecto} />
        </div>
      </div>
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">{proyecto.titulo}</h1>
            <p className="mt-1 text-lg text-secondary">{proyecto.storyline}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportPDF} className="px-4 py-2 font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark">
              Exportar a PDF
            </button>
            <Link href={`/proyectos/${proyecto.id}/editar`} className="px-4 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark">
              Editar
            </Link>
            <form action={deleteProjectDispatch}>
              <DeleteProjectButton />
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-primary mb-6">Detalles del Proyecto</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <DetailItem label="Categoría" value={proyecto.categoria?.nombre} />
              <DetailItem label="Subcategoría" value={proyecto.subcategoria?.nombre} />
              <DetailItem label="Dependencia Origen" value={proyecto.dependenciaOrigen?.nombre} />
              <DetailItem label="Dependencia Actual" value={proyecto.dependenciaActual?.nombre} />
              <DetailItem label="Tier" value={proyecto.tier} />
              <DetailItem label="Estado" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${proyecto.activo ? 'bg-tag-green/20 text-tag-green' : 'bg-tag-red/20 text-tag-red'}`}>{proyecto.activo ? 'Activo' : 'Inactivo'}</span>} />
              <DetailItem label="Ticketera Interna" value={proyecto.url_ticketera_interna && <a href={proyecto.url_ticketera_interna} target="_blank" className="text-primary hover:underline">Enlace</a>} />
              <DetailItem label="Ticketera Externa" value={proyecto.url_ticketera_externa && <a href={proyecto.url_ticketera_externa} target="_blank" className="text-primary hover:underline">Enlace</a>} />
            </dl>
            {proyecto.captura_type && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-primary mb-2">Captura de Pantalla</h3>
                <Image src={`/api/proyectos/${proyecto.id}/captura`} alt={`Captura de ${proyecto.titulo}`} width={500} height={300} className="rounded-lg border border-gray-200" />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-primary mb-4">Tecnología</h3>
              {proyecto.tecnologia ? (
                <div className="flex flex-col gap-4">
                  <dl className="space-y-4 mb-4">
                    <DetailItem label="Alojamiento Infra" value={proyecto.tecnologia.alojamientoInfra?.nombre} />
                    <DetailItem label="Alojamiento DB" value={proyecto.tecnologia.alojamientoInfraDB?.nombre} />
                    <DetailItem label="Control de Versiones" value={proyecto.tecnologia.controlVersiones?.nombre} />
                    <DetailItem label="Estado PMO" value={proyecto.tecnologia.statusPmo?.nombre} />
                    <DetailItem label="Salud del Sistema" value={proyecto.tecnologia.statusSalud?.nombre} />
                    <DetailItem label="Año de Inicio" value={proyecto.tecnologia.anio_inicio_sistema} />
                    <DetailItem label="Usuarios Internos" value={proyecto.tecnologia.usuarios_internos} />
                    <DetailItem label="Usuarios Externos" value={proyecto.tecnologia.usuarios_externos} />
                    <DetailItem label="Changelog" value={proyecto.tecnologia.changelog ? 'Sí' : 'No'} />
                    {proyecto.tecnologia.url_changelog && <DetailItem label="URL Changelog" value={<a href={proyecto.tecnologia.url_changelog} target="_blank" className="text-primary hover:underline">Enlace</a>} />}
                    <DetailItem label="Mantenimiento y Soporte" value={proyecto.tecnologia.mantenimiento_soporte ? 'Sí' : 'No'} />
                  </dl>
                  <div className="flex gap-2 justify-end">
                    <Link href={`/proyectos/${proyecto.id}/tecnologia/editar`} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark">
                      Editar Tecnología
                    </Link>
                    <form action={deleteTecnologiaDispatch}>
                      <DeleteTecnologiaButton />
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-secondary mb-4">No hay datos de tecnología para este proyecto.</p>
                  <Link href={`/proyectos/${proyecto.id}/tecnologia/editar`} className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark">
                    Añadir Tecnología
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-primary mb-4">Staff Asignado</h3>
                <div className="flex flex-col gap-4">
                    <ul className="space-y-3">
                        {proyecto.staff.map(s => (
                            <li key={s.staff.id} className="flex items-center justify-between bg-background p-2 rounded-md">
                                <div>
                                    <p className="text-sm font-medium text-primary">{s.staff.nombre_completo}</p>
                                    <p className="text-xs text-secondary">{s.staff.rol_staff}</p>
                                </div>
                                <form action={unassignStaff}>
                                    <input type="hidden" name="id_proyecto" value={proyecto.id} />
                                    <input type="hidden" name="id_staff" value={s.staff.id} />
                                    <button type="submit" className="text-xs text-tag-red hover:text-tag-red/90 font-semibold">Desasignar</button>
                                </form>
                            </li>
                        ))}
                        {proyecto.staff.length === 0 && <p className="text-sm text-secondary">No hay personal asignado a este proyecto.</p>}
                    </ul>
                    <hr />
                    <form action={assignStaff} className="flex items-center gap-2">
                        <input type="hidden" name="id_proyecto" value={proyecto.id} />
                        <select name="id_staff" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option value="">Asignar persona...</option>
                            {availableStaff.map(s => <option key={s.id} value={s.id}>{s.nombre_completo}</option>)}
                        </select>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-lg shadow-md hover:bg-secondary-dark">Asignar</button>
                    </form>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-primary mb-4">Clientes Asociados</h3>
                <div className="flex flex-col gap-4">
                    <ul className="space-y-3">
                        {proyecto.clientes.map(c => (
                            <li key={c.id} className="flex items-center justify-between bg-background p-2 rounded-md">
                                <div>
                                    <p className="text-sm font-medium text-primary">{c.nombre}</p>
                                    <p className="text-xs text-secondary">{c.email}</p>
                                </div>
                                <Link href={`/clientes/${c.id}/editar`} className="text-xs text-primary hover:text-primary-dark font-semibold">
                                    Ver/Editar
                                </Link>
                            </li>
                        ))}
                        {proyecto.clientes.length === 0 && <p className="text-sm text-secondary">No hay clientes asignados a este proyecto.</p>}
                    </ul>
                    <Link href={`/clientes/nuevo?id_proyecto=${proyecto.id}`} className="mt-2 text-sm text-center font-semibold text-white bg-primary hover:bg-primary-dark p-2 rounded-md w-full">
                        + Añadir Cliente a este Proyecto
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
