import { Dashboard } from "@/components/dashboard/dashboard";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Payzen",
  url: SITE,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  description: "Crypto trading dashboard with live prices, charts, buy, sell and swap.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Dashboard />
    </>
  );
}
