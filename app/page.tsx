import NavLinks from "@/app/ui/nav-links";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - GammaGame',
};

export default function Home() {

  return (
    <div className="flex flex-col w-screen h-full justify-center items-center p-5 min-w-xl">
      <p>Hello!</p>
      <p>Click menu on the left.</p>
    </div>
  );
}
