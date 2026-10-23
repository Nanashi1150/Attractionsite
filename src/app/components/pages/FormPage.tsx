import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { type Page } from "../../hooks/useRouter";
import { type TouristAttraction } from "../../types/TouristAttraction";
import { categoryKey } from "../../utils/category";
import { MAX_IMAGE_BYTES, matchesImageSignature, safeExternalUrl, safeImageSource } from "../../utils/contentSafety";

type Draft = Omit<TouristAttraction, "id">;
const categories = ["Historical Site", "Temple", "National Park", "Museum", "Natural Attraction", "Cultural Site"];
const blank: Draft = { name: "", nameTh: "", place_description: "", descriptionTh: "", entrance_fee: 0, open_hours: "", openHoursTh: "", category: "Historical Site", mapsQuery: "", address: "", addressTh: "", image: "", sourceUrl: "", sourceName: "", feeLabel: "", feeLabelTh: "", visitTip: "", visitTipTh: "" };
const input = "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold";

export function FormPage({ mode, attractionId, onNavigate }: { mode: "add" | "edit"; attractionId?: number; onNavigate: (page: Page) => void }) {
  const { isAdmin, getAttractionById, addAttraction, updateAttraction } = useApp();
  const { language, t } = useLanguage();
  const th = language === "th";
  const existing = mode === "edit" && attractionId ? getAttractionById(attractionId) : undefined;
  const [draft, setDraft] = useState<Draft>(() => existing ? { ...existing } : { ...blank });
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const uploadGeneration = useRef(0);
  if (!isAdmin) return null;
  const set = <K extends keyof Draft,>(key: K, value: Draft[K]) => {
    if (key === 'image') { uploadGeneration.current += 1; setReading(false); }
    setDraft(previous => ({ ...previous, [key]: value }));
  };
  const textField = (key: keyof Draft, label: string, required = false, multiline = false) => <label key={key} className="block space-y-2">
    <span className="text-sm">{label}{required ? " *" : ""}</span>
    {multiline ? <textarea className={input + " min-h-32"} name={key} value={String(draft[key] ?? "")} required={required} onChange={e => set(key, e.target.value)} /> :
      <input className={input} name={key} value={String(draft[key] ?? "")} required={required} maxLength={key === 'image' ? undefined : 2048} onChange={e => set(key, e.target.value)} />}
  </label>;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (reading) { setError(th ? 'กรุณารอให้การอ่านรูปภาพเสร็จก่อน' : 'Wait until the image has finished loading.'); return; }
    try {
      if (mode === "edit" && !existing) throw new Error(th ? "ไม่พบสถานที่" : "Attraction not found");
      if (!draft.name.trim() || !draft.mapsQuery?.trim() || draft.place_description.trim().length < 20) throw new Error(th ? "กรุณาระบุชื่อ จุดหมายแผนที่ และคำอธิบายอย่างน้อย 20 ตัวอักษร" : "Enter a name, map destination and description of at least 20 characters.");
      if (!Number.isFinite(draft.entrance_fee) || draft.entrance_fee < 0) throw new Error(th ? "ค่าเข้าชมต้องเป็นเลขตั้งแต่ 0 ขึ้นไป" : "Admission must be zero or greater.");
      if (draft.sourceUrl && !safeExternalUrl(draft.sourceUrl)) throw new Error(th ? "ใช้ลิงก์แหล่งข้อมูลแบบ https หรือ http โดยไม่มีชื่อผู้ใช้หรือรหัสผ่าน" : "Use an HTTP/HTTPS reference URL without embedded credentials.");
      if (draft.image && !safeImageSource(draft.image)) throw new Error(th ? "รูปภาพต้องเป็นลิงก์ http/https หรือไฟล์รูปที่รองรับ ขนาดไม่เกิน 2 MB" : "Use an HTTP/HTTPS image URL or a supported image of up to 2 MB.");
      const data = { ...draft, name: draft.name.trim(), place_description: draft.place_description.trim(), mapsQuery: draft.mapsQuery?.trim() };
      if (mode === "edit" && attractionId) updateAttraction(attractionId, data); else addAttraction(data);
      onNavigate("manage");
    } catch (e) {
      setError(e instanceof DOMException ? (th ? "บันทึกไม่สำเร็จ พื้นที่จัดเก็บเบราว์เซอร์อาจเต็ม" : "Could not save. Browser storage may be full.") : e instanceof Error ? e.message : (th ? "บันทึกไม่สำเร็จ" : "Could not save"));
    }
  };
  return <div className="mx-auto max-w-4xl px-6 py-12">
    <button onClick={() => onNavigate("manage")} className="link-line inline-flex items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4" />{th ? "กลับไปจัดการสถานที่" : "Back to management"}</button>
    <h1 className="mt-10 font-display text-4xl md:text-5xl">{t(mode === "add" ? "form.add.title" : "form.edit.title")}</h1>
    <p className="mt-4 text-sm text-muted-foreground">{th ? "ข้อมูลนี้บันทึกในเบราว์เซอร์นี้ กรุณาตรวจสอบชื่อและจุดหมาย Google Maps ก่อนบันทึก" : "Changes are saved in this browser. Verify the place name and Google Maps destination before saving."}</p>
    <form onSubmit={submit} className="mt-12 space-y-10">
      <fieldset className="space-y-6 border-t border-border pt-6">
        <legend className="eyebrow px-2">{th ? "ข้อมูลสถานที่" : "Place information"}</legend>
        <div className="grid gap-6 md:grid-cols-2">{textField("name", "Name / ชื่อหลัก", true)}{textField("nameTh", "ชื่อภาษาไทย")}</div>
        {textField("place_description", "Description / คำอธิบายหลัก", true, true)}
        {textField("descriptionTh", "คำอธิบายภาษาไทย", false, true)}
        <label className="block space-y-2"><span className="text-sm">{t("form.category")}</span><select className={input} value={draft.category} onChange={e => set("category", e.target.value)}>{categories.map(c => <option key={c} value={c}>{t(categoryKey(c))}</option>)}</select></label>
      </fieldset>
      <fieldset className="space-y-6 border-t border-border pt-6">
        <legend className="eyebrow px-2">{th ? "ตำแหน่งและการเดินทาง" : "Location and directions"}</legend>
        {textField("mapsQuery", th ? "จุดหมาย Google Maps (ชื่อเต็ม + ตำบล/อำเภอ/จังหวัด)" : "Google Maps destination (full place name + district/province)", true)}
        {draft.mapsQuery && <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(draft.mapsQuery)} target="_blank" rel="noreferrer" className="link-line inline-block text-sm">{th ? "ตรวจสอบจุดหมายบน Google Maps ↗" : "Check destination on Google Maps ↗"}</a>}
        <div className="grid gap-6 md:grid-cols-2">{textField("address", "Address / ที่อยู่หลัก")}{textField("addressTh", "ที่อยู่ภาษาไทย")}</div>
        {textField("phone", th ? "โทรศัพท์ (เมื่อมีข้อมูลยืนยัน)" : "Phone (if verified)")}
      </fieldset>
      <fieldset className="space-y-6 border-t border-border pt-6">
        <legend className="eyebrow px-2">{th ? "วางแผนเข้าชม" : "Plan a visit"}</legend>
        <label className="block space-y-2"><span className="text-sm">{th ? "ค่าเข้าชมพื้นฐาน (บาท)" : "Base admission (THB)"}</span><input type="number" name="entrance_fee" min="0" step="1" required className={input} value={draft.entrance_fee} onChange={e => set("entrance_fee", e.target.valueAsNumber)} /></label>
        <div className="grid gap-6 md:grid-cols-2">{textField("feeLabel", "Admission details / หมายเหตุค่าเข้าชม")}{textField("feeLabelTh", "หมายเหตุค่าเข้าชมภาษาไทย")}</div>
        <div className="grid gap-6 md:grid-cols-2">{textField("open_hours", "Opening hours / เวลาเข้าชม", true)}{textField("openHoursTh", "เวลาเข้าชมภาษาไทย")}</div>
        <div className="grid gap-6 md:grid-cols-2">{textField("visitTip", "Visiting advice / คำแนะนำ", false, true)}{textField("visitTipTh", "คำแนะนำภาษาไทย", false, true)}</div>
      </fieldset>
      <fieldset className="space-y-6 border-t border-border pt-6">
        <legend className="eyebrow px-2">{th ? "ภาพและแหล่งข้อมูล" : "Image and references"}</legend>
        {textField("image", th ? "ลิงก์รูปภาพ" : "Image URL")}
        <label className="block space-y-3 text-sm"><span className="flex items-center gap-2"><Upload className="h-4 w-4" />{th ? "อัปโหลด JPG / PNG / WebP / GIF (ไม่เกิน 2 MB)" : "Upload JPG / PNG / WebP / GIF (up to 2 MB)"}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={async e => {
            const generation = ++uploadGeneration.current;
            setReading(false);
            const file = e.target.files?.[0];
            if (!file) return;
            if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size === 0 || file.size > MAX_IMAGE_BYTES) { setError(th ? "ใช้ไฟล์รูปภาพขนาดไม่เกิน 2 MB" : "Use an image of up to 2 MB."); return; }
            setReading(true); setError("");
            try {
              const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
              if (generation !== uploadGeneration.current) return;
              if (!matchesImageSignature(file.type, bytes)) throw new Error('Unsupported image contents');
            } catch {
              if (generation === uploadGeneration.current) { setReading(false); setError(th ? 'เนื้อหาไฟล์ไม่ตรงกับชนิดรูปภาพ หรืออ่านไฟล์ไม่ได้' : 'The file contents do not match a supported image, or could not be read.'); }
              return;
            }
            const reader = new FileReader();
            reader.onload = () => { if (generation === uploadGeneration.current) set("image", String(reader.result)); };
            reader.onerror = () => { if (generation === uploadGeneration.current) { setError(th ? "อ่านรูปภาพไม่สำเร็จ" : "Could not read image"); setReading(false); } };
            reader.readAsDataURL(file);
          }} />
        </label>
        <div className="grid gap-6 md:grid-cols-2">{textField("sourceName", th ? "ชื่อแหล่งอ้างอิง" : "Reference name")}{textField("sourceUrl", th ? "ลิงก์แหล่งอ้างอิง" : "Reference URL")}</div>
      </fieldset>
      {error && <p role="alert" className="border border-destructive p-4 text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-5 pb-12"><button type="submit" disabled={reading} className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm text-primary-foreground disabled:opacity-50"><Save className="h-4 w-4" />{t("form.save")}</button><button type="button" onClick={() => onNavigate("manage")} className="border border-border px-8 py-4 text-sm">{t("attractions.cancel")}</button></div>
    </form>
  </div>;
}
