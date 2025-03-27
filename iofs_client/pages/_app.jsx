import "../styles/globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin", "cyrillic"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={roboto.className}>
      <Component {...pageProps} />
    </div>
  );
}
