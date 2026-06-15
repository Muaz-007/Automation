import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 lg:px-12">
        <Link href="/" className="mb-12 inline-flex" aria-label="WhatsappAutomate home">
          <Logo size="md" />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          {children}
        </div>
        <p className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} WhatsappAutomate
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-accent lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(16,185,129,0.15),_transparent_50%),_radial-gradient(circle_at_70%_80%,_rgba(5,150,105,0.12),_transparent_50%)]" />
        <div className="relative flex h-full items-center justify-center p-12">
          <div className="max-w-md">
            <blockquote className="text-2xl font-medium text-accent-foreground">
              &ldquo;23 leads were captured automatically on day one. Our sales
              grew 40% in the first month.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                AH
              </div>
              <div>
                <div className="font-medium text-accent-foreground">
                  Ali Hassan
                </div>
                <div className="text-sm text-accent-foreground/70">
                  Prime Properties, Karachi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
