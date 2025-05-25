// src/pages/Dashboard.js

import { fetchResources } from "../services/api.js"; // ✅ Corrected name
import { openPreviewModal } from "../components/Modal.js"; // ✅ Make sure this file exists and exports correctly

export function Dashboard() {
  console.log("🟪 DEBUG: Rendering Dashboard");

  const section = document.createElement("section");
  section.className = "flex min-h-screen pt-[64px]";

  section.innerHTML = `
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

    <main id="dashboard-content" class="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
      <h3 class="text-xl font-semibold mb-4">Select a category</h3>
    </main>
  `;

  section.querySelectorAll(".btn-resource").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      console.log(`📁 DEBUG: Resource type selected → ${type}`);
      loadResources(type);
    });
  });

  return section;
}

async function loadResources(type) {
  const content = document.getElementById("dashboard-content");

  const titleMap = {
    notes: "Notes",
    ebooks: "E-Books",
    exams: "Exams",
    schemes: "Schemes of Work",
    lessons: "Lesson Plans",
  };

  const groupBy = type === "notes" || type === "ebooks" ? "level" : "term";

  try {
    const response = await fetchResources(); // ✅ Correct function name
    const resources = response.filter((res) => res.category === titleMap[type]);

    console.log(`📦 DEBUG: Total fetched → ${resources.length}`);
    console.table(resources);

    const groups = {};
    resources.forEach((res) => {
      const key = res[groupBy] || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(res);
    });

    let html = `<h3 class="text-2xl font-bold text-[#5624d0] mb-6">${titleMap[type]}</h3>`;

    for (const [group, items] of Object.entries(groups)) {
      console.log(`📂 DEBUG: Rendering group → ${group} (${items.length})`);
      html += `
        <div class="mb-6">
          <h4 class="text-xl font-semibold text-gray-700 mb-2">${group} ${
        titleMap[type]
      }</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${items
              .map(
                (res) => `
                  <div class="border p-4 rounded shadow-sm bg-white">
                    <h5 class="font-medium">${res.title}</h5>
                    <p class="text-sm text-gray-500">${
                      res.size || "1.2 MB"
                    } • ${res.pages || "12"} pages</p>
                    <div class="mt-2 flex gap-2 flex-wrap">
                      <button class="px-3 py-1 bg-green-500 text-white rounded text-sm btn-view" data-url="${
                        res.file_url
                      }" data-title="${res.title}">
                        View
                      </button>
                    </div>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    content.innerHTML = html;

    // ✅ Attach preview modal logic
    document.querySelectorAll(".btn-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-url");
        const title = btn.getAttribute("data-title");
        console.log(`👁️ DEBUG: Preview clicked → ${title}`);
        openPreviewModal(url, title); // This should open your PDF/image/video
      });
    });
  } catch (err) {
    console.error("❌ Failed to fetch or render resources:", err);
    content.innerHTML = `<p class="text-red-500">Failed to load resources. Please try again later.</p>`;
  }
}
