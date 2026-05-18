import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const display = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["700", "800"] });

export const metadata = {
  title: "GlobalTNA | Service Request Board",
  description: "Post and browse home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} font-sans bg-slate-950 text-slate-100 min-h-screen`}>
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-display font-bold text-sm">
                G
              </div>
              <span className="font-display font-bold text-lg text-white">GlobalTNA</span>
              <span className="text-slate-400 text-sm hidden sm:block">/ Service Board</span>
            </a>
            <a
              href="/jobs/new"
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              + Post Request
            </a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-800 mt-16 py-8 text-center text-slate-500 text-sm">
          GlobalTNA Service Request Board © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
