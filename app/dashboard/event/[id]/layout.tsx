import { mockEvents } from '@/lib/mockData';

export async function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }));
}

export default function EventManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}