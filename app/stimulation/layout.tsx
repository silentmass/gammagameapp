import NavLinks from "@/app/ui/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-sreen flex-col md:flex-row md:overflow-hidden">
      <div className="flex p-0 mf:overflow-y-auto md:p-0 border">{children}</div>
      <div className="w-full h-full flex-wrap md:w-64 border">
        <NavLinks />
      </div>
    </div>
  );
}