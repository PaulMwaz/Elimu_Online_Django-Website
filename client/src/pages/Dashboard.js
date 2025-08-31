// client/src/pages/Dashboard.js
import { fetchResources } from "../services/api.js";
import { openPreviewModal, openPaymentModal } from "../components/Modal.js";

/**
 * Dashboard root – returns a DOM node for the router to mount.
 */
export function Dashboard() {
  console.groupCollapsed("🟪 Dashboard: render()");
  console.log("Building DOM…");

  const section = document.createElement("section");
  section.className = "flex min-h-screen";

  section.innerHTML = `
    <aside class="fixed top-0 left-0 w-64 h-full bg-[#1f2937] text-white shadow-md z-40 hidden md:flex flex-col pt-[64px]">
      <h2 class="text-lg font-bold text-center mb-6">High School Resources</h2>
      <nav class="flex flex-col px-4 gap-3 text-sm font-medium">
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="notes">📚 Notes</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="ebooks">📖 E-Books</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="exams">📝 Exams</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="schemes">📘 Schemes of Work</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="lessons">🗂️ Lesson Plans</button>
      </nav>
    </aside>

    <main id="dashboard-content" class="flex-1 ml-0 md:ml-64 pt-2 px-2 md:px-4 bg-gray-50 min-h-screen">
      <h3 class="text-xl font-semibold mt-0 mb-4">Select a category</h3>
    </main>
  `;

  // Wire up nav buttons (use the section root so handlers remain valid pre-mount)
  section.querySelectorAll(".btn-resource").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const type = btn.getAttribute("data-type");
      console.log("📁 Click:", type);
      await loadResources(type, section);
    });
  });

  console.groupEnd();
  return section;
}

/**
 * Load & render resources for a given sidebar category.
 * Uses normalized fields from services/api.js (isFree, previewUrl, downloadUrl, etc).
 */
async function loadResources(type, rootEl) {
  const content = rootEl.querySelector("#dashboard-content");
  if (!content) {
    console.error("❌ #dashboard-content not found.");
    return;
  }

  console.groupCollapsed("📦 loadResources()", { type });

  // UI labels (left nav)
  const titleMap = {
    notes: "Notes",
    ebooks: "E-Books",
    exams: "Exams",
    schemes: "Schemes of Work",
    lessons: "Lesson Plans",
  };
  const heading = titleMap[type] ?? "Resources";

  // Decide the grouping field we’ll show in subheadings
  const groupBy = type === "notes" || type === "ebooks" ? "level" : "term";
  console.log("Grouping by:", groupBy);

  // Fetch normalized data
  const list = await fetchResources().catch((err) => {
    console.error("❌ fetchResources failed:", err);
    return [];
  });

  // Keep a copy in DevTools for quick inspection
  window.__resources_raw = list;
  console.log("Fetched (normalized):", list);

  // Case-insensitive filter against category label
  const filtered = list.filter((r) => {
    const cat = String(r.category || "")
      .toLowerCase()
      .trim();
    const want = String(heading || "")
      .toLowerCase()
      .trim();
    return cat === want;
  });

  console.log(`After filter (${heading}):`, filtered.length);
  if (!filtered.length) {
    content.innerHTML = `
      <h2 class="text-2xl font-bold text-[#5624d0] mb-3">${heading}</h2>
      <p class="text-gray-500">No resources found yet.</p>`;
    console.groupEnd();
    return;
  }

  // Group by level/term (use display values the serializer/normalizer provides)
  const groups = {};
  for (const r of filtered) {
    const key = r[groupBy] || "Uncategorized";
    groups[key] = groups[key] || [];
    groups[key].push(r);
  }
  console.log("Groups:", groups);

  // Render
  let html = `<h2 class="text-2xl font-bold text-[#5624d0] mb-4">${heading}</h2>`;
  for (const [groupName, items] of Object.entries(groups)) {
    html += `
      <div class="mb-6">
        <h4 class="text-xl font-semibold text-gray-700 mb-2">${groupName} ${heading}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${items
            .map((r) => {
              const priceLabel = r.isFree ? "Free" : `Ksh ${r.price ?? ""}`;
              const actionBtn = r.isFree
                ? `<button class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm btn-view"
                     data-title="${encodeURIComponent(r.title)}"
                     data-preview="${encodeURIComponent(
                       r.previewUrl || r.downloadUrl || ""
                     )}">Preview</button>`
                : `<button class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm btn-pay"
                     data-id="${r.id}" data-title="${encodeURIComponent(
                    r.title
                  )}"
                     data-price="${
                       r.price ?? 0
                     }">Unlock (${priceLabel})</button>`;
              return `
                <div class="border p-4 rounded shadow-sm bg-white">
                  <h5 class="font-medium truncate" title="${r.title}">${
                r.title
              }</h5>
                  <p class="text-xs text-gray-500 mt-1">${r.level ?? ""} ${
                r.term ? "• " + r.term : ""
              }</p>
                  <div class="mt-3 flex gap-2 items-center">
                    <span class="text-xs font-semibold ${
                      r.isFree ? "text-green-600" : "text-yellow-700"
                    }">${priceLabel}</span>
                    ${actionBtn}
                  </div>
                </div>`;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  content.innerHTML = html;

  // Hook up preview buttons (FREE)
  content.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = decodeURIComponent(btn.getAttribute("data-title") || "");
      const preview = decodeURIComponent(
        btn.getAttribute("data-preview") || ""
      );
      console.log("👁️ Preview:", { title, preview });
      if (!preview) return alert("Preview not available.");
      // Your Modal.js exposes openPreviewModal(url, title)
      openPreviewModal(preview, title);
    });
  });

  // Hook up pay/unlock buttons (PAID)
  content.querySelectorAll(".btn-pay").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const title = decodeURIComponent(btn.getAttribute("data-title") || "");
      const price = Number(btn.getAttribute("data-price") || 0);
      console.log("💳 Pay:", { id, title, price });
      // Your Modal.js should open a dialog and eventually unlock the file
      openPaymentModal(title, id, price);
    });
  });

  console.groupEnd();
}
