// src/components/Modal.js

export function openPreviewModal(fileUrl, title) {
  console.log("📦 Opening Preview Modal for:", title, fileUrl);

  // Create the modal container
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl w-[95%] max-w-3xl p-6 relative">
      <h3 class="text-lg font-bold mb-4 text-center text-[#5624d0]">${title}</h3>
      <iframe src="${fileUrl}" class="w-full h-[500px] border rounded" frameborder="0"></iframe>
      <button class="absolute top-3 right-4 text-gray-700 hover:text-black text-xl font-bold" id="modal-close">&times;</button>
    </div>
  `;

  // Attach close handler
  const closeBtn = modal.querySelector("#modal-close");
  closeBtn.addEventListener("click", () => {
    console.log("❌ Modal closed.");
    modal.remove();
  });

  // Add to DOM
  document.body.appendChild(modal);
  console.log("✅ Modal mounted.");
}
