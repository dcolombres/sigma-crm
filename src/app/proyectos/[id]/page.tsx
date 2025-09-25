import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import { DeleteButton } from '@/components/DeleteButton';
import { getNumberOrNull } from '@/lib/utils';

// --- TYPE DEFINITIONS ---
interface DetailPageProps {
  params: { id: string };
}

import { assignStaff, unassignStaff, deleteProject, createOrUpdateTecnologia, deleteTecnologia } from '@/lib/actions';

// --- TYPE DEFINITIONS ---
function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default async function ProyectoDetailPage({ params }: DetailPageProps) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  // Fetch data sequentially
  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: {
      categoria: true,
      subcategoria: true,
      dependenciaOrigen: true,
      dependenciaActual: true,
      tecnologia: {
        include: {
          controlVersiones: true,
          statusPmo: true,
          statusSalud: true,
          alojamientoInfra: true,
          alojamientoInfraDB: true,
        },
      },
      staff: { include: { staff: true } },
      clientes: true,
    },
  });

  if (!proyecto) {
    return notFound();
  }

  const allStaff = await prisma.staff.findMany();
  const assignedStaffIds = new Set(proyecto.staff.map(s => s.id_staff));
  const availableStaff = allStaff.filter(s => !assignedStaffIds.has(s.id));

  const controlVersiones = await prisma.controlVersiones.findMany({ orderBy: { nombre: 'asc' } });
  const statusPmo = await prisma.statusPmo.findMany({ orderBy: { nombre: 'asc' } });
  const statusSalud = await prisma.statusSalud.findMany({ orderBy: { nombre: 'asc' } });

  const deleteProjectWithId = deleteProject.bind(null, proyecto.id);
  const createOrUpdateTecnologiaWithId = createOrUpdateTecnologia.bind(null, proyecto.id);
  const deleteTecnologiaWithId = deleteTecnologia.bind(null, proyecto.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{proyecto.titulo}</h1>
            <p className="mt-1 text-lg text-gray-600">{proyecto.storyline}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/proyectos/${proyecto.id}/editar`} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
              Editar
            </Link>
            <form action={deleteProjectWithId}>
              <DeleteButton className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700">
                Eliminar
              </DeleteButton>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Detalles del Proyecto</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <DetailItem label="Categoría" value={proyecto.categoria?.nombre} />
              <DetailItem label="Subcategoría" value={proyecto.subcategoria?.nombre} />
              <DetailItem label="Dependencia Origen" value={proyecto.dependenciaOrigen?.nombre} />
              <DetailItem label="Dependencia Actual" value={proyecto.dependenciaActual?.nombre} />
              <DetailItem label="Tier" value={proyecto.tier} />
              <DetailItem label="Estado" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${proyecto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{proyecto.activo ? 'Activo' : 'Inactivo'}</span>} />
              <DetailItem label="Ticketera Interna" value={proyecto.url_ticketera_interna && <a href={proyecto.url_ticketera_interna} target="_blank" className="text-blue-600 hover:underline">Enlace</a>} />
              <DetailItem label="Ticketera Externa" value={proyecto.url_ticketera_externa && <a href={proyecto.url_ticketera_externa} target="_blank" className="text-blue-600 hover:underline">Enlace</a>} />
            </dl>
            {proyecto.url_captura && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Captura de Pantalla</h3>
                <Image src={proyecto.url_captura} alt={`Captura de ${proyecto.titulo}`} width={500} height={300} className="rounded-lg border border-gray-200" />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tecnología</h3>
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
                    {proyecto.tecnologia.url_changelog && <DetailItem label="URL Changelog" value={<a href={proyecto.tecnologia.url_changelog} target="_blank" className="text-blue-600 hover:underline">Enlace</a>} />}
                    <DetailItem label="Mantenimiento y Soporte" value={proyecto.tecnologia.mantenimiento_soporte ? 'Sí' : 'No'} />
                  </dl>
                  <div className="flex gap-2 justify-end">
                    <Link href={`/proyectos/${proyecto.id}/tecnologia/editar`} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
                      Editar Tecnología
                    </Link>
                    <form action={deleteTecnologiaWithId}>
                      <DeleteButton className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700">
                        Eliminar Tecnología
                      </DeleteButton>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-4">No hay datos de tecnología para este proyecto.</p>
                  <Link href={`/proyectos/${proyecto.id}/tecnologia/editar`} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                    Añadir Tecnología
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Staff Asignado</h3>
                <div className="flex flex-col gap-4">
                    <ul className="space-y-3">
                        {proyecto.staff.map(s => (
                            <li key={s.id_staff} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{s.staff.nombre_completo}</p>
                                    <p className="text-xs text-gray-500">{s.staff.rol_staff}</p>
                                </div>
                                <form action={unassignStaff}>
                                    <input type="hidden" name="id_proyecto" value={proyecto.id} />
                                    <input type="hidden" name="id_staff" value={s.id_staff} />
                                    <button type="submit" className="text-xs text-red-500 hover:text-red-700 font-semibold">Desasignar</button>
                                </form>
                            </li>
                        ))}
                        {proyecto.staff.length === 0 && <p className="text-sm text-gray-500">No hay personal asignado a este proyecto.</p>}
                    </ul>
                    <hr />
                    <form action={assignStaff} className="flex items-center gap-2">
                        <input type="hidden" name="id_proyecto" value={proyecto.id} />
                        <select name="id_staff" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Asignar persona...</option>
                            {availableStaff.map(s => <option key={s.id} value={s.id}>{s.nombre_completo}</option>)}
                        </select>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">Asignar</button>
                    </form>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Clientes Asociados</h3>
                <div className="flex flex-col gap-4">
                    <ul className="space-y-3">
                        {proyecto.clientes.map(c => (
                            <li key={c.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{c.nombre}</p>
                                    <p className="text-xs text-gray-500">{c.email}</p>
                                </div>
                                <Link href={`/clientes/${c.id}/editar`} className="text-xs text-blue-500 hover:text-blue-700 font-semibold">
                                    Ver/Editar
                                </Link>
                            </li>
                        ))}
                        {proyecto.clientes.length === 0 && <p className="text-sm text-gray-500">No hay clientes asignados a este proyecto.</p>}
                    </ul>
                    <Link href={`/clientes/nuevo?id_proyecto=${proyecto.id}`} className="mt-2 text-sm text-center font-semibold text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-md w-full">
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