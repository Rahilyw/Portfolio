import type { Island } from "@/data/content";
import PixelSprite from "@/components/pixel/PixelSprite";
import { islandRows, islandPalette } from "@/components/pixel/sprites";

/** Pixel-art island illustrations, one variant per section. */
export default function IslandSprite({ variant }: { variant: Island["variant"] }) {
  return (
    <PixelSprite
      rows={islandRows[variant]}
      palette={islandPalette}
      px={5}
      className={variant === "bottle" ? "animate-bottle" : undefined}
    />
  );
}
