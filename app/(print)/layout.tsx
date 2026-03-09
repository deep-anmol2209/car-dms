export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {children}
    </div>
  );
}
