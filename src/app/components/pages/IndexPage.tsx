import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Page } from "../../hooks/useRouter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { categoryKey } from "../../utils/category";
import { attractionName, attractionAddress } from "../../types/TouristAttraction";
import { sitePhoto, attractionPhoto } from "../../data/photoCredits";

interface IndexPageProps {
  onNavigate: (page: Page, params?: any) => void;
}

const HERO = sitePhoto('home-hero');
const PILLAR_IMAGES = [
  sitePhoto('home-heritage'),
  sitePhoto('home-culture'),
  sitePhoto('home-nature'),
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } },
};

export function IndexPage({ onNavigate }: IndexPageProps) {
  const { attractions } = useApp();
  const { t, language } = useLanguage();
  const th = language === "th";
  const top = attractions.slice(0, 3);

  const stats = [
    { n: "700+", l: language === "en" ? "Years of history" : "ปีแห่งประวัติศาสตร์" },
    { n: "1991", l: language === "en" ? "UNESCO inscription" : "ขึ้นทะเบียนมรดกโลก" },
    { n: String(attractions.length).padStart(2, '0'), l: language === "en" ? "Places to discover" : "สถานที่ชวนค้นพบ" },
  ];
  const pillars = [
    { title: t("index.historical"), desc: t("index.historical.desc") },
    { title: t("index.architecture"), desc: t("index.architecture.desc") },
    { title: t("index.nature"), desc: t("index.nature.desc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden pt-32 text-white">
        <motion.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: "easeOut" }}>
          <ImageWithFallback src={HERO} alt="Kamphaeng Phet Historical Park" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.18 }} className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
          <motion.h1 variants={fade} className="max-w-4xl font-display text-5xl font-light leading-[1.08] md:text-7xl lg:text-8xl">
            {t("index.title")}
          </motion.h1>
          <motion.p variants={fade} className="mt-8 max-w-xl text-base leading-relaxed text-white/75 line-clamp-3">
            {t("index.subtitle")}
          </motion.p>
          <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-8">
            <button
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-3 border border-white/70 px-8 py-4 text-xs uppercase tracking-[0.22em] transition-colors hover:bg-white hover:text-black"
            >
              {t("index.discover")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.dl variants={fade} className="mt-16 grid max-w-2xl grid-cols-3 border-t border-white/25 pt-6">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="font-display text-3xl font-light md:text-4xl">{s.n}</dt>
                <dd className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-white/60">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
        <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto mb-20 max-w-2xl text-center">
          <span className="eyebrow">{t("index.experience")}</span>
          <h2 className="mt-6 font-display text-4xl font-light leading-tight md:text-5xl">
            {t("index.discover")} <span className="text-gold">·</span> {t("index.explore")}
          </h2>
        </motion.div>
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {pillars.map((p, i) => (
            <motion.article key={i} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="group">
              <div className="aspect-[4/5] overflow-hidden">
                <ImageWithFallback src={PILLAR_IMAGES[i]} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
              </div>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-display text-sm text-gold">0{i + 1}</span>
                <h3 className="font-display text-2xl">{p.title}</h3>
              </div>
              <p className="mt-3 pl-9 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">{language === "en" ? "The Collection" : "คอลเลกชัน"}</span>
              <h2 className="mt-5 font-display text-4xl font-light md:text-5xl">{t("index.top.title")}</h2>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">{t("index.top.subtitle")}</p>
            </div>
            <button onClick={() => onNavigate("attractions")} className="link-line self-start text-xs uppercase tracking-[0.22em] md:self-auto">
              {language === "en" ? "View all" : "ดูทั้งหมด"}
            </button>
          </div>

          {top.length > 0 ? (
            <div className="grid gap-x-10 gap-y-16 md:grid-cols-3">
              {top.map((a) => (
                <motion.article key={a.id} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="group">
                  <button onClick={() => onNavigate("detail", { id: a.id })} aria-label={attractionName(a, th)} className="block aspect-[3/4] w-full overflow-hidden">
                    <ImageWithFallback src={attractionPhoto(a, 'featured') || ""} alt={attractionName(a, th)} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
                  </button>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="eyebrow">{t(categoryKey(a.category))}</span>
                    <span className="text-xs text-muted-foreground">0{a.id}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl leading-snug transition-colors group-hover:text-gold"><button onClick={() => onNavigate('detail', { id: a.id })}>{attractionName(a, th)}</button></h3>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="normal-case leading-relaxed tracking-normal">{attractionAddress(a, th)}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-2xl">{t("index.no.attractions")}</p>
              <button onClick={() => onNavigate("attractions")} className="link-line mt-6 text-xs uppercase tracking-[0.22em]">{language === 'th' ? 'ดูสถานที่ทั้งหมด' : 'Explore all places'}</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
