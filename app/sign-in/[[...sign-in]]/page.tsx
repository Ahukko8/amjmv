// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
          },
        }}
        afterSignInUrl="/admin/dashboard"
        redirectUrl="/admin/dashboard"
      />
    </div>
  );
}