import AdminPanel from '@/components/component/AdminPanel';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500">
      <AdminPanel />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}