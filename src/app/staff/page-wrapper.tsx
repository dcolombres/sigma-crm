import StaffPage from './page-component';

export default async function StaffPageWrapper({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return <StaffPage />;
}
