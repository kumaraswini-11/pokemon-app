import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-1 flex-row gap-4 p-2">{children}</div>
    </>
  );
}
