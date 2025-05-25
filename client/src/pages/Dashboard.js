// src/pages/Dashboard.js

export function Dashboard() {
  console.log("🟪 DEBUG: Rendering Dashboard");

  const section = document.createElement("section");
  section.className = "flex min-h-screen pt-[64px]"; // space below fixed navbar

  section.innerHTML = `
    <!-- Sidebar -->
    <aside class="fixed top-0 left-0 w-64 h-full bg-[#1f2937] text-white shadow-md z-40 hidden md:flex flex-col pt-[64px]">
      <h2 class="text-lg font-bold text-center mb-6">High School Resources</h2>
      <nav class="flex flex-col px-4 gap-3 text-sm font-medium">
        <button class="btn-resource text-left hover:bg-[#374151] px-3 py-2 rounded" data-type="notes">📚 Notes</button>
        <button class="btn-resource text-left hover:bg-[#374151] px-3 py-2 rounded" data-type="ebooks">📖 E-Books</button>
        <button class="btn-resource text-left hover:bg-[#374151] px-3 py-2 rounded" data-type="exams">📝 Exams</button>
        <button class="btn-resource text-left hover:bg-[#374151] px-3 py-2 rounded" data-type="schemes">📘 Schemes of Work</button>
        <button class="btn-resource text-left hover:bg-[#374151] px-3 py-2 rounded" data-type="lessons">🗂️ Lesson Plans</button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main id="dashboard-content" class="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
      <h3 class="text-xl font-semibold mb-4">Select a category</h3>
    </main>
  `;

  // ✅ Button handlers for loading content
  section.querySelectorAll(".btn-resource").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      console.log(`📁 DEBUG: Resource type selected →`, type);
      loadResources(type);
    });
  });

  return section;
}

// ✅ Resource renderer by category
function loadResources(type) {
  const content = document.getElementById("dashboard-content");

  const categories = {
    notes: "Notes",
    ebooks: "E-Books",
    exams: "Exams",
    schemes: "Schemes of Work",
    lessons: "Lesson Plans",
  };

  const layout = {
    notes: ["Grade 9", "Form 2", "Form 3", "Form 4"],
    ebooks: ["Grade 9", "Form 2", "Form 3", "Form 4"],
    exams: ["Term 1", "Term 2", "Term 3"],
    schemes: ["Term 1", "Term 2", "Term 3"],
    lessons: ["Term 1", "Term 2", "Term 3"],
  };

  const title = categories[type];
  const groups = layout[type];

  console.log("📄 DEBUG: Rendering group layout →", groups);

  let html = `<h3 class="text-2xl font-bold text-[#5624d0] mb-6">${title}</h3>`;

  groups.forEach((group) => {
    html += `
      <div class="mb-6">
        <h4 class="text-xl font-semibold text-gray-700 mb-2">${group} ${title}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="border p-4 rounded shadow-sm bg-white">
            <h5 class="font-medium">File Title.pdf</h5>
            <p class="text-sm text-gray-500">1.2 MB • 12 pages</p>
            <div class="mt-2 flex gap-2 flex-wrap">
              <button class="px-3 py-1 bg-green-500 text-white rounded text-sm">View</button>
              <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">Download</button>
              <button class="px-3 py-1 bg-yellow-400 text-black rounded text-sm">Unlock @ Ksh 30</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  content.innerHTML = html;
}
