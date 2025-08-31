// src/pages/LevelResourcesPage.js
// ---------------------------------------------------------------------------------
// Full-page listing for a selected level. Fetches all resources and filters by level.
// Groups by category: Notes, E-Books, Exams, Schemes of Work, Lesson Plans.
// Uses FileCard + FilePreviewModal for a consistent experience.
// ---------------------------------------------------------------------------------

import { fetchResources } from "../services/api.js";
import { FileCard } from "../components/FileCard.js";
import { FilePreviewModal } from "../components/FilePreviewModal.js";

const SLUG_TO_LEVEL = {
  "lower-primary": "Lower Primary",
  "upper-primary": "Upper Primary",
  "junior-high": "Junior High School",
  "high-school": "High School",
};

const CATEGORY_ORDER = [
  "Notes",
  "E-Books",
  "Exams",
  "Schemes of Work",
  "Lesson Plans",
];

export function LevelResourcesPage(params = {}) {
  const levelSlug = params.levelSlug || "";
  const displayLevel = SLUG_TO_LEVEL[levelSlug] || "Unknown Level";

  console.log("📄 LevelResourcesPage init:", { levelSlug, displayLevel });

  const page = document.createElement("section");
  page.className = "min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8";
  page.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <button id="back-btn" class="text-sm text-gray-600 hover:text-gray-900">← Back</button>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-[#5624d0] mb-1">${displayLevel}</h1>
      <p class="text-gray-600 mb-8">All resources for ${displayLevel}</p>

      <div id="content"></div>
    </div>
  `;

  page.querySelector("#back-btn").addEventListener("click", () => {
    history.back();
  });

  const content = page.querySelector("#content");

  (async () => {
    try {
      console.log("📡 LevelResourcesPage → fetching resources…");
      const items = await fetchResources();
      console.log("✅ fetched resources:", items);

      const filtered = items.filter(
        (r) => (r.level || "").trim() === displayLevel
      );
      console.log(`📦 filtered for ${displayLevel}:`, filtered.length);

      if (!filtered.length) {
        content.innerHTML = `
          <div class="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            No resources found for ${displayLevel}.
          </div>`;
        return;
      }

      // Group by category
      const byCategory = Object.create(null);
      filtered.forEach((r) => {
        const cat = r.category || "Other";
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(r);
      });

      let html = "";
      CATEGORY_ORDER.forEach((cat) => {
        const list = byCategory[cat] || [];
        if (!list.length) return;
        console.log(`📂 render category ${cat} → ${list.length}`);

        html += `
          <section class="mb-10">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">${cat}</h2>
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="cat-${cat.replace(
              /\s+/g,
              "-"
            )}"></div>
          </section>
        `;
      });

      content.innerHTML =
        html ||
        `
        <div class="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          No resources found.
        </div>`;

      // Mount FileCards and wire previews
      CATEGORY_ORDER.forEach((cat) => {
        const list = byCategory[cat] || [];
        const mount = content.querySelector(`#cat-${cat.replace(/\s+/g, "-")}`);
        if (!mount) return;

        list.forEach((res) => {
          const card = FileCard({
            title: res.title,
            fileSize: "-", // unknown for now
            pageCount: "-", // unknown for now
            previewImageUrl: res.previewUrl || "/logo.png", // fallback visual
            isFree: !!res.isFree,
            price: res.price || 0,
            onClickView: () => {
              console.log("👁️ preview:", res.title);
              document.body.appendChild(
                FilePreviewModal({
                  title: res.title,
                  downloadUrl:
                    res.downloadUrl ||
                    res.previewUrl ||
                    res._raw?.file_url ||
                    "",
                  previewUrl: res.previewUrl || "",
                  contentType: res.contentType || "",
                  fileName: res._raw?.file || res.title,
                  isFree: !!res.isFree,
                  price: res.price || 0,
                  fileId: res.id,
                })
              );
            },
          });
          mount.appendChild(card);
        });
      });
    } catch (err) {
      console.error("❌ LevelResourcesPage error:", err);
      content.innerHTML = `
        <div class="bg-white rounded-xl border border-red-200 p-6 text-red-600">
          Failed to load resources. Please try again later.
        </div>`;
    }
  })();

  return page;
}
