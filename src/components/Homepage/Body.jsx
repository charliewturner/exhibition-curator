import ScrollDisplay from "./ScrollDisplay";
import FocusInfo from "./FocusInfo";
import HeroCarousel from "./HeroCarousel";

// function Body({ status, heroItems }) {
//   return (
//     <>
//       <div id="homepage-body">
//         <ScrollDisplay></ScrollDisplay>

//         <HeroCarousel items={heroItems} autoplayMs={4500} />
//         <FocusInfo></FocusInfo>
//       </div>
//     </>
//   );
// }

// export default Body;

export default function Body({ status, heroItems }) {
  if (status === "loading") return <div style={{ padding: 16 }}>Loading…</div>;
  if (status === "error")
    return <div style={{ padding: 16 }}>Something went wrong.</div>;
  return <HeroCarousel items={heroItems} autoplayMs={4500} />;
}
