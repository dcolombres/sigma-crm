import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getNumberOrNull } from '@/lib/utils';
import ProyectoNewForm from '@/components/ProyectoNewForm';
import { handleFileUpload, getRelationCreate } from '@/lib/form-helpers';

// Server Action to create a project
async function createProject(prevState: { message: string; error: boolean; projectId?: number }, formData: FormData): Promise<{ message: string; error: boolean; projectId?: number }> {
  'use server';

  try {
    const titulo = formData.get('titulo') as string;
    if (!titulo || titulo.trim() === '') {
      return { message: 'El título es un campo obligatorio.', error: true };
    }

    const { capturaData, capturaType, error: fileError } = await handleFileUpload(formData);
    if (fileError) {
      return { message: fileError, error: true };
    }

    const data: Prisma.ProyectoCreateInput = {
      titulo: titulo,
      storyline: formData.get('storyline') as string,
      activo: formData.get('activo') === 'on',
      dependenciaOrigen: getRelationCreate(formData, 'id_dependencia_origen'),
      dependenciaActual: getRelationCreate(formData, 'id_dependencia_actual'),
      categoria: getRelationCreate(formData, 'id_categoria'),
      subcategoria: getRelationCreate(formData, 'id_subcategoria'),
      tier: getNumberOrNull(formData.get('tier')),
      captura_data: capturaData,
      captura_type: capturaType,
      url_ticketera_interna: formData.get('url_ticketera_interna') as string,
      url_ticketera_externa: formData.get('url_ticketera_externa') as string,
    };

    const newProject = await prisma.proyecto.create({ data });
    revalidatePath('/');
    revalidatePath(`/proyectos/${newProject.id}`);
    return { message: 'Proyecto creado correctamente.', error: false, projectId: newProject.id };

  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { message: `Error de base de datos: ${error.meta?.target}`, error: true };
    }
    return { message: 'Error al crear el proyecto.', error: true };
  }
}

// The page component
export default async function NuevoProyectoPage() {
  const [dependencias, categorias, subcategorias] = await Promise.all([
    prisma.dependencia.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.categoria.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.subcategoria.findMany({ orderBy: { nombre: 'asc' } }),
  ]);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Crear Nuevo Proyecto</h1>
        
        <ProyectoNewForm 
          createProject={createProject} 
          dependencias={dependencias} 
          categorias={categorias} 
          subcategorias={subcategorias} 
        />
      </div>
    </main>
  );
}
