// client/src/components/FeaturedResourcesSection.js
// ------------------------------------------------------------------
// Vanilla JS component (NO JSX) for Vite projects without React plugin.
// - Fetches resources via services/api.js
// - Renders FileCard tiles and opens FilePreviewModal
// - Search + simple filters
// - Detailed debug logs
// ------------------------------------------------------------------

import { fetchResources } from "../services/api.js";
import { FileCard } from "./FileCard.js";
import { FilePreviewModal } from "./FilePreviewModal.js";

export function FeaturedResourcesSection() {
  // ----- logging ---------------------------------------------------
  try {
    console.groupCollapsed("📚 FeaturedResourcesSection:init");
    console.log("API base:", window.__API_BASE_URL__);
    console.groupEnd();
  } catch {}

  // ----- root + layout --------------------------------------------
  const section = document.createElement("section");
  section.className = "bg-gray-100 py-16 px-4 sm:px-6 lg:px-8";

  const container = document.createElement("div");
  container.className = "max-w-7xl mx-auto";
  section.appendChild(container);

  // Header
  const header = document.createElement("div");
  header.className = "mb-10 text-center";
  header.innerHTML = `
    <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
      <span class="inline-block align-middle mr-2">📚</span>Recently Added Resources
    </h2>
    <p class="text-lg text-gray-600">Find high school notes, exams, schemes & more</p>
  `;
  container.appendChild(header);

  // Filters
  const filters = document.createElement("div");
  filters.className = "flex flex-col sm:flex-row justify-center gap-4 mb-8";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search by title, subject or keyword...";
  searchInput.className =
    "w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500";

  const categorySel = document.createElement("select");
  categorySel.className =
    "px-4 py-2 border border-gray-300 rounded w-full sm:w-1/4";
  categorySel.innerHTML = `
    <option value="">All Categories</option>
    <option value="Notes">Notes</option>
    <option value="Exams">Exams</option>
    <option value="E-Books">E-Books</option>
    <option value="Schemes">Schemes of Work</option>
    <option value="Lesson Plans">Lesson Plans</option>
  `;

  const formSel = document.createElement("select");
  formSel.className =
    "px-4 py-2 border border-gray-300 rounded w-full sm:w-1/4";
  formSel.innerHTML = `
    <option value="">All Forms</option>
    <option value="Form 1">Form 1</option>
    <option value="Form 2">Form 2</option>
    <option value="Form 3">Form 3</option>
    <option value="Form 4">Form 4</option>
  `;

  filters.appendChild(searchInput);
  filters.appendChild(categorySel);
  filters.appendChild(formSel);
  container.appendChild(filters);

  // Grid
  const grid = document.createElement("div");
  grid.id = "resource-grid";
  grid.className = "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  container.appendChild(grid);

  // State
  let allResources = [];
  let renderedOnce = false;

  // Render helpers --------------------------------------------------
  function openPreview(resource) {
    const modal = FilePreviewModal({
      title: resource.title,
      previewUrl: resource.previewUrl || resource.downloadUrl,
      downloadUrl: resource.downloadUrl,
      isFree: !!resource.isFree,
      price: resource.price || 0,
      fileId: resource.id,
      onClose: () => {},
    });
    document.body.appendChild(modal);
  }

  function renderList(list) {
    grid.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "col-span-full text-center text-gray-500 py-10";
      empty.textContent = "No resources found.";
      grid.appendChild(empty);
      return;
    }

    list.forEach((r) => {
      const card = FileCard({
        title: r.title,
        fileSize: "—",
        pageCount: "",
        previewImageUrl: r.previewUrl || "/logo.png",
        isFree: !!r.isFree,
        price: r.price || 0,
        onClickView: () => openPreview(r),
      });
      grid.appendChild(card);
    });

    if (!renderedOnce) {
      try {
        console.groupCollapsed("🧱 FeaturedResourcesSection:rendered");
        console.table(
          list.map((x) => ({
            id: x.id,
            title: x.title,
            isFree: x.isFree,
            price: x.price,
            previewUrl: x.previewUrl,
            downloadUrl: x.downloadUrl,
          }))
        );
        console.groupEnd();
      } catch {}
      renderedOnce = true;
    }
  }

  function applyFilters() {
    const q = (searchInput.value || "").toLowerCase();
    const cat = categorySel.value || "";
    const frm = formSel.value || "";

    const filtered = allResources.filter((r) => {
      const matchesQ =
        !q ||
        (r.title || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q);
      const matchesCat =
        !cat || String(r.category || "").toLowerCase() === cat.toLowerCase();
      const matchesForm =
        !frm || String(r.level || "").toLowerCase() === frm.toLowerCase();
      return matchesQ && matchesCat && matchesForm;
    });

    renderList(filtered);
  }

  // Wire up filters
  searchInput.addEventListener("input", applyFilters);
  categorySel.addEventListener("change", applyFilters);
  formSel.addEventListener("change", applyFilters);

  // Load data -------------------------------------------------------
  (async () => {
    try {
      console.groupCollapsed("📥 FeaturedResourcesSection:fetchResources()");
      allResources = await fetchResources();
      console.log("raw count:", allResources.length);
      console.groupEnd();
      renderList(allResources);
    } catch (err) {
      console.error("❌ Failed to fetch resources:", err);
      const errBox = document.createElement("div");
      errBox.className =
        "col-span-full bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded";
      errBox.textContent = "Failed to load resources. Please try again.";
      grid.appendChild(errBox);
    }
  })();

  return section;
}
