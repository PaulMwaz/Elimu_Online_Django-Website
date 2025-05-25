import { Modal } from "./Modal.js";
import { downloadFile, checkIfPaid, initiateMpesa } from "../services/api.js";

export function FilePreviewModal({
  title,
  previewUrl,
  downloadUrl,
  isFree,
  price,
  fileId,
  onClose,
}) {
  console.log("🪟 Opening FilePreviewModal:", {
    title,
    previewUrl,
    isFree,
    price,
  });

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50";

  const modal = document.createElement("div");
  modal.className =
    "bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col";

  // 🧾 Modal header
  const header = document.createElement("div");
  header.className = "flex justify-between items-center p-4 border-b";

  const heading = document.createElement("h3");
  heading.className = "text-lg font-bold text-[#5624d0]";
  heading.textContent = title;

  const closeBtn = document.createElement("button");
  closeBtn.className =
    "text-gray-500 hover:text-red-600 text-sm font-bold px-3 py-1 rounded";
  closeBtn.textContent = "Close";
  closeBtn.onclick = () => {
    console.log("❌ Preview modal closed");
    overlay.remove();
    if (onClose) onClose();
  };

  header.appendChild(heading);
  header.appendChild(closeBtn);

  // 📄 Preview content
  const previewBox = document.createElement("div");
  previewBox.className =
    "flex-1 overflow-y-auto bg-gray-100 flex justify-center items-center";

  const previewImage = document.createElement("img");
  previewImage.src = previewUrl;
  previewImage.alt = "Document preview";
  previewImage.className = "w-full max-h-[75vh] object-contain";

  previewBox.appendChild(previewImage);

  // ⬇️ Footer with download
  const footer = document.createElement("div");
  footer.className = "p-4 border-t flex justify-end";

  const downloadBtn = document.createElement("button");
  downloadBtn.className =
    "bg-[#5624d0] text-white text-sm px-4 py-2 rounded hover:bg-purple-800 transition";
  downloadBtn.textContent = isFree
    ? "Download"
    : `Unlock & Download (Ksh ${price})`;

  downloadBtn.onclick = async () => {
    console.log("⬇️ Download clicked:", { title, fileId });

    if (isFree) {
      console.log("✅ Free file — downloading now");
      downloadFile(downloadUrl);
    } else {
      console.log("💰 Paid file — checking payment status...");

      const hasPaid = await checkIfPaid(fileId);
      if (hasPaid) {
        console.log("✅ Payment verified — downloading");
        downloadFile(downloadUrl);
      } else {
        console.log("🔒 Payment required — opening M-Pesa prompt...");
        const phone = prompt("📱 Enter your M-Pesa number to continue:");
        if (phone) {
          const result = await initiateMpesa(phone, price);
          alert("📩 Payment initiated — confirm on your phone");
        }
      }
    }
  };

  footer.appendChild(downloadBtn);

  modal.appendChild(header);
  modal.appendChild(previewBox);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  return overlay;
}
