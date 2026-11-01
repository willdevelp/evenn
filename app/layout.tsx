// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Bricolage_Grotesque} from "next/font/google";
// import "./globals.css";
// import { Toaster } from "@/src/components/ui/sonner";
// import { ThemeProvider } from "@/src/components/ui/theme-provider";
// // import Header from "@/src/components/ui/header";
// import { cn } from "@/lib/utils";
// import { ReserveProvider } from "@/context/ReserveContext";
// // import Footer from "@/src/components/ui/footer";
// // import Link from "next/link";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const bricolageGrotesque = Bricolage_Grotesque({
//   variable: "--font-bricolage-grotesque",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: {
//     default: "Evenn — Événements, billetterie et concours",
//     template: "%s",
//   },
//   description:
//     "Créez vos événements, vendez vos billets et lancez des concours avec votes vérifiés.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="fr" suppressHydrationWarning >
//       <head>
//       {/* <Link
//           rel="stylesheet"
//           href="https://fonts.googleapis.com/css2?family=Geist+Mono&display=swap"
//         /> */}
//       </head>
//       <body
//         className={cn(
//           bricolageGrotesque.variable
//         )}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//         >
//           <ReserveProvider>
//             {/* <Header /> */}
//             {children}
//             <Toaster />
//             {/* <Footer/> */}
//           </ReserveProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import { ThemeProvider } from "@/src/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import { ReserveProvider } from "@/context/ReserveContext";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Evenn — Événements, billetterie et concours",
    template: "%s",
  },
  description:
    "Créez vos événements, vendez vos billets et lancez des concours avec votes vérifiés.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(bricolage.variable, instrument.variable)}
    >
      <body className="bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReserveProvider>
            {children}
            <Toaster />
          </ReserveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}