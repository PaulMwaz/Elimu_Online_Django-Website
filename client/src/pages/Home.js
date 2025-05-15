import { HeroSlider } from "../components/HeroSlider.js";
import { WhyChooseSection } from "../components/WhyChooseSection.js";
import { HowItWorksSection } from "../components/HowItWorksSection.js";
import { TestimonialsSection } from "../components/TestimonialsSection.js";
import { MeetTheTeamSection } from "../components/MeetTheTeamSection.js"; // ✅ Import added

export function Home() {
  const section = document.createElement("section");
  section.className = "bg-gray-50 pt-[80px]"; // ✅ Padding to avoid overlapping navbar

  // ✅ Create sections
  const slider = HeroSlider();
  const whyChoose = WhyChooseSection();
  const howItWorks = HowItWorksSection();
  const testimonials = TestimonialsSection();
  const meetTheTeam = MeetTheTeamSection(); // ✅ New section

  // ✅ Append in structured order
  section.appendChild(slider);
  section.appendChild(whyChoose);
  section.appendChild(howItWorks);
  section.appendChild(testimonials);
  section.appendChild(meetTheTeam); // ✅ Add to DOM

  return section;
}
