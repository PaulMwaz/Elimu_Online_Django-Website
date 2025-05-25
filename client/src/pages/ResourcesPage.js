// client/src/pages/ResourcesPage.js

import { fetchResources } from "../services/api.js";
import { FileCard } from "../components/FileCard.js";
import { FilePreviewModal } from "../components/FilePreviewModal.js";

export async function ResourcesPage() {
  console.log("📄 Rendering ResourcesPage...");

  const page = document.createElement("section");
  page.className = "p-6 bg-gray-50 min-h-screen";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold text-[#5624d0] mb-6";
  title.textContent = "Available Resources";

  const container = document.createElement("div");
  container.className = "space-y-10";

  try {
    console.log("📡 Fetching resources...");
    const resources = await fetchResources();

    if (!resources.length) {
      const empty = document.createElement("p");
      empty.className = "text-gray-600";
      empty.textContent = "No resources found at the moment.";
      container.appendChild(empty);
      console.warn("⚠️ No resources returned.");
    }

    // ✅ Group resources by level (e.g., Form 2, Term 1)
    const grouped = {};
    resources.forEach((res) => {
      const key = res.level || "Uncategorized";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(res);
    });

    // ✅ Render each group section
    Object.keys(grouped).forEach((groupKey) => {
      console.log(
        `📚 Rendering group: ${groupKey} (${grouped[groupKey].length} files)`
      );

      const section = document.createElement("div");

      const groupTitle = document.createElement("h3");
      groupTitle.className = "text-xl font-semibold text-gray-800 mb-4";
      groupTitle.textContent = groupKey;
      section.appendChild(groupTitle);

      const grid = document.createElement("div");
      grid.className =
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6";

      grouped[groupKey].slice(0, 20).forEach((res, index) => {
        console.log(`📄 Rendering resource ${index + 1} in ${groupKey}:`, res);

        const card = FileCard({
          title: res.title,
          fileSize: res.file_size || "1.2 MB",
          pageCount: res.page_count || 12,
          previewImageUrl: res.preview_url || "/images/logo.png",
          isFree: res.is_free,
          price: res.price,
          onClickView: () => {
            console.log("👁️ View clicked for:", res.title);

            const modal = FilePreviewModal({
              title: res.title,
              previewUrl: res.preview_url,
              downloadUrl: res.signed_url || res.file_url,
              isFree: res.is_free,
              price: res.price,
              fileId: res.id,
              onClose: () => console.log("🔒 Modal closed for:", res.title),
            });

            document.body.appendChild(modal);
          },
        });

        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  } catch (err) {
    console.error("❌ Error fetching resources:", err);
    const error = document.createElement("p");
    error.className = "text-red-600 font-medium";
    error.textContent = `Error loading resources: ${err.message}`;
    container.appendChild(error);
  }

  page.appendChild(title);
  page.appendChild(container);

  console.log("✅ ResourcesPage render complete.");
  return page;
}
