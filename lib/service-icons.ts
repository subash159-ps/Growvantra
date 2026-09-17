import {
  Briefcase,
  Code2,
  type LucideIcon,
  Megaphone,
  MousePointerClick,
  Palette,
  PenTool,
  Search,
  Share2,
} from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  "web-design-development": Code2,
  seo: Search,
  "social-media-marketing": Share2,
  "google-ads": MousePointerClick,
  "meta-ads": Megaphone,
  "content-marketing": PenTool,
  "branding-graphic-design": Palette,
};

// Portfolio categories are free text ("Web Design & Development"), not slugs,
// so normalize before lookup. Already-slugged input passes through unchanged.
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getServiceIcon(slug: string): LucideIcon {
  return serviceIcons[slug] ?? serviceIcons[toSlug(slug)] ?? Briefcase;
}
