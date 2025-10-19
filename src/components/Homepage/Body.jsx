import ScrollDisplay from "./ScrollDisplay";
import FocusInfo from "./FocusInfo";
import HeroCarousel from "./HeroCarousel";

export default function Body({ status, heroItems, onOpenItem }) {
  if (status === "loading") return <div style={{ padding: 16 }}>Loading…</div>;
  if (status === "error")
    return (
      <div style={{ padding: 16 }}>
        Something went wrong. Please refresh the page.
      </div>
    );
  return (
    <HeroCarousel items={heroItems} autoplayMs={6000} onOpenItem={onOpenItem} />
  );
}
