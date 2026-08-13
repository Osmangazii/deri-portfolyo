import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zanaat — Hakkımızda",
  description:
    "Aşkla işlenen hakiki deri, nesilden nesile aktarılan hikayeler. Zanaatımızı keşfedin.",
};

type CraftPillar = {
  number: string;
  title: string;
  description: string;
};

const PILLARS: CraftPillar[] = [
  {
    number: "01",
    title: "Seçkin Malzeme",
    description:
      "Yalnızca full-grain, bitkisel tabaklanmış hakiki deri kullanıyoruz. Her parça, dokununca hissedilen gerçek bir karaktere sahiptir ve zamanla size özgü bir patina kazanır.",
  },
  {
    number: "02",
    title: "Geleneksel Dikiş",
    description:
      "Makine değil, elde atılan saddler dikişi. Her dikiş zanaatkârın imzasıdır; kopmaz, yıpranmaz ve ürünle birlikte yaşlanır.",
  },
  {
    number: "03",
    title: "Sürdürülebilir Tasarım",
    description:
      "Modanın geçiciliğine değil, zamansızlığa yatırım yapıyoruz. Yıllarca hizmet edecek, nesilden nesile aktarılacak tasarımlar üretiyoruz.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-36 lg:px-8">
      {/* Bölüm 1: Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center">
        <Image
          src="/images/hero/photo-1711915506137-dd9e9b3488a1.avif"
          alt="El yapımı deri atölyesi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative flex flex-col items-center px-6">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-400">
            HAKKIMIZDA
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            ZAMANA MEYDAN OKUYAN ZANAAT
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Aşkla işlenen hakiki deri, nesilden nesile aktarılan hikayeler.
          </p>
        </div>
      </section>

      {/* Bölüm 2: Felsefe */}
      <section className="grid grid-cols-1 gap-10 border-t border-neutral-800 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-3/4 overflow-hidden bg-neutral-900 lg:aspect-auto lg:min-h-140">
          <Image
            src="/images/products/product1-image2.avif"
            alt="Deri işleme aletleri ve zanaat detayı"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-neutral-500">
            FELSEFEMİZ
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Zanaat, aceleye gelmez.
          </h2>
          <p className="mt-8 leading-relaxed text-neutral-400">
            Seri üretimin hızına değil, zanaatkârın sabrına inanıyoruz. Bir
            çantanın oluşması; derinin seçilmesinden, kesimine, kenarlarının
            cilalanmasından son dikişine kadar günler süren bir ritüeldir. Her
            adımda acele etmemeyi, her parçada iz bırakmayı seçiyoruz.
          </p>
          <p className="mt-6 leading-relaxed text-neutral-400">
            Bu yüzden ürünlerimiz yalnızca bir eşya değil; emeğin, sabrın ve
            geleneğin taşıyıcısıdır. Makinelerin tekrarladığı binlerce parça
            yerine, ellerin dokunduğu sınırlı sayıda eser üretiyoruz.
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-neutral-500">
            — Atölye Kurucusu
          </p>
        </div>
      </section>

      {/* Bölüm 3: Zanaatın Üç Sütunu */}
      <section className="border-t border-neutral-800 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          ZANAATIN ÜÇ SÜTUNU
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {PILLARS.map((pillar) => (
            <div key={pillar.number} className="border-t border-neutral-800 pt-6">
              <p className="text-sm font-light tracking-[0.3em] text-neutral-500">
                {pillar.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold uppercase tracking-[0.15em] text-white">
                {pillar.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bölüm 4: CTA */}
      <section className="border-t border-neutral-800 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Kendi Hikayeni Başlat
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          Zamansız bir parça, yıllarca size eşlik edecek bir hikayenin başlangıcı
          olabilir.
        </p>
        <Link
          href="/kategori/yeni-gelenler"
          className="mt-10 inline-flex items-center bg-white px-10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-neutral-200"
        >
          KOLEKSİYONU İNCELE
        </Link>
      </section>
    </main>
  );
}
