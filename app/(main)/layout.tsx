import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-1 flex-row gap-4 overflow-hidden p-2">
        {children}
      </div>
    </>
  );
}
