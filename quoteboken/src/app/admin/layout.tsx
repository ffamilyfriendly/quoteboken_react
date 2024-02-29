import { getSession } from "@/lib/userActions";

import "../globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ses = await getSession()

  return (
    <>{ (ses != null && ses.admin) ? children : <h1>nah chief</h1> }</>
  );
}
