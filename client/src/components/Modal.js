export function Modal(message) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

  modal.innerHTML = `
    <div class="bg-white rounded p-6 shadow-xl w-80 text-center">
      <p class="mb-4 text-gray-800">${message}</p>
      <button class="bg-[#5624d0] text-white px-4 py-2 rounded hover:bg-purple-700" id="modal-close">Close</button>
    </div>
  `;

  modal.querySelector("#modal-close").addEventListener("click", () => {
    modal.remove();
  });

  return modal;
}
