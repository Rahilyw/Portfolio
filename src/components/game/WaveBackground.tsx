import WaveCanvas from "@/components/ocean/WaveCanvas";
import SkyLife from "@/components/ocean/SkyLife";

/**
 * The landing page's animated pixel ocean, pinned behind the scrolling game
 * pages: same low-res canvas swell, same drifting clouds and sun/moon arc,
 * same shared day/night cycle. Content floats over it in solid panels, so
 * scrolling reads as drifting across the water.
 */
export default function WaveBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <WaveCanvas />
      <SkyLife />
    </div>
  );
}
