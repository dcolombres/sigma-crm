import { getNumberOrNull } from '@/lib/utils';

export async function handleFileUpload(formData: FormData): Promise<{ capturaData?: Buffer | null; capturaType?: string | null; error?: string }> {
  const file = formData.get('captura') as File;
  const deleteCaptura = formData.get('delete_captura') === 'on';

  if (deleteCaptura) {
    return { capturaData: null, capturaType: null };
  }

  if (file && file.size > 0) {
    try {
      if (file.size > 2 * 1024 * 1024) {
        return { error: 'La imagen no puede superar los 2MB.' };
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        return { error: 'Solo se permiten archivos JPG o PNG.' };
      }

      const bytes = await file.arrayBuffer();
      const capturaData = Buffer.from(bytes);
      const capturaType = file.type;
      return { capturaData, capturaType };
    } catch (error) {
      console.error('Error processing file:', error);
      return { error: 'Error al procesar la imagen.' };
    }
  }

  return {};
}

export function getRelationUpdate(formData: FormData, fieldName: string) {
  const id = getNumberOrNull(formData.get(fieldName));
  return id ? { connect: { id } } : { disconnect: true };
}

export function getRelationCreate(formData: FormData, fieldName: string) {
  const id = getNumberOrNull(formData.get(fieldName));
  return id ? { connect: { id } } : undefined;
}

export function getManyToManyRelationUpdate(ids: number[], innerRelationName: string) {
  return {
    deleteMany: {},
    create: ids.map(id => ({ [innerRelationName]: { connect: { id } } }))
  };
}
