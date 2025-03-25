import ClientLayout from '../ClientLayout';

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
} 