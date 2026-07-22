import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DriveFlow | Premium Vehicle Rental",
  description: "Seamless vehicle rental experience for users and admins.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <ClerkProvider>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} DriveFlow. All rights reserved.</p>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
