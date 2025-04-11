export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* AppLogo Component for branding */}
        {/* <AppLogo className="flex items-center gap-2 self-center font-medium" /> */}

        {/* Render the SignIn or SignUp form based on the route */}
        {children}
      </div>
    </div>
  );
}
