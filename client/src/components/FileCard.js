export function FileCard({
  title,
  description,
  fileUrl,
  isFree = true,
  price = 0,
  onClickView,
}) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition duration-300";

  // ✅ Badge for Free or Paid file
  const badge = isFree
    ? `<span class="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">Free</span>`
    : `<span class="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded-full">Ksh ${price}</span>`;

  // ✅ Only show "Download" link if fileUrl exists
  const downloadLink = fileUrl
    ? `<a href="${fileUrl}" target="_blank" class="text-blue-600 underline hover:text-blue-800">Download</a>`
    : `<span class="text-gray-400 text-sm italic">🔒 Locked</span>`;

  card.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold text-[#5624d0]">${title}</h3>
      ${badge}
    </div>
    <p class="text-sm text-gray-600 mb-4">${description}</p>
    <div class="flex gap-3 items-center">
      <button class="bg-[#5624d0] text-white px-4 py-2 rounded hover:bg-purple-800 focus:outline-none">
        View
      </button>
      ${downloadLink}
    </div>
  `;

  // ✅ Attach preview action for signed URL or modal
  card.querySelector("button").addEventListener("click", onClickView);

  return card;
}
