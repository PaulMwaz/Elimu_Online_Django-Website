export function WhyChooseSection() {
  const section = document.createElement("section");
  section.className = "bg-[#F4FFF6] py-16 px-6"; // Soft Mint background

  section.innerHTML = `
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Why Choose Elimu_Online?</h2>
      <p class="text-[#475569] mb-10 max-w-2xl mx-auto">
        We're not just another resource website — we're a learning companion built for Kenyan students and teachers.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">KCSE-Aligned Content</h3>
          <p class="text-sm text-gray-600">Every resource is crafted with the national curriculum in mind.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">Trusted by Educators</h3>
          <p class="text-sm text-gray-600">Used by teachers and schools to improve academic outcomes.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">📚</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">Always Up to Date</h3>
          <p class="text-sm text-gray-600">Content is refreshed every term with timely topics and exams.</p>
        </div>
      </div>
    </div>
  `;

  return section;
}
