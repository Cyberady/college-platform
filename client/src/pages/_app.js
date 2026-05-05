import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={poppins.className}>
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </main>
  );
}