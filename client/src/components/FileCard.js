export function FileCard(title, description, onClickView) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded shadow-md p-4 border hover:shadow-lg transition";

  card.innerHTML = `
    <h3 class="text-lg font-semibold text-[#5624d0] mb-2">${title}</h3>
    <p class="text-sm text-gray-600 mb-3">${description}</p>
    <button class="bg-[#5624d0] text-white px-4 py-2 rounded hover:bg-purple-800">View</button>
  `;

  card.querySelector("button").addEventListener("click", onClickView);

  return card;
}
