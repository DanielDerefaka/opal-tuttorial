export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen  container flex justify-center items-center " >{children}</div>;
}
