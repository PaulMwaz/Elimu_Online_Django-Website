// src/pages/Home.js
// -------------------------------------------------------------
// Home page: Hero → WhyChoose → HowItWorks → LevelsGrid
// (FeaturedResourcesSection removed)
// -------------------------------------------------------------

import { HeroSlider } from "../components/HeroSlider.js";
import { WhyChooseSection } from "../components/WhyChooseSection.js";
import { HowItWorksSection } from "../components/HowItWorksSection.js";
import { LevelsGrid } from "../components/LevelsGrid.js";

export function Home() {
  console.log("🏠 [Home] render start");

  const section = document.createElement("section");
  section.className = "bg-gray-50 pt-[80px]";

  // Hero
  try {
    console.log("🎬 [Home] mount HeroSlider");
    const slider = HeroSlider();
    section.appendChild(slider);
  } catch (e) {
    console.error("❌ [Home] HeroSlider failed:", e);
  }

  // Why Choose Us
  try {
    console.log("💡 [Home] mount WhyChooseSection");
    const whyChoose = WhyChooseSection();
    section.appendChild(whyChoose);
  } catch (e) {
    console.error("❌ [Home] WhyChooseSection failed:", e);
  }

  // How It Works
  try {
    console.log("⚙️  [Home] mount HowItWorksSection");
    const howItWorks = HowItWorksSection();
    section.appendChild(howItWorks);
  } catch (e) {
    console.error("❌ [Home] HowItWorksSection failed:", e);
  }

  // 🔥 Levels hub (Lower/Upper Primary, Junior High, High School)
  try {
    console.log("🧭 [Home] mount LevelsGrid");
    const levels = LevelsGrid();
    section.appendChild(levels);
  } catch (e) {
    console.error("❌ [Home] LevelsGrid failed:", e);
  }

  console.log("✅ [Home] render complete");
  return section;
}
