import { Metadata } from "next";

/**
 * ISP Keywords Landing Pages
 * Dynamic landing pages untuk optimasi SEO khusus ISP/Telekomunikasi
 */

interface KeywordPageParams {
  slug: string;
}

// Mapping keywords dengan metadata SEO
const KEYWORD_PAGES = {
  "wifi-murah-jakarta": {
    title: "WiFi Murah Jakarta - Paket Internet Terjangkau & Berkualitas Terbaik",
    description:
      "Cari WiFi murah di Jakarta? Bandingkan paket internet terjangkau dari provider terpercaya. Gratis pasang, customer service 24/7.",
    keywords: ["wifi murah jakarta", "internet murah jakarta", "paket internet terjangkau"],
    content: "Temukan paket WiFi paling ekonomis di Jakarta dengan kecepatan terjamin.",
    city: "Jakarta",
  },
  "wifi-cepat-jakarta": {
    title: "WiFi Cepat Jakarta - Internet Super Cepat Fiber Unlimited",
    description:
      "Dapatkan WiFi cepat stabil di Jakarta. Fiber optik unlimited dengan kecepatan hingga 100 Mbps. Gratis instalasi & modem.",
    keywords: ["wifi cepat jakarta", "internet cepat jakarta", "fiber jakarta"],
    content: "Nikmati internet fiber super cepat tanpa lag untuk semua kebutuhan Anda.",
    city: "Jakarta",
  },
  "internet-fiber-jakarta": {
    title: "Internet Fiber Jakarta - Koneksi Fiber Optik Terbaru & Tercepa",
    description:
      "Upgrade ke fiber optik sekarang! Koneksi internet fiber stabil 24/7 di Jakarta. Harga spesial & gratis setup.",
    keywords: ["fiber jakarta", "internet fiber", "koneksi fiber optik"],
    content: "Fiber optik terdepan dengan teknologi terbaru untuk performa maksimal.",
    city: "Jakarta",
  },
  "wifi-bisnis-jakarta": {
    title: "WiFi Bisnis Jakarta - Internet Dedicated Untuk Perusahaan & Kantor",
    description:
      "Solusi internet bisnis profesional untuk kantor Jakarta. Dedicated line, SLA 99.9%, support prioritas.",
    keywords: ["wifi bisnis jakarta", "internet bisnis", "dedicated internet"],
    content: "Internet bisnis enterprise-grade dengan uptime terjamin 99.9%.",
    city: "Jakarta",
  },
  "paket-internet-murah-bandung": {
    title: "Paket Internet Murah Bandung - WiFi Terjangkau Berkualitas Tinggi",
    description:
      "Pilihan paket internet terjangkau Bandung dari provider terpercaya. Gratis instalasi & customer service 24 jam.",
    keywords: ["internet murah bandung", "wifi bandung", "paket internet bandung"],
    content: "Internet berkualitas dengan harga yang dapat dijangkau semua kalangan di Bandung.",
    city: "Bandung",
  },
  "wifi-cepat-bandung": {
    title: "WiFi Cepat Bandung - Internet Stabil Unlimited Harga Kompetitif",
    description:
      "Koneksi internet cepat stabil di Bandung. Fiber hingga 100 Mbps. Gratis pemasangan, garansi kepuasan.",
    keywords: ["wifi cepat bandung", "internet bandung", "fiber bandung"],
    content: "Bandwidth unlimited dengan kecepatan konsisten sepanjang hari di Bandung.",
    city: "Bandung",
  },
  "internet-rumah-surabaya": {
    title: "Internet Rumah Surabaya - Paket WiFi Rumah Terjangkau & Berkualitas",
    description:
      "Pasang internet rumah Surabaya dengan harga hemat. Unlimited data atau TV kabel + internet bundle.",
    keywords: ["internet rumah surabaya", "wifi rumah surabaya", "paket internet"],
    content: "Solusi internet rumah lengkap dengan paket bundling TV & internet terbaik.",
    city: "Surabaya",
  },
  "wifi-gaming-jakarta": {
    title: "WiFi Gaming Jakarta - Internet Gaming Stabil Low Latency & Cepat",
    description:
      "Internet gaming pro di Jakarta. Latency rendah, bandwidth prioritas, ping stabil untuk MOBA & FPS.",
    keywords: ["wifi gaming jakarta", "internet gaming", "connection gaming"],
    content: "Dedicated internet gaming dengan prioritas bandwidth untuk gaming kompetitif.",
    city: "Jakarta",
  },
  "internet-stabil-jakarta": {
    title: "Internet Stabil Jakarta - Koneksi Internet Handal Tanpa Putus",
    description:
      "Internet stabil 24/7 di Jakarta tanpa lag atau putus. Fiber optik dengan SLA uptime terjamin.",
    keywords: ["internet stabil", "koneksi stabil", "internet jakarta reliable"],
    content: "Teknologi terkini untuk koneksi yang selalu stabil tanpa gangguan.",
    city: "Jakarta",
  },
  "provider-terbaik-jakarta": {
    title: "Provider Internet Terbaik Jakarta - Pilihan Provider Terpercaya",
    description:
      "Bandingkan provider internet terbaik Jakarta. Review lengkap, harga transparan, support terbaik.",
    keywords: ["provider internet jakarta", "provider terbaik", "isp jakarta"],
    content: "Rekomendasi provider internet terbaik dengan rating tertinggi di Jakarta.",
    city: "Jakarta",
  },
};

export async function generateMetadata({
  params,
}: {
  params: KeywordPageParams;
}): Promise<Metadata> {
  const page = KEYWORD_PAGES[params.slug as keyof typeof KEYWORD_PAGES];

  if (!page) {
    return {
      title: "Page Not Found",
      description: "Halaman yang Anda cari tidak ditemukan.",
    };
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: `https://xlfiberid.vercel.app/landing/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(KEYWORD_PAGES).map((slug) => ({
    slug,
  }));
}

export default function LandingPage({ params }: { params: KeywordPageParams }) {
  const page = KEYWORD_PAGES[params.slug as keyof typeof KEYWORD_PAGES];

  if (!page) {
    return <div className="text-center py-20">Halaman tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {page.title.split(" - ")[0]}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {page.description}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Cek Ketersediaan
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Bandingkan Harga
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Kenapa Memilih Kami?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl text-blue-600">✓</span>
                <span className="text-gray-700">
                  Harga kompetitif dan transparan
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl text-blue-600">✓</span>
                <span className="text-gray-700">
                  Customer service 24/7 siap membantu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl text-blue-600">✓</span>
                <span className="text-gray-700">
                  Instalasi gratis tanpa biaya tersembunyi
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl text-blue-600">✓</span>
                <span className="text-gray-700">
                  Koneksi stabil dengan uptime terjamin
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-100 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto text-blue-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.251a.375.375 0 01.528.528l-8.75 8.75a.375.375 0 11-.528-.528l8.75-8.75zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700 font-semibold">
                Internet Cepat di {page.city}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Comparison */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 rounded-lg mx-4 my-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Provider Internet Terpercaya
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Provider {i}
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {`${50 + i * 10}`} Mbps
              </p>
              <button className="w-full bg-blue-50 text-blue-600 py-2 rounded font-semibold hover:bg-blue-100 transition">
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Siap Upgrade Internet Anda?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Dapatkan penawaran terbaik hari ini. Gratis konsultasi & survey lokasi.
        </p>
        <button className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">
          Hubungi Kami Sekarang
        </button>
      </section>
    </div>
  );
}
