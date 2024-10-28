import type { Metadata } from "next";
import {IBM_Plex_Sans} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'


const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight:  ['400' ,'500' ,'600', '700'] ,
  variable : '--font-ibm-plex'
});
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "AiSaas",
  description: "AI-power image generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
    //     <html lang="en">
    //   <body
    //     className={cn("font-IBMPlex antialiased" , IBMPlex.variable)}>
    //       {children}
    //   </body>
    // </html>
    // </ClerkProvider>

    <ClerkProvider appearance={{
      variables : {colorPrimary: '#624cf5'}
    }}>
    <html lang="en">
      <body
      className={cn("font-IBMPlex antialiased" , IBMPlex.variable)}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {children}
      </body>
    </html>
  </ClerkProvider>
    
  );
}
