import NavLinks from "@/app/ui/nav-links";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - GammaGame',
};

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-gray-500">
      <div className="flex border max-w-2xl h-full w-full justify-center flex-wrap p-5">
        <p>Hello</p>
      </div>
      <div className="flex border max-w-2xl justify-center p-5 flex-wrap">
        <NavLinks />
      </div>
    </main >
  );
}
