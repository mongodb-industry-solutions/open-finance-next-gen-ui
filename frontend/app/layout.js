import "./globals.css";
import { Providers } from "./providers";
import NavBar from "@/components/infoWizard/NavBar/NavBar";

// TODO: Update metadata with actual demo details
export const metadata = {
  title: "Demo Template",
  description: "Industry Solutions Demo Template for NextJS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <div className="appContent">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
