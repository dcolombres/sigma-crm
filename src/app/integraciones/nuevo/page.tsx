import { notFound } from 'next/navigation';

export default async function NuevaIntegracionPage() {
  // This page is obsolete because the 'Integracion' model has been deleted.
  // Returning notFound() to prevent access and resolve build errors.
  notFound();
}
