import { HeroSlider } from "../components/HeroSlider.js";
import { WhyChooseSection } from "../components/WhyChooseSection.js";
import { HowItWorksSection } from "../components/HowItWorksSection.js";

export function Home() {
  const section = document.createElement("section");
  section.className = "bg-gray-50 pt-[80px]"; // Padding to avoid overlapping navbar

  const slider = HeroSlider();
  const whyChoose = WhyChooseSection();
  const howItWorks = HowItWorksSection();

  section.appendChild(slider); // ✅ Correct
  section.appendChild(whyChoose); // ✅ Correct
  section.appendChild(howItWorks); // ✅ Correct

  return section;
}
