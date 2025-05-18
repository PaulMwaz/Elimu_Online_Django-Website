// client/src/pages/ResourcesPage.js
import { fetchResources } from "../services/api.js";
import { FileCard } from "../components/FileCard.js";

export async function ResourcesPage() {
  const page = document.createElement("section");
  page.className = "p-6 bg-gray-50 min-h-screen";

  const title = document.createElement("h2");
  title.className = "text-2xl font-bold text-[#5624d0] mb-6";
  title.textContent = "Available Resources";

  const container = document.createElement("div");
  container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  // Fetch resources from backend
  try {
    const resources = await fetchResources();
    resources.forEach((res) => {
      const card = FileCard({
        title: res.title,
        description: `${res.category} - ${res.level}`,
        fileUrl: res.signed_url || res.file_url,
        isFree: res.is_free,
        price: res.price,
        onClickView: () => {
          window.open(res.signed_url || res.file_url, "_blank");
        },
      });
      container.appendChild(card);
    });
  } catch (err) {
    const error = document.createElement("p");
    error.className = "text-red-600 font-medium";
    error.textContent = `Error loading resources: ${err.message}`;
    container.appendChild(error);
  }

  page.appendChild(title);
  page.appendChild(container);
  return page;
}
