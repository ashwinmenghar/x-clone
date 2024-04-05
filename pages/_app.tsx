import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Inter, Quicksand } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const quickSand = Quicksand({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <GoogleOAuthProvider clientId="123978764845-nibanggncqj2du31nf3lpqc94qpvqkj3.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster />
      </GoogleOAuthProvider>
    </div>
  );
}
