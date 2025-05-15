// src/components/MeetTheTeamSection.js

export function MeetTheTeamSection() {
  const section = document.createElement("section");
  section.className = "bg-gray-50 py-16 px-4 sm:px-6 lg:px-8";

  section.innerHTML = `
    <div class="max-w-7xl mx-auto text-center">
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
        Meet the Team
      </h2>
      <p class="text-lg text-gray-600 mb-12">
        The minds and hearts behind Elimu_Online — united by a passion for education.
      </p>

      <div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        ${getTeamCard({
          image: "/images/team1.jpg",
          name: "Kevin Otieno",
          role: "Tech Lead",
          quote:
            "I love building digital tools that improve education outcomes.",
        })}
        ${getTeamCard({
          image: "/images/team2.jpg",
          name: "Linda Auma",
          role: "Head of Learning Design",
          quote:
            "Creating learner-centered resources is at the heart of what we do.",
        })}
        ${getTeamCard({
          image: "/images/team3.avif", // ✅ Corrected to .avif
          name: "James Mutinda",
          role: "Operations Manager",
          quote:
            "I ensure our mission translates into real impact for schools.",
        })}
      </div>
    </div>
  `;

  return section;
}

// ✅ Reusable team card layout
function getTeamCard({ image, name, role, quote }) {
  return `
    <div class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition duration-300 text-center flex flex-col items-center">
      <img src="${image}" alt="${name}" class="w-24 h-24 rounded-full object-cover mb-4 border-2 border-purple-200 shadow" />
      <h3 class="text-lg font-semibold text-gray-900">${name}</h3>
      <p class="text-sm text-purple-600 mb-3">${role}</p>
      <p class="text-gray-700 text-sm leading-snug">"${quote}"</p>
    </div>
  `;
}
