export interface TouristAttraction {
  id: number;
  name: string;
  nameTh?: string;
  place_description: string;
  descriptionTh?: string;
  entrance_fee: number;
  feeLabel?: string;
  feeLabelTh?: string;
  open_hours: string;
  openHoursTh?: string;
  image?: string;
  category?: string;
  rating?: number;
  address?: string;
  addressTh?: string;
  mapsQuery?: string;
  sourceUrl?: string;
  sourceName?: string;
  phone?: string;
  visitTip?: string;
  visitTipTh?: string;
}

export const mockAttractions: TouristAttraction[] = [
  {
    id: 1,
    name: "Kamphaeng Phet Historical Park",
    nameTh: "อุทยานประวัติศาสตร์กำแพงเพชร",
    place_description: "Walk among laterite temples, city walls and forest monasteries on the east bank of the Ping River. Wat Phra Kaeo and Wat Phra That stand inside the old city; Wat Chang Rob and Wat Phra Si Iriyabot lie in the Aranyik zone to the north. The historic town forms part of the Sukhothai and Associated Historic Towns World Heritage property, inscribed in 1991.",
    descriptionTh: "เดินชมโบราณสถานศิลาแลง กำแพงเมือง และวัดอรัญญิกฝั่งตะวันออกของแม่น้ำปิง เขตในเมืองมีวัดพระแก้วและวัดพระธาตุ ส่วนเขตอรัญญิกทางเหนือมีวัดช้างรอบและวัดพระสี่อิริยาบถ เมืองกำแพงเพชรเป็นส่วนหนึ่งของแหล่งมรดกโลกนครประวัติศาสตร์สุโขทัยและเมืองบริวาร ซึ่งขึ้นทะเบียนใน พ.ศ. 2534",
    entrance_fee: 0,
    feeLabel: "Ticket options vary by zone; confirm at the park",
    feeLabelTh: "บัตรเข้าชมขึ้นอยู่กับเขตพื้นที่ โปรดสอบถามอุทยาน",
    open_hours: "Check current hours with the historical park",
    openHoursTh: "ตรวจสอบเวลาเข้าชมล่าสุดกับอุทยาน",
    category: "Historical Site",
    image: "/images/historical-park.webp",
    address: "Nai Mueang and Nong Pling, Mueang Kamphaeng Phet, Kamphaeng Phet",
    addressTh: "ต.ในเมือง และ ต.หนองปลิง อ.เมืองกำแพงเพชร จ.กำแพงเพชร",
    mapsQuery: "Kamphaeng Phet Historical Park Nong Pling Kamphaeng Phet",
    sourceName: "UNESCO World Heritage Centre",
    sourceUrl: "https://whc.unesco.org/en/list/574/",
    visitTip: "The walled city and Aranyik are separate visiting zones. Allow time to travel between them and bring water for the open-air paths.",
    visitTipTh: "เขตในเมืองและเขตอรัญญิกเป็นคนละพื้นที่ ควรเผื่อเวลาเดินทางระหว่างเขต และเตรียมน้ำดื่มสำหรับเส้นทางกลางแจ้ง"
  },
  {
    id: 2,
    name: "Wat Phra Borommathat, Nakhon Chum",
    nameTh: "วัดพระบรมธาตุ นครชุม",
    place_description: "An active monastery in Nakhon Chum on the west bank of the Ping River. The Nakhon Chum inscription records the establishment of Buddhist relics and a Bodhi tree by King Li Thai in 1357. The prominent golden stupa reflects later Burmese and Mon rebuilding, rather than the original Sukhothai-period form.",
    descriptionTh: "วัดสำคัญของชุมชนนครชุม ฝั่งตะวันตกของแม่น้ำปิง จารึกนครชุมกล่าวถึงการประดิษฐานพระบรมสารีริกธาตุและปลูกต้นพระศรีมหาโพธิ์ในรัชสมัยพระมหาธรรมราชาลิไท เมื่อ พ.ศ. 1900 เจดีย์สีทองที่เห็นในปัจจุบันผ่านการบูรณะในรูปแบบศิลปะพม่าและมอญภายหลัง ไม่ใช่รูปทรงดั้งเดิมสมัยสุโขทัย",
    entrance_fee: 0,
    feeLabel: "Confirm locally; donations welcome",
    feeLabelTh: "สอบถามที่วัด สามารถร่วมทำบุญได้",
    open_hours: "Visit during daylight; respect services",
    openHoursTh: "แนะนำเข้าชมช่วงกลางวัน และเคารพเวลาประกอบศาสนกิจ",
    category: "Temple",
    image: "/images/wat-phra-borommathat.webp",
    address: "Nakhon Chum, Mueang Kamphaeng Phet, Kamphaeng Phet",
    addressTh: "ต.นครชุม อ.เมืองกำแพงเพชร จ.กำแพงเพชร",
    mapsQuery: "Wat Phra Borommathat Nakhon Chum Kamphaeng Phet",
    sourceName: "Princess Maha Chakri Sirindhorn Anthropology Centre",
    sourceUrl: "https://archaeology.sac.or.th/archaeology/458",
    visitTip: "This is a living temple. Dress modestly, remove shoes where requested, and give worshippers space.",
    visitTipTh: "เป็นวัดที่ยังมีพระสงฆ์จำพรรษา ควรแต่งกายสุภาพ ถอดรองเท้าในบริเวณที่กำหนด และไม่รบกวนผู้มาประกอบศาสนกิจ"
  },
  {
    id: 3,
    name: "Khlong Lan National Park",
    nameTh: "อุทยานแห่งชาติคลองลาน",
    place_description: "A forested national park of approximately 300 square kilometres in western Kamphaeng Phet. Its signature Khlong Lan waterfall drops about 100 metres across a broad cliff, close to park headquarters. Khlong Nam Lai is a different, nine-tier waterfall in another part of the park.",
    descriptionTh: "อุทยานป่าเขาทางตะวันตกของกำแพงเพชร ครอบคลุมพื้นที่ประมาณ 300 ตารางกิโลเมตร จุดเด่นคือน้ำตกคลองลานที่สูงประมาณ 100 เมตร อยู่ใกล้ที่ทำการอุทยาน ส่วนน้ำตกคลองน้ำไหลเป็นน้ำตกเก้าชั้นอีกแห่งหนึ่งซึ่งอยู่คนละบริเวณ ไม่ควรสับสนกับน้ำตกคลองลาน",
    entrance_fee: 40,
    feeLabel: "Thai adults ฿40 / foreign adults ฿200; check latest rates",
    feeLabelTh: "ผู้ใหญ่ไทย 40 บาท / ต่างชาติ 200 บาท โปรดตรวจสอบอัตราล่าสุด",
    open_hours: "Confirm day-visit hours and seasonal access with the park",
    openHoursTh: "ตรวจสอบเวลาเข้าชมและการเปิดพื้นที่ตามฤดูกาลกับอุทยาน",
    category: "National Park",
    image: "/images/khlong-lan.webp",
    address: "Khlong Lan Phatthana, Khlong Lan, Kamphaeng Phet",
    addressTh: "ต.คลองลานพัฒนา อ.คลองลาน จ.กำแพงเพชร",
    mapsQuery: "Khlong Lan National Park Headquarters Kamphaeng Phet",
    sourceName: "Tourism Authority of Thailand",
    sourceUrl: "https://thai.tourismthailand.org/Attraction/อุทยานแห่งชาติคลองลาน",
    visitTip: "Follow ranger advice around slippery rocks and strong currents. The map points to headquarters near Khlong Lan waterfall.",
    visitTipTh: "ปฏิบัติตามคำแนะนำเจ้าหน้าที่ ระวังหินลื่นและกระแสน้ำ แผนที่นำไปยังที่ทำการอุทยานใกล้น้ำตกคลองลาน"
  },
  {
    id: 4,
    name: "Kamphaeng Phet National Museum",
    nameTh: "พิพิธภัณฑสถานแห่งชาติ กำแพงเพชร",
    place_description: "A compact introduction to the archaeology and art of Kamphaeng Phet, with finds from excavations and conservation work across the province. The museum opened on 19 March 1971 and complements a visit to the nearby historic city. It is the National Museum on Pin Damri Road, not a similarly named local museum.",
    descriptionTh: "แหล่งเรียนรู้โบราณคดีและศิลปกรรมของกำแพงเพชร จัดแสดงโบราณวัตถุจากการขุดค้นและบูรณะในจังหวัด เปิดอย่างเป็นทางการเมื่อวันที่ 19 มีนาคม พ.ศ. 2514 เหมาะสำหรับทำความเข้าใจเรื่องราวของเมืองก่อนหรือหลังชมโบราณสถาน โดยเป็นพิพิธภัณฑสถานแห่งชาติบนถนนปิ่นดำริ ไม่ใช่พิพิธภัณฑ์ท้องถิ่นชื่อคล้ายกัน",
    entrance_fee: 0,
    feeLabel: "Confirm admission with the museum",
    feeLabelTh: "สอบถามค่าเข้าชมล่าสุดกับพิพิธภัณฑ์",
    open_hours: "Confirm opening days, holidays and hours before travelling",
    openHoursTh: "ตรวจสอบวันเปิด วันหยุด และเวลาเข้าชมก่อนเดินทาง",
    category: "Museum",
    image: "/images/national-museum.webp",
    address: "120 Pin Damri Road, Nai Mueang, Mueang Kamphaeng Phet, Kamphaeng Phet 62000",
    addressTh: "120 ถนนปิ่นดำริ ต.ในเมือง อ.เมืองกำแพงเพชร จ.กำแพงเพชร 62000",
    mapsQuery: "Kamphaeng Phet National Museum Pin Damri Road",
    sourceName: "Fine Arts Department",
    sourceUrl: "https://www.finearts.go.th/kamphaengphetmuseum",
    phone: "055 711 570",
    visitTip: "Call ahead to confirm opening days and temporary exhibition arrangements.",
    visitTipTh: "ควรโทรสอบถามวันเปิดและการจัดแสดงชั่วคราวก่อนเดินทาง"
  },
  {
    id: 5,
    name: "Mae Wong National Park",
    nameTh: "อุทยานแห่งชาติแม่วงก์",
    place_description: "A mountainous protected area spanning Kamphaeng Phet and Nakhon Sawan. The Kamphaeng Phet approach leads towards Chong Yen, known for cool conditions, birdwatching and camping. Longer treks, including Mokochu, need advance arrangements with park staff; the summit is not a drive-up attraction.",
    descriptionTh: "ผืนป่าอนุรักษ์บนภูเขาที่ครอบคลุมกำแพงเพชรและนครสวรรค์ เส้นทางฝั่งกำแพงเพชรเชื่อมไปยังช่องเย็น ซึ่งเหมาะกับการชมธรรมชาติ ดูนก และกางเต็นท์ ส่วนเส้นทางเดินป่าระยะไกล เช่น ยอดเขาโมโกจู ต้องติดต่อและเตรียมการกับเจ้าหน้าที่ล่วงหน้า ไม่ใช่จุดที่ขับรถขึ้นไปได้",
    entrance_fee: 40,
    feeLabel: "Thai adults ฿40 / foreign adults ฿200; camping costs extra",
    feeLabelTh: "ผู้ใหญ่ไทย 40 บาท / ต่างชาติ 200 บาท ค่าพักแรมคิดแยก",
    open_hours: "Route opening and overnight stays require park confirmation",
    openHoursTh: "ตรวจสอบการเปิดเส้นทางและการพักแรมกับอุทยานก่อนเดินทาง",
    category: "National Park",
    image: "/images/mae-wong.webp",
    address: "Pang Ta Wai, Pang Sila Thong, Kamphaeng Phet",
    addressTh: "ต.ปางตาไว อ.ปางศิลาทอง จ.กำแพงเพชร",
    mapsQuery: "Mae Wong National Park Headquarters Pang Ta Wai Pang Sila Thong",
    sourceName: "Tourism Authority of Thailand",
    sourceUrl: "https://thai.tourismthailand.org/Attraction/อุทยานแห่งชาติแม่วงก์",
    visitTip: "The map opens the park headquarters on the Kamphaeng Phet side. Check road conditions, campsite availability and trekking permissions before departure.",
    visitTipTh: "แผนที่ระบุที่ทำการอุทยานฝั่งกำแพงเพชร ควรตรวจสอบสภาพถนน พื้นที่กางเต็นท์ และการอนุญาตเดินป่าก่อนออกเดินทาง"
  }
];

export const attractionName = (a: TouristAttraction, th: boolean) => th && a.nameTh ? a.nameTh : a.name;
export const attractionDescription = (a: TouristAttraction, th: boolean) => th && a.descriptionTh ? a.descriptionTh : a.place_description;
export const attractionHours = (a: TouristAttraction, th: boolean) => th && a.openHoursTh ? a.openHoursTh : a.open_hours;
export const attractionFee = (a: TouristAttraction, th: boolean) => (th ? a.feeLabelTh : a.feeLabel) || ('฿' + a.entrance_fee);
export const attractionAddress = (a: TouristAttraction, th: boolean) => (th ? a.addressTh : a.address) || a.address || '';
export const mapQuery = (a: TouristAttraction) => a.mapsQuery || [a.name, a.address, 'Kamphaeng Phet Thailand'].filter(Boolean).join(' ');
export const googleMapsUrl = (a: TouristAttraction) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQuery(a));
export const googleDirectionsUrl = (a: TouristAttraction) => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(mapQuery(a));
