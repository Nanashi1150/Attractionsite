import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.manage': 'Manage Attractions',
    'nav.tourism': 'Kamphaeng Phet Tourism',
    
    // Index Page
    'index.title': 'Kamphaeng Phet, beyond the ancient walls',
    'index.subtitle': 'Follow the Ping River through a province of laterite temples, living traditions and forest waterfalls. Discover the historic city, cross to Nakhon Chum, and find your way into nature.',
    'index.historical': 'Historical Significance',
    'index.historical.desc': 'UNESCO World Heritage site with over 700 years of history',
    'index.architecture': 'Living Traditions',
    'index.architecture.desc': 'Meet the temple community of Nakhon Chum on the western bank of the Ping',
    'index.nature': 'Natural Beauty',
    'index.nature.desc': 'Stunning landscapes and peaceful surroundings',
    'index.manage.btn': 'Manage Tourist Attractions',
    'index.top.title': 'Three places to begin',
    'index.top.subtitle': 'Begin with the historic city, Nakhon Chum and the waterfall at Khlong Lan',
    'index.view.details': 'View Details',
    'index.no.attractions': 'No attractions available at the moment.',
    'index.add.first': 'Add Your First Attraction',
    'index.experience': 'Experience History',
    'index.discover': 'Discover Heritage',
    'index.explore': 'Explore Culture',
    
    // About Page
    'about.title': 'Kamphaeng Phet Historical Park',
    'about.subtitle': 'Journey through seven centuries of Thai heritage, where ancient kingdoms rose and left behind magnificent testimonies of their glory.',
    'about.heritage.site': 'UNESCO World Heritage Site',
    'about.stats.years': 'Years of History',
    'about.stats.temples': 'Temples & Ruins',
    'about.stats.heritage': 'World Heritage',
    'about.stats.inscribed': 'Inscribed Year',
    'about.history.title': 'Historical Journey',
    'about.history.subtitle': 'Trace the magnificent rise and evolution of one of Thailand\'s most significant historical sites through the ages.',
    'about.artifacts.title': 'Ancient Treasures',
    'about.artifacts.subtitle': 'Discover the remarkable artifacts and architectural marvels that have survived through centuries, each telling a unique story of ancient Thai civilization.',
    'about.artifacts.ancient': 'Ancient Artifact',
    'about.artifacts.significance': 'Cultural Significance',
    'about.cta.title': 'Preserve Our Heritage',
    'about.cta.subtitle': 'Help us continue preserving and sharing the incredible legacy of Kamphaeng Phet for future generations.',
    'about.cta.explore': 'Explore More',
    
    // Attractions Page
    'attractions.title': 'Tourist Attractions Management',
    'attractions.subtitle': 'Manage all tourist attractions in Kamphaeng Phet',
    'attractions.add.new': 'Add New Attraction',
    'attractions.card.view': 'Card View',
    'attractions.table.view': 'Table View',
    'attractions.view': 'View',
    'attractions.edit': 'Edit',
    'attractions.delete': 'Delete',
    'attractions.confirm.delete': 'Are you sure?',
    'attractions.delete.desc': 'This action cannot be undone. This will permanently delete the attraction',
    'attractions.cancel': 'Cancel',
    'attractions.no.available': 'No attractions available yet.',
    
    // Form Page
    'form.add.title': 'Add New Attraction',
    'form.edit.title': 'Edit Attraction',
    'form.add.subtitle': 'Fill in the details for the new tourist attraction',
    'form.edit.subtitle': 'Update the attraction information',
    'form.back': 'Back to Attractions',
    'form.details.title': 'Attraction Details',
    'form.details.subtitle': 'Please provide accurate information about the tourist attraction',
    'form.name': 'Name',
    'form.name.placeholder': 'Enter attraction name',
    'form.description': 'Description',
    'form.description.placeholder': 'Describe the attraction (minimum 20 characters)',
    'form.entrance.fee': 'Entrance Fee (฿)',
    'form.open.hours': 'Open Hours',
    'form.open.hours.placeholder': 'e.g., 08:00 - 18:00',
    'form.category': 'Category',
    'form.category.placeholder': 'Select category',
    'form.rating': 'Rating (1-5)',
    'form.image': 'Attraction Image',
    'form.image.subtitle': 'Upload a representative image of the attraction',
    'form.upload': 'Upload Image',
    'form.remove.image': 'Remove Image',
    'form.characters': 'characters',
    'form.save': 'Save',
    'form.saving': 'Saving...',
    'form.add.attraction': 'Add Attraction',
    'form.update.attraction': 'Update Attraction',
    'form.required': 'This field is required',
    'form.description.min': 'Description must be at least 20 characters',
    'form.fee.invalid': 'Entrance fee must be a valid positive number',
    
    // Detail Page
    'detail.not.found': 'Attraction Not Found',
    'detail.not.found.desc': 'The requested tourist attraction could not be found.',
    'detail.back': 'Back to Attractions',
    'detail.about': 'About This Attraction',
    'detail.visitor.info': 'Visitor Information',
    'detail.opening.hours': 'Opening Hours',
    'detail.entrance.fee': 'Entrance Fee',
    'detail.notes': 'Important Notes',
    'detail.quick.facts': 'Quick Facts',
    'detail.visit.planning': 'Visit Planning',
    'detail.best.time': 'Best Time to Visit',
    'detail.best.time.desc': 'Early morning or late afternoon for cooler temperatures',
    'detail.duration': 'Recommended Duration',
    'detail.duration.desc': '2-3 hours for a comprehensive visit',
    'detail.contact': 'Contact & Location',
    'detail.address': 'Address',
    'detail.phone': 'Phone',
    
    // Categories
    'category.historical': 'Historical Site',
    'category.temple': 'Temple',
    'category.park': 'National Park',
    'category.museum': 'Museum',
    'category.natural': 'Natural Attraction',
    'category.cultural': 'Cultural Site',
    'category.unspecified': 'Unspecified',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.none': 'None',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Footer
    'footer.copyright': '© 2024 Kamphaeng Phet Tourism Management System',
    'footer.subtitle': 'Stories, places and practical journeys through Kamphaeng Phet',
  },
  th: {
    // Navigation
    'nav.home': 'หน้าหลัก',
    'nav.about': 'เกี่ยวกับ',
    'nav.manage': 'จัดการสถานที่ท่องเที่ยว',
    'nav.tourism': 'การท่องเที่ยวกำแพงเพชร',
    
    // Index Page
    'index.title': 'กำแพงเพชร เมืองเก่าที่มีชีวิต',
    'index.subtitle': 'ตามสายน้ำปิงไปพบวัดศิลาแลง ชุมชนที่สืบสานวิถีท้องถิ่น และน้ำตกกลางผืนป่า เริ่มจากเมืองประวัติศาสตร์ ข้ามฝั่งสู่นครชุม แล้วออกไปสัมผัสธรรมชาติ',
    'index.historical': 'ความสำคัญทางประวัติศาสตร์',
    'index.historical.desc': 'มรดกโลกของยูเนสโกที่มีประวัติศาสตร์กว่า 700 ปี',
    'index.architecture': 'วิถีที่ยังมีชีวิต',
    'index.architecture.desc': 'รู้จักชุมชนและวัดของนครชุมบนฝั่งตะวันตกของแม่น้ำปิง',
    'index.nature': 'ความงามทางธรรมชาติ',
    'index.nature.desc': 'ทิวทัศน์อันน่าทึ่งและสภาพแวดล้อมที่เงียบสงบ',
    'index.manage.btn': 'จัดการสถานที่ท่องเที่ยว',
    'index.top.title': 'สามจุดหมาย เริ่มต้นการเดินทาง',
    'index.top.subtitle': 'รู้จักเมืองประวัติศาสตร์ นครชุม และน้ำตกคลองลาน',
    'index.view.details': 'ดูรายละเอียด',
    'index.no.attractions': 'ยังไม่มีสถานที่ท่องเที่ยวในขณะนี้',
    'index.add.first': 'เพิ่มสถานที่ท่องเที่ยวแรกของคุณ',
    'index.experience': 'สัมผัสประวัติศาสตร์',
    'index.discover': 'ค้นพบมรดก',
    'index.explore': 'สำรวจวัฒนธรรม',
    
    // About Page
    'about.title': 'อุทยานประวัติศาสตร์กำแพงเพชร',
    'about.subtitle': 'เดินทางผ่านเจ็ดศตวรรษของมรดกไทย ที่อาณาจักรโบราณได้เจริญรุ่งเรืองและทิ้งพยานหลักฐานอันงดงามของความรุ่งโรจน์ไว้',
    'about.heritage.site': 'มรดกโลกของยูเนสโก',
    'about.stats.years': 'ปีแห่งประวัติศาสตร์',
    'about.stats.temples': 'วัดและโบราณสถาน',
    'about.stats.heritage': 'มรดกโลก',
    'about.stats.inscribed': 'ปีที่ขึ้นทะเบียน',
    'about.history.title': 'การเดินทางทางประวัติศาสตร์',
    'about.history.subtitle': 'ติดตามการเกิดขึ้นและวิวัฒนาการอันยิ่งใหญ่ของแหล่งประวัติศาสตร์ที่สำคัญที่สุดแห่งหนึ่งของไทยผ่านยุคสมัย',
    'about.artifacts.title': 'ขุมทรัพย์โบราณ',
    'about.artifacts.subtitle': 'ค้นพบสิ่งประดิษฐ์ที่น่าทึ่งและความมหัศจรรย์ทางสถาปัตยกรรมที่อยู่รอดมาหลายศตวรรษ แต่ละชิ้นเล่าเรื่องราวเฉพาะตัวของอารยธรรมไทยโบราณ',
    'about.artifacts.ancient': 'โบราณวัตถุ',
    'about.artifacts.significance': 'ความสำคัญทางวัฒนธรรม',
    'about.cta.title': 'อนุรักษ์มรดกของเรา',
    'about.cta.subtitle': 'ช่วยเราดำเนินการอนุรักษ์และแบ่งปันมรดกอันน่าทึ่งของกำแพงเพชรสำหรับคนรุ่นหลัง',
    'about.cta.explore': 'สำรวจเพิ่มเติม',
    
    // Attractions Page
    'attractions.title': 'การจัดการสถานที่ท่องเที่ยว',
    'attractions.subtitle': 'จัดการสถานที่ท่องเที่ยวทั้งหมดในกำแพงเพชร',
    'attractions.add.new': 'เพิ่มสถานที่ท่องเที่ยวใหม่',
    'attractions.card.view': 'มุมมองการ์ด',
    'attractions.table.view': 'มุมมองตาราง',
    'attractions.view': 'ดู',
    'attractions.edit': 'แก้ไข',
    'attractions.delete': 'ลบ',
    'attractions.confirm.delete': 'คุณแน่ใจหรือไม่?',
    'attractions.delete.desc': 'การกระทำนี้ไม่สามารถยกเลิกได้ และจะลบสถานที่ท่องเที่ยวถาวร',
    'attractions.cancel': 'ยกเลิก',
    'attractions.no.available': 'ยังไม่มีสถานที่ท่องเที่ยว',
    
    // Form Page
    'form.add.title': 'เพิ่มสถานที่ท่องเที่ยวใหม่',
    'form.edit.title': 'แก้ไขสถานที่ท่องเที่ยว',
    'form.add.subtitle': 'กรอกรายละเอียดสำหรับสถานที่ท่องเที่ยวใหม่',
    'form.edit.subtitle': 'อัปเดตข้อมูลสถานที่ท่องเที่ยว',
    'form.back': 'กลับไปยังสถานที่ท่องเที่ยว',
    'form.details.title': 'รายละเอียดสถานที่ท่องเที่ยว',
    'form.details.subtitle': 'โปรดให้ข้อมูลที่ถูกต้องเกี่ยวกับสถานที่ท่องเที่ยว',
    'form.name': 'ชื่อ',
    'form.name.placeholder': 'กรอกชื่อสถานที่ท่องเที่ยว',
    'form.description': 'คำอธิบาย',
    'form.description.placeholder': 'อธิบายสถานที่ท่องเที่ยว (อย่างน้อย 20 ตัวอักษร)',
    'form.entrance.fee': 'ค่าเข้าชม (บาท)',
    'form.open.hours': 'เวลาเปิด-ปิด',
    'form.open.hours.placeholder': 'เช่น 08:00 - 18:00',
    'form.category': 'หมวดหมู่',
    'form.category.placeholder': 'เลือกหมวดหมู่',
    'form.rating': 'คะแนน (1-5)',
    'form.image': 'รูปภาพสถานที่ท่องเที่ยว',
    'form.image.subtitle': 'อัปโหลดรูปภาพที่เป็นตัวแทนของสถานที่ท่องเที่ยว',
    'form.upload': 'อัปโหลดรูปภาพ',
    'form.remove.image': 'ลบรูปภาพ',
    'form.characters': 'ตัวอักษร',
    'form.save': 'บันทึก',
    'form.saving': 'กำลังบันทึก...',
    'form.add.attraction': 'เพิ่มสถานที่ท่องเที่ยว',
    'form.update.attraction': 'อัปเดตสถานที่ท่องเที่ยว',
    'form.required': 'ช่องนี้จำเป็นต้องกรอก',
    'form.description.min': 'คำอธิบายต้องมีอย่างน้อย 20 ตัวอักษร',
    'form.fee.invalid': 'ค่าเข้าชมต้องเป็นตัวเลขบวกที่ถูกต้อง',
    
    // Detail Page
    'detail.not.found': 'ไม่พบสถานที่ท่องเที่ยว',
    'detail.not.found.desc': 'ไม่พบสถานที่ท่องเที่ยวที่ร้องขอ',
    'detail.back': 'กลับไปยังสถานที่ท่องเที่ยว',
    'detail.about': 'เกี่ยวกับสถานที่แห่งนี้',
    'detail.visitor.info': 'ข้อมูลสำหรับนักท่องเที่ยว',
    'detail.opening.hours': 'เวลาเปิด-ปิด',
    'detail.entrance.fee': 'ค่าเข้าชม',
    'detail.notes': 'ข้อควรทราบ',
    'detail.quick.facts': 'ข้อมูลโดยย่อ',
    'detail.visit.planning': 'วางแผนการท่องเที่ยว',
    'detail.best.time': 'เวลาที่ดีที่สุดในการเยี่ยมชม',
    'detail.best.time.desc': 'ตอนเช้าตรู่หรือช่วงบ่ายสำหรับอากาศที่เย็นสบาย',
    'detail.duration': 'ระยะเวลาที่แนะนำ',
    'detail.duration.desc': '2-3 ชั่วโมงสำหรับการเยี่ยมชมอย่างครอบคลุม',
    'detail.contact': 'ติดต่อและที่ตั้ง',
    'detail.address': 'ที่อยู่',
    'detail.phone': 'โทรศัพท์',
    
    // Categories
    'category.historical': 'แหล่งประวัติศาสตร์',
    'category.temple': 'วัด',
    'category.park': 'อุทยานแห่งชาติ',
    'category.museum': 'พิพิธภัณฑ์',
    'category.natural': 'สถานที่ท่องเที่ยวธรรมชาติ',
    'category.cultural': 'แหล่งวัฒนธรรม',
    'category.unspecified': 'ไม่ระบุ',
    
    // Common
    'common.loading': 'กำลังโหลด...',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.view': 'ดู',
    'common.add': 'เพิ่ม',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.all': 'ทั้งหมด',
    'common.none': 'ไม่มี',
    'common.yes': 'ใช่',
    'common.no': 'ไม่',
    
    // Footer
    'footer.copyright': '© 2024 ระบบจัดการการท่องเที่ยวกำแพงเพชร',
    'footer.subtitle': 'เรื่องราว สถานที่ และข้อมูลสำหรับออกเดินทางในกำแพงเพชร',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('language');
      return saved === 'th' ? 'th' : 'en';
    } catch { return 'en'; }
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    try { localStorage.setItem('language', lang); } catch { /* Language remains usable without storage. */ }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
