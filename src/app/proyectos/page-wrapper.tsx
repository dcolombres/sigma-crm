import ProyectosPage from './page-component';

export default async function ProyectosPageWrapper({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return <ProyectosPage searchParams={searchParams} />;
}
