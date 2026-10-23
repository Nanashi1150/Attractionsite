import { ArrowUpRight, Landmark, MapPin, Trees } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { type Page } from "../../hooks/useRouter";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { timelineData } from "../../data/timelineData";
import { photoCredits, sitePhoto } from "../../data/photoCredits";

export function AboutPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const { language } = useLanguage();
  const th = language === "th";
  const L = (en: string, thai: string) => th ? thai : en;
  return <div>
    <section className="relative flex min-h-[75svh] items-end overflow-hidden pt-32 text-white">
      <ImageWithFallback src={sitePhoto('about-hero')} alt={L("Historic city wall of Kamphaeng Phet", "แนวกำแพงเมืองเก่ากำแพงเพชร")} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/35" />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
        <span className="eyebrow !text-white/75">{L("A province with stories to tell", "เรื่องราวของเมืองกำแพงเพชร")}</span>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-light leading-tight md:text-7xl">{L("Where the river meets history", "เมื่อสายน้ำไหลผ่านประวัติศาสตร์")}</h1>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85">{L("Laterite temples, a living riverside community and forests to the west. Get to know the places behind the name Kamphaeng Phet.", "วัดศิลาแลง ชุมชนริมแม่น้ำที่ยังมีชีวิต และผืนป่าทางตะวันตก ทำความรู้จักเรื่องราวเบื้องหลังชื่อ “กำแพงเพชร” ก่อนออกไปสัมผัสด้วยตัวเอง")}</p>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-32">
      <div className="flex flex-col justify-center">
        <span className="eyebrow">{L("Two banks, one connected story", "สองฝั่งปิง เรื่องราวที่เชื่อมถึงกัน")}</span>
        <h2 className="mt-6 font-display text-4xl font-light leading-tight md:text-5xl">{L("More than a stop among the ruins", "มากกว่าการเดินชมเมืองเก่า")}</h2>
        <p className="mt-8 text-base leading-loose text-muted-foreground">{L("Kamphaeng Phet lies along the Ping River in Thailand's lower north. On the east bank, laterite monuments reveal the historic city's Sukhothai and Ayutthaya connections. Across the river, Nakhon Chum brings together an ancient settlement and an active temple community.", "กำแพงเพชรตั้งอยู่ริมแม่น้ำปิงในภาคเหนือตอนล่าง ฝั่งตะวันออกมีโบราณสถานศิลาแลงที่สะท้อนความสัมพันธ์กับสุโขทัยและอยุธยา ส่วนฝั่งตะวันตกคือนครชุม เมืองโบราณที่เรื่องราวในอดีตยังเชื่อมอยู่กับวัดและชุมชนปัจจุบัน")}</p>
        <p className="mt-5 text-base leading-loose text-muted-foreground">{L("The historic town shares UNESCO recognition with Sukhothai and Si Satchanalai. Beyond the monuments, Khlong Lan's waterfall and Mae Wong's forested highlands offer another side of the province. Plan time for both culture and nature, rather than treating every destination as part of the same park.", "เมืองประวัติศาสตร์แห่งนี้เป็นมรดกโลกร่วมกับสุโขทัยและศรีสัชนาลัย นอกเหนือจากโบราณสถาน ยังมีน้ำตกคลองลานและป่าเขาแม่วงก์ให้ค้นพบ ควรแบ่งเวลาเที่ยววัฒนธรรมและธรรมชาติให้เหมาะสม เพราะแต่ละสถานที่ไม่ได้อยู่ในอุทยานเดียวกัน")}</p>
        <a href="https://whc.unesco.org/en/list/574/" target="_blank" rel="noreferrer" className="link-line mt-7 self-start text-xs uppercase tracking-widest">UNESCO World Heritage Centre <ArrowUpRight className="inline h-3 w-3" /></a>
      </div>
      <figure className="self-center">
        <ImageWithFallback src={sitePhoto('about-culture')} alt={L("Wat Phra Borommathat in Nakhon Chum", "วัดพระบรมธาตุ นครชุม")} loading="lazy" className="aspect-[4/5] w-full object-cover" />
        <figcaption className="mt-4 text-xs text-muted-foreground">{L("Wat Phra Borommathat · Nakhon Chum, west of the Ping", "วัดพระบรมธาตุ · นครชุม ฝั่งตะวันตกของแม่น้ำปิง")}</figcaption>
      </figure>
    </section>

    <section aria-labelledby="roadmap-title" className="border-y border-border bg-secondary/60">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow">{L("Historical roadmap", "Roadmap · เส้นทางประวัติศาสตร์")}</span>
          <h2 id="roadmap-title" className="mt-6 font-display text-4xl font-light md:text-5xl">{L("Follow the story through time", "ตามรอยเมือง ผ่านกาลเวลา")}</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{L("Five milestones connect the surviving evidence with the place you can explore today.", "ห้าช่วงเวลาที่เชื่อมหลักฐานในอดีตเข้ากับพื้นที่ที่เราเดินทางไปเรียนรู้ได้ในวันนี้")}</p>
        </div>
        <ol className="roadmap relative">
          {timelineData.map((era, i) => <li key={era.year} className={"roadmap-step relative pb-10 pl-12 md:w-1/2 md:pb-16 " + (i % 2 === 0 ? "md:pr-12 md:pl-0" : "md:ml-auto md:pl-12")}>
            <span aria-hidden="true" className={"roadmap-dot absolute left-0 top-7 flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-background text-[10px] text-gold " + (i % 2 === 0 ? "md:-right-3.5 md:left-auto" : "md:-left-3.5")}>{String(i + 1).padStart(2, "0")}</span>
            <article className="border border-border bg-background p-6 md:p-8">
              <p className="text-sm font-medium tracking-wide text-gold">{th ? era.yearTh : era.year}</p>
              <h3 className="mt-4 font-display text-2xl leading-snug">{th ? era.titleTh : era.title}</h3>
              <p className="mt-4 text-sm leading-loose text-muted-foreground">{th ? era.descriptionTh : era.description}</p>
              <a href={era.source} target="_blank" rel="noreferrer" className="link-line mt-5 inline-block text-xs text-muted-foreground">{L("Read the reference", "อ่านแหล่งอ้างอิง")} ↗</a>
            </article>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="grid gap-12 md:grid-cols-3">
        {[
          { icon: Landmark, title: L("The historic city", "เมืองประวัติศาสตร์"), description: L("Start with the old city's temples, then continue to the forest monasteries of Aranyik. Keep to marked routes and leave the monuments untouched.", "เริ่มจากวัดในเมืองเก่า แล้วต่อไปยังกลุ่มวัดอรัญญิก เดินตามเส้นทางที่กำหนดและไม่สัมผัสหรือปีนโบราณสถาน") },
          { icon: MapPin, title: L("Living Nakhon Chum", "นครชุมที่ยังมีชีวิต"), description: L("Cross the Ping to visit Wat Phra Borommathat. Distinguish this active temple from the ruined monuments inside the historical park.", "ข้ามแม่น้ำปิงไปสักการะวัดพระบรมธาตุ วัดที่ยังมีศาสนกิจแห่งนี้เป็นคนละสถานที่กับวัดร้างในอุทยานประวัติศาสตร์") },
          { icon: Trees, title: L("Forest and waterfall", "ป่าเขาและสายน้ำ"), description: L("Visit Khlong Lan or plan a separate journey to Mae Wong. Ask park staff about seasonal closures, road conditions and overnight stays.", "เที่ยวคลองลาน หรือจัดทริปแม่วงก์แยกต่างหาก สอบถามเจ้าหน้าที่เรื่องการปิดพื้นที่ตามฤดูกาล สภาพถนน และการพักแรม") }
        ].map(item => <article key={item.title} className="border-t border-border pt-7"><item.icon className="h-6 w-6 text-gold" /><h3 className="mt-5 font-display text-2xl">{item.title}</h3><p className="mt-4 text-sm leading-loose text-muted-foreground">{item.description}</p></article>)}
      </div>
    </section>
    <section className="relative overflow-hidden text-white">
      <ImageWithFallback src={sitePhoto('about-nature')} alt={L("Khlong Lan waterfall", "น้ำตกคลองลาน")} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <span className="eyebrow !text-white/80">{L("From stories to places", "จากเรื่องราว สู่การเดินทาง")}</span>
        <h2 className="mt-6 font-display text-4xl font-light md:text-5xl">{L("Choose your next chapter", "เลือกบทต่อไปของการเดินทาง")}</h2>
        <button onClick={() => onNavigate?.("attractions")} className="mt-9 border border-white/70 px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black">{L("Explore attractions", "ดูสถานที่ท่องเที่ยว")}</button>
      </div>
    </section>
    <section id="photo-credits" className="mx-auto max-w-7xl px-6 pt-20 lg:px-10">
      <details className="border-y border-border py-6 text-xs text-muted-foreground">
        <summary className="cursor-pointer">{L("Photo credits & sources", "เครดิตภาพและแหล่งข้อมูล")}</summary>
        <p className="mt-4 leading-relaxed">{L("Place-specific photographs from Wikimedia Commons. Local copies have been resized, compressed and may be cropped in the layout; derivatives retain the linked licenses. Research references are linked with each story and attraction.", "ภาพสถานที่จริงจาก Wikimedia Commons ปรับขนาดและบีบอัดเพื่อใช้บนเว็บ โดยอาจมีการครอบภาพตามพื้นที่แสดงผล ภาพที่ปรับยังคงใช้สัญญาอนุญาตตามลิงก์ด้านล่าง และมีแหล่งอ้างอิงประกอบแต่ละเรื่องราวและสถานที่")}</p>
        <ul className="mt-5 space-y-3">{photoCredits.map(p => <li key={p.image}><a className="underline underline-offset-2" href={p.source} target="_blank" rel="noreferrer">{p.place} — {p.author}</a>{" · "}<a className="underline underline-offset-2" href={p.licenseUrl} target="_blank" rel="noreferrer">{p.license}</a></li>)}</ul>
      </details>
    </section>
  </div>;
}
