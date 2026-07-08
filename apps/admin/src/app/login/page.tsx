import { Mascot } from "@/components/Mascot";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Mascot className="h-12 w-auto drop-shadow-[0_0_18px_rgba(255,107,61,0.5)]" />
          <div>
            <h1 className="text-xl font-bold">
              Code<span className="text-orange">Less</span> Admin
            </h1>
            <p className="mt-1 text-sm text-muted">Sign in to manage leads</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">codeless.ge · Tbilisi</p>
      </div>
    </main>
  );
}
