export type Style =
  | "cozy"
  | "minimal"
  | "boho"
  | "industrial"
  | "vintage"
  | "japandi";

export type Item = {
  id: string;
  style: Style;
  src: string;
  alt?: string;
};

const STYLE_ORDER: Style[] = [
  "cozy",
  "minimal",
  "boho",
  "industrial",
  "vintage",
  "japandi",
];

// Carga todas las imágenes (ajustá extensión si usás png/webp)
const modules = import.meta.glob("../assets/images/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  as: "url",
});

// Convierte { path: url } en array de items
function buildItems(): Item[] {
  const entries = Object.entries(modules).map(([path, url]) => {
    // path ejemplo: ../assets/images/cozy/cozy-01.jpg
    const parts = path.split("/");
    const style = parts[parts.length - 2] as Style; // carpeta = estilo
    const filename = parts[parts.length - 1]; // cozy-01.jpg

    const id = filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");

    return {
      id,
      style,
      src: String(url),
      alt: id,
    };
  });

  // Orden: por estilo (según STYLE_ORDER) y luego por número (01,02,...)
  entries.sort((a, b) => {
    const styleDiff = STYLE_ORDER.indexOf(a.style) - STYLE_ORDER.indexOf(b.style);
    if (styleDiff !== 0) return styleDiff;

    const getNum = (s: string) => Number((s.match(/(\d+)/)?.[1] ?? "0"));
    return getNum(a.id) - getNum(b.id);
  });

  return entries;
}

export const ITEMS: Item[] = buildItems();