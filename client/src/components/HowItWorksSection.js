// client/src/components/HowItWorksSection.js
export function HowItWorksSection() {
  const section = document.createElement("section");
  section.className = "bg-white py-16 px-6 text-center";

  section.innerHTML = `
    <h2 class="text-3xl md:text-4xl font-bold text-[#1E293B] mb-6">How It Works</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">📝</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">1. Sign Up</h3>
        <p class="text-sm text-gray-600 mt-2">Create your account and join the learning community.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">🔍</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">2. Browse Resources</h3>
        <p class="text-sm text-gray-600 mt-2">Explore notes, exams, lesson plans, and more by category.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">📥</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">3. View or Download</h3>
        <p class="text-sm text-gray-600 mt-2">Instantly access resources or save them offline.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">🚀</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">4. Stay Ahead</h3>
        <p class="text-sm text-gray-600 mt-2">Learn with ease and stay updated with new content every term.</p>
      </div>
    </div>
  `;

  return section;
}
