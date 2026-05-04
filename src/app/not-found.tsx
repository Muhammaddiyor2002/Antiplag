import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Logo className="justify-center" />
        <div className="mt-8 text-7xl font-bold gradient-text">404</div>
        <h1 className="mt-4 text-2xl font-bold">Sahifa topilmadi</h1>
        <p className="mt-2 text-muted-foreground">Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.</p>
        <Button asChild className="mt-6" variant="gradient">
          <Link href="/">Bosh sahifaga qaytish</Link>
        </Button>
      </div>
    </div>
  );
}
