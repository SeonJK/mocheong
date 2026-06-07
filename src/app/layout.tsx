import type { Metadata, Viewport } from "next";
import { invitationConfig, formatWeddingDate } from "@/config/invitation";
import "./globals.css";

const title = `${invitationConfig.couple.groom.name} & ${invitationConfig.couple.bride.name} 결혼식`;
const description = `${formatWeddingDate()} · ${invitationConfig.wedding.venueName} ${invitationConfig.wedding.hall}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title,
  description,
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  },
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: invitationConfig.images.og,
        width: 771,
        height: 2038,
        alt: title
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
