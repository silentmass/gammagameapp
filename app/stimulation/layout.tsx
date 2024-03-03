import NavLinks from "@/app/ui/nav-links";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col justify-center items-center p-0">
      <div className="flex p-0 md:items-center">{children}</div>
      <div className="flex md:flex max-w-xs items-center justify-center flex-wrap">
        <NavLinks />
      </div>
    </main>
  );
}