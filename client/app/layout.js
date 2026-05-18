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
      <body className={`${body.variable} ${display.variable} font-sans bg-slate-50 text-slate-900 min-h-screen`}>
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
                G
              </div>
              <span className="font-display font-bold text-lg text-slate-900">GlobalTNA</span>
              <span className="text-slate-500 text-sm hidden sm:block">Service Board</span>
            </a>
            <a
              href="/jobs/new"
              className="btn-primary text-sm"
            >
              Post Request
            </a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">{children}</main>
        <footer className="border-t border-slate-200 mt-16 py-8 text-center text-slate-500 text-sm bg-white">
          GlobalTNA Service Request Board © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
