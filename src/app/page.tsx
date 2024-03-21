import Image from "next/image";
import { TicketForm } from "@/components/ticketGenerationForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Image src="/background.jpeg" alt="Background" layout="fill" priority />
      </div>

      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-between text-sm lg:flex">
        <TicketForm />
      </div>
    </main>
  );
}
