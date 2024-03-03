import NavLinks from "@/app/ui/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-sreen flex-col md:flex-row md:overflow-hidden">
      <div className="flex-grow p-6 mf:overflow-y-auto md:p-12">{children}</div>
      <div className="w-full flex-none md:w-64">
        <NavLinks />
      </div>
    </div>
  );
}