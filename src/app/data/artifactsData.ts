export interface Artifact {
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  significance: string;
  significanceTh: string;
  icon: string;
  image: string;
}

export const artifactsData: Artifact[] = [
  {
    name: "Buddha Statues",
    nameTh: "พระพุทธรูป",
    description: "Magnificent Buddha statues in various mudras, showcasing the artistic excellence of Sukhothai period sculpture.",
    descriptionTh: "พระพุทธรูปอันงดงามในปางต่างๆ แสดงให้เห็นความเป็นเลิศทางศิลปกรรมแกะสลักสมัยสุโขทัย",
    significance: "Represent the pinnacle of Thai Buddhist art",
    significanceTh: "เป็นตัวแทนของจุดสูงสุดของศิลปะพุทธศาสนาไทย",
    icon: "🧘‍♂️",
    image: "https://images.unsplash.com/photo-1528815883066-9083bb080d3b?w=400&h=300&fit=crop"
  },
  {
    name: "Ancient Chedis",
    nameTh: "เจดีย์โบราณ",
    description: "Sacred stupas containing relics and serving as focal points for Buddhist worship and meditation.",
    descriptionTh: "พระเจดีย์ศักดิ์สิทธิ์ที่บรรจุพระธาตุและเป็นจุดศูนย์กลางสำหรับการสักการะและทำสมาธิ",
    significance: "Architectural marvels representing spiritual aspirations",
    significanceTh: "ความมหัศจรรย์ทางสถาปัตยกรรมที่แสดงแรงบันดาลใจทางจิตวิญญาณ",
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop"
  },
  {
    name: "Stone Inscriptions",
    nameTh: "จารึกหิน",
    description: "Ancient inscriptions recording royal decrees, religious teachings, and historical events of the Sukhothai period.",
    descriptionTh: "จารึกโบราณที่บันทึกพระราชกฤษฎีกา คำสอนทางศาสนา และเหตุการณ์ประวัติศาสตร์ในสมัยสุโขทัย",
    significance: "Primary sources of Sukhothai history and culture",
    significanceTh: "แหล่งข้อมูลหลักของประวัติศาสตร์และวัฒนธรรมสุโขทัย",
    icon: "📜",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  {
    name: "Guardian Lions",
    nameTh: "สิงห์คู่",
    description: "Majestic stone lions guarding temple entrances, symbolizing protection and divine power.",
    descriptionTh: "สิงห์หินอันยิ่งใหญ่ที่เฝ้าประตูวัด เป็นสัญลักษณ์ของการปกป้องและอำนาจศักดิ์สิทธิ์",
    significance: "Guardians of sacred spaces and spiritual realms",
    significanceTh: "ผู้พิทักษ์พื้นที่ศักดิ์สิทธิ์และอาณาจักรจิตวิญญาณ",
    icon: "🦁",
    image: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=300&fit=crop"
  }
];