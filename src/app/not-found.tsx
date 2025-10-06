import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center">
      <ExclamationTriangleIcon className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold text-primary mb-2">404 - Página No Encontrada</h1>
      <p className="text-lg text-secondary mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link href="/" className="px-6 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75">
        Volver al Dashboard
      </Link>
    </div>
  );
}
