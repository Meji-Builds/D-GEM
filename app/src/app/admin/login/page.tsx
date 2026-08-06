import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-mist px-5 py-16">
      <div className="w-full max-w-sm border-2 border-ink bg-white p-8">
        <Logo size="md" />
        <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-mutefg">
          Admin &amp; steward access
        </p>
        <h1 className="font-display mt-1 text-xl font-extrabold">Sign in</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
