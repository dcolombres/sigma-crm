import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TecnologiaForm from '@/components/TecnologiaForm';
import { updateProject } from '@/lib/actions';

export default async function TecnologiaPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  
  const [proyecto, plataformas, tiposDesarrollo, controlesVersiones, tiposSistema] = await Promise.all([
    prisma.proyecto.findUnique({ where: { id } }),
    prisma.dPR_Plataforma.findMany(),
    prisma.dPR_TipoDesarrollo.findMany(),
    prisma.dPR_ControlVersiones.findMany(),
    prisma.dPR_TipoSistema.findMany(),
  ]);

  if (!proyecto) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, proyecto.id);

  return (
    <TecnologiaForm
      proyecto={proyecto}
      plataformas={plataformas}
      tiposDesarrollo={tiposDesarrollo}
      controlesVersiones={controlesVersiones}
      tiposSistema={tiposSistema}
      updateProjectWithId={updateProjectWithId}
    />
  );
}
