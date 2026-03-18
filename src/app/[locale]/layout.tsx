import type { Metadata } from "next";
import { Sora, Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Chatbot } from '@/components/chat/Chatbot';
import { Navigation } from '@/components/layout/Navigation';

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synapse AI | University-Grade AI Learning Platform",
  description: "Master technical skills with Synapse AI. Featuring university-grade curriculum, real-time AI tutoring with Gemini 2.0, and interactive neural roadmaps for Full-Stack, Networking, and more.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import { LoadingProvider } from '@/components/ui/LoadingProgress';
import { GamificationOverlay } from '@/components/ui/GamificationOverlay';
import { AuthStateListener } from '@/components/auth/AuthStateListener';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'ar'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning={true}>
      <body
        className={`${sora.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased ${locale === 'ar' ? 'font-sora' : 'font-inter'}`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LoadingProvider>
            <AuthStateListener />
            <Navigation />
            <main className="pt-20">
              {children}
            </main>
            {/* Global AI Assistant */}
            <Chatbot />
            
            {/* Global Gamification UI */}
            <GamificationOverlay />
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
