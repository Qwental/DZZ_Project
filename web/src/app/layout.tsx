import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/global.css";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firewatch",
  description: "Firewatch | Ищем пожары/пашни в Приморье",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if (process.env.FLAG !== "development") {
  //   const cookieStore = await cookies();
  //   const accessToken = cookieStore.get("access_token");

  //   if (!accessToken?.value) {
  //     redirect("/login");
  //   }
  // }
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <div
          style={{
            width: "100%",
            height: "105px",
            backgroundColor: "royalblue",
            // marginBottom: "3vh",
          }}
        >
          header
        </div> */}
        <Header />

        {children}
<Footer />
        {/* <div
          style={{
            width: "100%",
            height: "105px",
            backgroundColor: "antiquewhite",
            // marginTop: "1vh",
          }}
        >
          footer
        </div> */}
      </body>
    </html>
  );
}
