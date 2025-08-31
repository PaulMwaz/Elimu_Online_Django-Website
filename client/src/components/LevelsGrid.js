// src/components/LevelsGrid.js
// ------------------------------------------------------------------
// A 4-card hub for Lower/Upper Primary, Junior High School, High School.
// Click navigates to /levels/<slug>.
// ------------------------------------------------------------------

const LEVELS = [
  {
    title: "Lower Primary",
    subtitle: "PP1 – Grade 3",
    slug: "lower-primary",
    emoji: "🧩",
    bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
  },
  {
    title: "Upper Primary",
    subtitle: "Grade 4 – 6",
    slug: "upper-primary",
    emoji: "📗",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
  },
  {
    title: "Junior High School",
    subtitle: "Grade 7 – 9",
    slug: "junior-high",
    emoji: "🧪",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
  },
  {
    title: "High School",
    subtitle: "Form 1 – 4",
    slug: "high-school",
    emoji: "🎓",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
];

function navigateTo(path) {
  console.log("🧭 LevelsGrid → navigate:", path);
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function LevelsGrid() {
  console.log("📦 Rendering LevelsGrid");

  const section = document.createElement("section");
  section.className = "bg-gray-50 py-12 px-4 sm:px-6 lg:px-8";

  section.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Browse by Education Level
        </h2>
        <p class="text-gray-600 mt-2">Pick a level to view all notes, e-books, exams, schemes and lesson plans.</p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" id="levels-grid"></div>
    </div>
  `;

  const grid = section.querySelector("#levels-grid");

  LEVELS.forEach((lvl) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = [
      "group w-full text-left rounded-2xl border border-gray-200 shadow-sm hover:shadow-md",
      "transition transform hover:-translate-y-0.5",
      "p-5",
      lvl.bg,
    ].join(" ");

    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div>
          <div class="text-3xl">${lvl.emoji}</div>
          <h3 class="mt-3 text-xl font-bold text-gray-900">${lvl.title}</h3>
          <p class="text-sm text-gray-600">${lvl.subtitle}</p>
        </div>
        <div class="text-[#5624d0] opacity-0 group-hover:opacity-100 transition">→</div>
      </div>
    `;

    card.addEventListener("click", () => {
      console.log("🖱️ Level card clicked:", lvl.slug);
      navigateTo(`/levels/${lvl.slug}`);
    });

    grid.appendChild(card);
  });

  return section;
}
