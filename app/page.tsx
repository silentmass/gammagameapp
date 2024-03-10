import NavLinks from "@/app/ui/nav-links";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - GammaGame',
};

export default function Home() {

  return (
    <div className="flex w-full h-full justify-center items-center p-5 min-w-2xl">
      <p>Hello</p>
    </div>
  );
}
