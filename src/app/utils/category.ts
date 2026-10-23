const map: Record<string, string> = {
  "Historical Site": "category.historical",
  "Temple": "category.temple",
  "National Park": "category.park",
  "Museum": "category.museum",
  "Natural Attraction": "category.natural",
  "Cultural Site": "category.cultural",
};
export const categoryKey = (c?: string) => (c && map[c]) || "category.unspecified";
