import { HeroSlider } from "../components/HeroSlider.js";
import { WhyChooseSection } from "../components/WhyChooseSection.js";
import { HowItWorksSection } from "../components/HowItWorksSection.js";
import { FeaturedResourcesSection } from "../components/FeaturedResourcesSection.js"; // ✅ New section

export function Home() {
  const section = document.createElement("section");
  section.className = "bg-gray-50 pt-[80px]"; // ✅ Padding to avoid overlapping navbar

  // ✅ Create homepage sections
  const slider = HeroSlider();
  const whyChoose = WhyChooseSection();
  const howItWorks = HowItWorksSection();
  const featuredResources = FeaturedResourcesSection(); // ✅ Trending / Paid files

  // ✅ Append in order
  section.appendChild(slider);
  section.appendChild(whyChoose);
  section.appendChild(howItWorks);
  section.appendChild(featuredResources); // ✅ Focus on resources

  return section;
}
