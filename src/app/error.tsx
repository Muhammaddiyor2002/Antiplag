"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold gradient-text">500</div>
        <h1 className="mt-4 text-2xl font-bold">Xatolik yuz berdi</h1>
        <p className="mt-2 text-muted-foreground">Iltimos, sahifani yangilang yoki keyinroq qayta urinib ko'ring.</p>
        <Button onClick={() => reset()} className="mt-6" variant="gradient">Qayta urinib ko'rish</Button>
      </div>
    </div>
  );
}
