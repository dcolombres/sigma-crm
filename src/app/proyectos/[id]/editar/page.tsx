import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getNumberOrNull } from '@/lib/utils';
import ProyectoEditForm from '@/components/ProyectoEditForm';
import { handleFileUpload, getRelationUpdate, getLenguajeRelationUpdate, getBaseDeDatosRelationUpdate } from '@/lib/form-helpers';

// Server Action to update a project
async function updateProject(id_proyecto: number, prevState: { message: string | null; error: boolean; }, formData: FormData): Promise<{ message: string; error: boolean; }> {
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

    const lenguajeIds = formData.getAll('lenguajes').map(id => Number(id));
    const baseDeDatosIds = formData.getAll('bases_de_datos').map(id => Number(id));

    const data: Prisma.ProyectoUpdateInput = {
      titulo: titulo,
      storyline: formData.get('storyline') as string,
      activo: formData.get('activo') === 'on',
      tier: getNumberOrNull(formData.get('tier')),
      url_ticketera_interna: formData.get('url_ticketera_interna') as string,
      url_ticketera_externa: formData.get('url_ticketera_externa') as string,
      dependenciaOrigen: getRelationUpdate(formData, 'id_dependencia_origen'),
      dependenciaActual: getRelationUpdate(formData, 'id_dependencia_actual'),
      categoria: getRelationUpdate(formData, 'id_categoria'),
      subcategoria: getRelationUpdate(formData, 'id_subcategoria'),
      lenguajes: getLenguajeRelationUpdate(lenguajeIds),
      bases_de_datos: getBaseDeDatosRelationUpdate(baseDeDatosIds),
    };

    // Conditionally add image data to the update object
    if (capturaData !== undefined) {
        data.captura_data = capturaData;
        data.captura_type = capturaType;
    }

    await prisma.proyecto.update({ where: { id: id_proyecto }, data });

    revalidatePath('/');
    revalidatePath(`/proyectos/${id_proyecto}`);
    return { message: 'Proyecto actualizado correctamente.', error: false };

  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        return { message: `Error de base de datos: ${error.meta?.target}`, error: true };
      }
    }
    return { message: 'Error al actualizar el proyecto.', error: true };
  }
}

export default async function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) return notFound();

  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: {
      lenguajes: { select: { id_lenguaje: true } },
      bases_de_datos: { select: { id_base_de_datos: true } },
    },
  });

  if (!proyecto) return notFound();

  const dependencias = await prisma.dependencia.findMany({ orderBy: { nombre: 'asc' } });
  const categorias = await prisma.categoria.findMany({ orderBy: { nombre: 'asc' } });
  const subcategorias = await prisma.subcategoria.findMany({ orderBy: { nombre: 'asc' } });
  const todosLenguajes = await prisma.lenguaje.findMany({ orderBy: { nombre: 'asc' } });
  const todasBasesDeDatos = await prisma.baseDeDatos.findMany({ orderBy: { nombre: 'asc' } });

  const updateProjectWithId = updateProject.bind(null, proyecto.id);

  return (
    <main className="flex flex-col items-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-primary mb-8">Editar Proyecto: {proyecto.titulo}</h1>
        
        <ProyectoEditForm
          proyecto={proyecto}
          categorias={categorias}
          subcategorias={subcategorias}
          dependencias={dependencias}
          todosLenguajes={todosLenguajes}
          todasBasesDeDatos={todasBasesDeDatos}
          updateProjectWithId={updateProjectWithId}
        />
      </div>
    </main>
  );
}