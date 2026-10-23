import { useState } from "react";
import { Plus, Search, MapPin, ArrowUpRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useApp } from "../../contexts/AppContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { type Page, type RouterParams } from "../../hooks/useRouter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { categoryKey } from "../../utils/category";
import { type TouristAttraction, attractionName, attractionDescription, attractionFee, attractionAddress, googleMapsUrl } from "../../types/TouristAttraction";

interface Props {
  onNavigate: (page: Page, params?: RouterParams) => void;
  management?: boolean;
}
const act = "link-line text-xs uppercase tracking-[0.12em]";

function AttractionActions({ a, management, onNavigate }: { a: TouristAttraction; management: boolean; onNavigate: Props["onNavigate"] }) {
  const { deleteAttraction } = useApp();
  const { t, language } = useLanguage();
  const [error, setError] = useState("");
  return <div className="mt-6">
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <button className={act} onClick={() => onNavigate("detail", { id: a.id })}>{language === "th" ? "ดูรายละเอียด" : "Discover"} <ArrowUpRight className="inline h-3 w-3" /></button>
      <a className={act} href={googleMapsUrl(a)} target="_blank" rel="noreferrer">Google Maps</a>
      {management && <>
        <button className={act} onClick={() => onNavigate("form", { mode: "edit", id: a.id })}>{t("common.edit")}</button>
        <AlertDialog>
          <AlertDialogTrigger asChild><button className={act + " text-destructive"}>{t("attractions.delete")}</button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("attractions.confirm.delete")}</AlertDialogTitle>
              <AlertDialogDescription>{language === "th" ? "ลบสถานที่นี้จากรายการที่บันทึกในเบราว์เซอร์นี้" : "Delete this attraction from the catalogue saved in this browser?"} “{attractionName(a, language === "th")}”</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("attractions.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => { try { deleteAttraction(a.id); } catch { setError(language === "th" ? "บันทึกไม่สำเร็จ กรุณาตรวจสอบพื้นที่จัดเก็บของเบราว์เซอร์" : "Could not save. Please check browser storage."); } }}>{t("attractions.delete")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>}
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </div>;
}

export function AttractionsPage({ onNavigate, management = false }: Props) {
  const { attractions, isAdmin } = useApp();
  const { t, language } = useLanguage();
  const th = language === "th";
  const managing = management && isAdmin;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [view, setView] = useState<"card" | "table">("card");
  const categories = [...new Set(attractions.map(a => a.category).filter(Boolean))] as string[];
  const list = attractions.filter(a =>
    [a.name, a.nameTh, a.place_description, a.descriptionTh, a.address, a.addressTh].filter(Boolean).join(" ").toLocaleLowerCase().includes(q.toLocaleLowerCase()) &&
    (cat === "all" || a.category === cat)
  ).sort((a, b) => attractionName(a, th).localeCompare(attractionName(b, th), th ? "th" : "en"));

  return <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
    <header className="flex flex-col justify-between gap-8 border-b border-border pb-12 md:flex-row md:items-end">
      <div>
        <span className="eyebrow">{managing ? (th ? "สำหรับผู้ดูแล" : "Administrator") : (th ? "ค้นพบกำแพงเพชร" : "Explore the province")}</span>
        <h1 className="mt-5 font-display text-4xl font-light leading-tight md:text-6xl">{managing ? t("nav.manage") : (th ? "สถานที่ที่อยากให้คุณได้พบ" : "Places worth the journey")}</h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">{managing ? (th ? "เพิ่ม แก้ไข และจัดการข้อมูลสถานที่ บันทึกเฉพาะเบราว์เซอร์นี้" : "Add, edit and curate the catalogue saved in this browser.") : (th ? "โบราณสถาน วัด พิพิธภัณฑ์ และผืนป่า พร้อมข้อมูลวางแผนเดินทางและจุดหมายบน Google Maps" : "Ancient temples, living culture and forest escapes, with practical details and Google Maps destinations.")}</p>
      </div>
      {managing && <button onClick={() => onNavigate("form", { mode: "add" })} className="inline-flex shrink-0 items-center gap-3 self-start bg-primary px-6 py-4 text-xs uppercase tracking-widest text-primary-foreground"><Plus className="h-4 w-4" />{t("attractions.add.new")}</button>}
    </header>
    <div className="flex flex-col justify-between gap-6 border-b border-border py-7 sm:flex-row sm:items-end">
      <label className="relative block sm:w-96">
        <span className="sr-only">{th ? "ค้นหาสถานที่" : "Search attractions"}</span>
        <Search className="absolute bottom-3 left-0 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={th ? "ค้นหาชื่อสถานที่หรืออำเภอ…" : "Search places or districts…"} className="w-full border-b border-border bg-transparent py-2 pl-7 text-sm outline-none focus:border-gold" />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <label className="text-sm">
          <span className="sr-only">{t("common.filter")}</span>
          <select value={cat} onChange={e => setCat(e.target.value)} className="max-w-full border-b border-border bg-background py-2 text-sm">
            <option value="all">{th ? "ทุกหมวดหมู่" : "All categories"}</option>
            {categories.map(c => <option key={c} value={c}>{t(categoryKey(c))}</option>)}
          </select>
        </label>
        {managing && <div className="flex gap-4">
          {(["card", "table"] as const).map(v => <button key={v} className={act + (view === v ? " text-gold" : "")} onClick={() => setView(v)} aria-pressed={view === v}>{t(v === "card" ? "attractions.card.view" : "attractions.table.view")}</button>)}
        </div>}
        <span role="status" className="text-xs text-muted-foreground">{list.length} {th ? "สถานที่" : "places"}</span>
      </div>
    </div>
    {list.length === 0 ? <div className="py-24 text-center">
      <p className="font-display text-3xl">{th ? "ไม่พบสถานที่ที่ตรงกับเงื่อนไข" : "No places match your search"}</p>
      <button className={act + " mt-6"} onClick={() => { setQ(""); setCat("all"); }}>{th ? "ล้างตัวกรอง" : "Clear filters"}</button>
    </div> : managing && view === "table" ? <div className="overflow-x-auto pt-8">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{t("nav.manage")}</caption>
        <thead><tr className="border-b border-border">{[th ? "สถานที่" : "Place", t("form.category"), th ? "จัดการ" : "Actions"].map(h => <th key={h} scope="col" className="px-3 py-4 font-normal">{h}</th>)}</tr></thead>
        <tbody>{list.map(a => <tr key={a.id} className="border-b border-border">
          <td className="min-w-64 px-3 py-5">{attractionName(a, th)}</td><td className="px-3">{t(categoryKey(a.category))}</td>
          <td className="min-w-80 px-3 pb-5"><AttractionActions a={a} management={managing} onNavigate={onNavigate} /></td>
        </tr>)}</tbody>
      </table>
    </div> : <div className="grid gap-x-10 gap-y-16 pt-14 md:grid-cols-2 lg:grid-cols-3">
      {list.map(a => <article key={a.id} className="group">
        <button onClick={() => onNavigate("detail", { id: a.id })} className="block aspect-[4/3] w-full overflow-hidden bg-secondary" aria-label={attractionName(a, th)}>
          <ImageWithFallback src={a.image || ""} alt={attractionName(a, th)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </button>
        <span className="eyebrow mt-6 block">{t(categoryKey(a.category))}</span>
        <h2 className="mt-3 font-display text-2xl leading-snug">{attractionName(a, th)}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{attractionDescription(a, th)}</p>
        <p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground"><MapPin className="mt-0.5 h-3 w-3 shrink-0" />{attractionAddress(a, th) || (th ? "กำแพงเพชร" : "Kamphaeng Phet")}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{attractionFee(a, th)}</p>
        <AttractionActions a={a} management={managing} onNavigate={onNavigate} />
      </article>)}
    </div>}
  </div>;
}
