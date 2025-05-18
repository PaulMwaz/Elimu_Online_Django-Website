export function Dashboard() {
  console.log("📥 Loading Dashboard UI...");

  const section = document.createElement("section");
  section.className = "flex flex-col md:flex-row min-h-screen";

  section.innerHTML = `
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-white shadow-md border-r px-4 py-6">
      <h2 class="text-lg font-bold text-[#5624d0] mb-4">High School Resources</h2>
      <nav class="flex flex-col gap-3">
        <button class="btn-resource" data-type="notes">Notes</button>
        <button class="btn-resource" data-type="ebooks">E-Books</button>
        <button class="btn-resource" data-type="exams">Exams</button>
        <button class="btn-resource" data-type="schemes">Schemes of Work</button>
        <button class="btn-resource" data-type="lessons">Lesson Plans</button>
      </nav>
    </aside>

    <!-- Main content -->
    <main id="dashboard-content" class="flex-1 p-6 overflow-y-auto">
      <h3 class="text-xl font-semibold mb-4 text-gray-700">📚 Select a resource category from the sidebar</h3>
    </main>
  `;

  // ✅ Add event listeners to buttons
  section.querySelectorAll(".btn-resource").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      console.log(`🧭 User clicked: ${type}`);
      loadResources(type);
    });
  });

  return section;
}

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

  console.log(`📦 Loading resources for: ${title}`);

  let html = `<h3 class="text-2xl font-bold text-[#5624d0] mb-6">${title}</h3>`;

  groups.forEach((group) => {
    html += `
      <div class="mb-8">
        <h4 class="text-lg font-semibold text-gray-700 mb-2">${group} ${title}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div class="border p-4 rounded shadow bg-white">
            <h5 class="font-medium text-gray-800">File Title.pdf</h5>
            <p class="text-sm text-gray-500">1.2 MB • 12 pages</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">View</button>
              <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Download</button>
              <button class="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">Unlock @ Ksh 30</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  content.innerHTML = html;
}
