// client/src/components/FileCard.js

export function FileCard({
  title,
  fileSize,
  pageCount,
  previewImageUrl,
  isFree = true,
  price = 0,
  onClickView,
}) {
  console.log("📦 Rendering FileCard:", {
    title,
    fileSize,
    pageCount,
    isFree,
    price,
    previewImageUrl,
  });

  // 📦 Create the main tile/card
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 w-full";

  // 🏷️ Pricing badge (top-left)
  const badge = isFree
    ? `<span class="absolute top-2 left-2 text-xs font-bold text-white bg-green-600 px-2 py-1 rounded">Free</span>`
    : `<span class="absolute top-2 left-2 text-xs font-bold text-white bg-yellow-600 px-2 py-1 rounded">Ksh ${price}</span>`;

  // 🎨 HTML structure of the card
  card.innerHTML = `
    <div class="relative w-full h-60 overflow-hidden rounded-t-xl bg-gray-100">
      <img src="${previewImageUrl}" alt="Preview of ${title}" class="w-full h-full object-cover" />
      ${badge}
    </div>
    <div class="p-4 flex flex-col space-y-2">
      <h3 class="text-sm font-semibold text-[#5624d0] truncate">${title}</h3>
      <p class="text-xs text-gray-500">${fileSize} • ${pageCount} pages</p>
      <button class="bg-[#5624d0] text-white text-sm px-3 py-1.5 rounded-md hover:bg-purple-800 transition focus:outline-none self-end w-fit">
        View
      </button>
    </div>
  `;

  // 🎯 Handle "View" click
  const viewBtn = card.querySelector("button");
  viewBtn.addEventListener("click", () => {
    console.log("👁️ View clicked for:", title);
    if (typeof onClickView === "function") {
      onClickView();
    } else {
      console.warn("⚠️ No view handler provided.");
    }
  });

  return card;
}
