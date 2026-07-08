import { Link } from "@/i18n/routing";
import { Mascot } from "@/components/brand/Mascot";

export default function LocaleNotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Mascot glow className="h-16 w-auto" />
      <h1 className="text-6xl font-extrabold text-orange">404</h1>
      <Link href="/" className="text-sm text-orange underline-offset-4 hover:underline">
        codeless.ge
      </Link>
    </main>
  );
}
