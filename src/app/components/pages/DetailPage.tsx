import { ArrowLeft, ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { type Page, type RouterParams } from "../../hooks/useRouter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { categoryKey } from "../../utils/category";
import { attractionName, attractionDescription, attractionHours, attractionFee, attractionAddress, mapQuery, googleMapsUrl, googleDirectionsUrl } from "../../types/TouristAttraction";
import { photoCredits } from "../../data/photoCredits";

export function DetailPage({ attractionId, onNavigate }: { attractionId: number; onNavigate: (page: Page, params?: RouterParams) => void }) {
  const { getAttractionById, isAdmin } = useApp();
  const { t, language } = useLanguage();
  const th = language === "th";
  const a = getAttractionById(attractionId);
  const back = <button onClick={() => onNavigate("attractions")} className="link-line inline-flex items-center gap-3 text-xs uppercase tracking-widest"><ArrowLeft className="h-4 w-4" />{t("detail.back")}</button>;
  if (!a) return <div className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="font-display text-4xl">{t("detail.not.found")}</h1><div className="mt-8">{back}</div></div>;
  const name = attractionName(a, th);
  const credit = photoCredits.find(p => p.image === a.image);
  const facts = [
    [t("form.category"), t(categoryKey(a.category))],
    [t("detail.opening.hours"), attractionHours(a, th)],
    [t("detail.entrance.fee"), attractionFee(a, th)],
    ...(attractionAddress(a, th) ? [[t("detail.address"), attractionAddress(a, th)]] : []),
    ...(a.phone ? [[t("detail.phone"), a.phone]] : []),
  ];
  const tip = (th ? a.visitTipTh : a.visitTip) || a.visitTip;
  return <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
    <div className="flex flex-wrap items-center justify-between gap-6">
      {back}
      {isAdmin && <button onClick={() => onNavigate("form", { mode: "edit", id: a.id })} className="link-line text-xs uppercase tracking-widest">{t("common.edit")}</button>}
    </div>
    <header className="mx-auto mt-14 max-w-4xl text-center">
      <span className="eyebrow">{t(categoryKey(a.category))}</span>
      <h1 className="mt-6 font-display text-4xl font-light leading-tight md:text-6xl">{name}</h1>
      <p className="mx-auto mt-6 flex max-w-2xl items-start justify-center gap-2 text-sm leading-relaxed text-muted-foreground"><MapPin className="mt-1 h-4 w-4 shrink-0" />{attractionAddress(a, th)}</p>
    </header>
    {a.image && <figure className="mt-12">
      <ImageWithFallback src={a.image} alt={name} className={"w-full object-cover " + (a.id === 4 ? "aspect-[4/3] max-h-[480px]" : "aspect-[4/3] md:aspect-[16/8]")} />
      {credit && <figcaption className="mt-3 text-xs text-muted-foreground"><a href={credit.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">{credit.author} · {credit.license}</a> · {th ? "ปรับขนาดและครอบภาพ" : "Resized and cropped"}</figcaption>}
    </figure>}
    <div className="mt-16 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
      <div>
        <h2 className="eyebrow">{t("detail.about")}</h2>
        <p className="mt-6 font-display text-2xl font-light leading-relaxed md:text-3xl">{attractionDescription(a, th)}</p>
        {tip && <section className="mt-12 border-l-2 border-gold bg-secondary/70 p-6">
          <h3 className="text-sm font-medium">{th ? "ก่อนออกเดินทาง" : "Before you go"}</h3>
          <p className="mt-3 text-sm leading-loose text-muted-foreground">{tip}</p>
        </section>}
        {a.sourceUrl && <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{th ? "ข้อมูลอ้างอิง: " : "Reference: "}<a className="underline underline-offset-4" href={a.sourceUrl} target="_blank" rel="noreferrer">{a.sourceName || (th ? "แหล่งข้อมูลสถานที่" : "Attraction information")} <ArrowUpRight className="inline h-3 w-3" /></a></p>}
      </div>
      <aside>
        <h2 className="eyebrow">{th ? "ข้อมูลสำหรับการเข้าชม" : "Plan your visit"}</h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">{facts.map(([key, value]) => <div key={key} className="grid grid-cols-[100px_1fr] gap-6 py-5"><dt className="text-xs leading-relaxed text-muted-foreground">{key}</dt><dd className="text-sm leading-relaxed">{value}</dd></div>)}</dl>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{th ? "เวลาเปิด ค่าเข้าชม และการเปิดเส้นทางอาจเปลี่ยนแปลง ควรยืนยันกับสถานที่ก่อนเดินทาง" : "Opening hours, admission and route access can change. Confirm with the venue before travelling."}</p>
        <div className="mt-7 flex flex-col gap-3">
          <a href={googleDirectionsUrl(a)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 bg-primary px-5 py-4 text-sm text-primary-foreground"><Navigation className="h-4 w-4" />{th ? "นำทางด้วย Google Maps" : "Get directions"}</a>
          <a href={googleMapsUrl(a)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 border border-border px-5 py-4 text-sm"><MapPin className="h-4 w-4" />{th ? "ดูสถานที่บน Google Maps" : "Open in Google Maps"}</a>
        </div>
      </aside>
    </div>
    <section aria-labelledby="location-heading" className="mt-20 border-t border-border pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5"><div><span className="eyebrow">{th ? "จุดหมายจริงของการเดินทาง" : "Find your destination"}</span><h2 id="location-heading" className="mt-4 font-display text-3xl">{th ? "ตำแหน่งและการเดินทาง" : "Location & directions"}</h2></div><a href={googleMapsUrl(a)} target="_blank" rel="noreferrer" className="link-line text-xs uppercase tracking-widest">Google Maps ↗</a></div>
      <iframe title={(th ? "แผนที่ " : "Map of ") + name} src={"https://www.google.com/maps?q=" + encodeURIComponent(mapQuery(a)) + "&output=embed"} className="h-[360px] w-full border border-border bg-secondary md:h-[450px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{th ? "แผนที่ค้นหาด้วยชื่อสถานที่และพื้นที่จริง กดเปิด Google Maps เพื่อตรวจจุดหมายและเส้นทางล่าสุด" : "The map searches the specific place name and locality. Open Google Maps to confirm the destination and current route."}</p>
    </section>
  </div>;
}
