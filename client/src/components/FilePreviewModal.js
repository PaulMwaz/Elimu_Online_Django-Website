// client/src/components/FilePreviewModal.js
import { downloadFile } from "../services/api.js";

/**
 * Smart preview modal that renders:
 * - PDF with <object>
 * - Images with <img>
 * - Audio/Video with native tags
 * - Office files (doc/docx/xls/xlsx/ppt/pptx) via Office/Google viewer
 * - Graceful fallback with a helpful message
 *
 * Requirements for Office/Google viewer:
 *  - The URL must be publicly reachable (a short-lived signed URL from GCS works)
 *  - For GCS it's best if the link is "inline" (no forced attachment)
 */
export function FilePreviewModal({
  title,
  // Prefer a direct file URL that the browser can GET (signed or public)
  downloadUrl,
  // Optional separate preview image/PDF if you already generate one
  previewUrl = null,
  // Optional hints from backend
  contentType = "",
  fileName = "",
  isFree = true,
  price = 0,
  fileId = null,
  onClose,
}) {
  console.log("🪟 Opening FilePreviewModal:", {
    title,
    previewUrl,
    downloadUrl,
    contentType,
    fileName,
    isFree,
    price,
    fileId,
  });

  // ---------- Helpers ----------
  const lowerCT = String(contentType || "").toLowerCase();
  const lowerName = String(fileName || "").toLowerCase();
  const urlForExtGuess = downloadUrl || previewUrl || "";
  const ext =
    lowerName.split(".").pop() ||
    (urlForExtGuess.includes(".")
      ? urlForExtGuess
          .split("?")[0]
          .split("#")[0]
          .split(".")
          .pop()
          .toLowerCase()
      : "");

  const isPdf = lowerCT.includes("pdf") || ext === "pdf";
  const isImage =
    lowerCT.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
  const isAudio =
    lowerCT.startsWith("audio/") || ["mp3", "wav", "ogg"].includes(ext);
  const isVideo =
    lowerCT.startsWith("video/") || ["mp4", "webm", "ogg"].includes(ext);
  const isOffice =
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext) ||
    lowerCT.includes("officedocument") ||
    lowerCT.includes("msword") ||
    lowerCT.includes("mspowerpoint") ||
    lowerCT.includes("msexcel");

  // For preview we prefer a renderable URL
  const rawUrl = previewUrl || downloadUrl || "";
  const officeViewerSrc = (which = "office") => {
    const fileSrc = encodeURIComponent(downloadUrl || previewUrl || "");
    if (which === "google") {
      return `https://docs.google.com/gview?embedded=1&url=${fileSrc}`;
    }
    return `https://view.officeapps.live.com/op/embed.aspx?src=${fileSrc}`;
  };

  // ---------- DOM ----------
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50";

  const modal = document.createElement("div");
  modal.className =
    "bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[92vh] flex flex-col";

  // Header
  const header = document.createElement("div");
  header.className = "flex justify-between items-center p-3 border-b";
  header.innerHTML = `
    <h3 class="text-base sm:text-lg font-bold text-[#5624d0] truncate pr-3">${title}</h3>
    <div class="flex items-center gap-2">
      <button id="btn-download" class="bg-[#5624d0] text-white text-xs sm:text-sm px-3 py-1.5 rounded hover:bg-purple-800">
        ${isFree ? "Download" : `Download (Ksh ${price})`}
      </button>
      <button id="btn-close" class="text-gray-500 hover:text-red-600 text-sm font-bold px-3 py-1 rounded">Close</button>
    </div>
  `;

  const content = document.createElement("div");
  content.className = "flex-1 bg-gray-50 overflow-auto";

  // ---------- Decide how to render ----------
  console.log("🧭 Preview decision:", {
    isPdf,
    isImage,
    isAudio,
    isVideo,
    isOffice,
    ext,
    lowerCT,
    rawUrl,
  });

  if (isPdf && rawUrl) {
    // PDF
    const obj = document.createElement("object");
    obj.setAttribute("data", rawUrl);
    obj.setAttribute("type", "application/pdf");
    obj.className = "w-full h-[84vh] bg-white";
    obj.innerHTML = `
      <div class="p-6 text-center text-gray-600">
        <p>PDF preview is not available. <a class="text-[#5624d0] underline" href="${rawUrl}" target="_blank" rel="noopener">Open in a new tab</a>.</p>
      </div>`;
    content.appendChild(obj);
  } else if (isImage && rawUrl) {
    // Image
    const img = document.createElement("img");
    img.src = rawUrl;
    img.alt = title;
    img.className = "max-h-[84vh] w-auto mx-auto my-4 object-contain";
    content.appendChild(img);
  } else if (isAudio && rawUrl) {
    // Audio
    const audio = document.createElement("audio");
    audio.src = rawUrl;
    audio.controls = true;
    audio.className = "w-full p-6";
    content.appendChild(audio);
  } else if (isVideo && rawUrl) {
    // Video
    const video = document.createElement("video");
    video.src = rawUrl;
    video.controls = true;
    video.className = "w-full max-h-[84vh] bg-black";
    content.appendChild(video);
  } else if (isOffice && rawUrl) {
    // Office viewer (requires a public or signed URL fetchable by Microsoft/Google)
    // Try Office first; Google as fallback button.
    const iframe = document.createElement("iframe");
    iframe.src = officeViewerSrc("office");
    iframe.title = "Office Viewer";
    iframe.className = "w-full h-[84vh] bg-white";
    iframe.setAttribute("allowfullscreen", "");
    content.appendChild(iframe);

    const note = document.createElement("div");
    note.className = "px-4 py-2 text-xs text-gray-500";
    note.innerHTML =
      "If the preview stays blank, the viewer cannot access the file. Ensure the URL is public or a short-lived signed link.";
    content.appendChild(note);

    console.log("🧩 Office viewer URL:", iframe.src);
  } else if (rawUrl) {
    // Unknown type → try Google viewer as a generic fallback (often works with text/rtf)
    const iframe = document.createElement("iframe");
    iframe.src = officeViewerSrc("google");
    iframe.title = "Document Viewer";
    iframe.className = "w-full h-[84vh] bg-white";
    iframe.setAttribute("allowfullscreen", "");
    content.appendChild(iframe);

    const note = document.createElement("div");
    note.className = "px-4 py-2 text-xs text-gray-500";
    note.innerHTML =
      "Using Google viewer fallback. If you still see a blank page, the link isn’t publicly reachable.";
    content.appendChild(note);

    console.log("🧩 Google viewer URL:", iframe.src);
  } else {
    // No usable URL
    content.innerHTML = `
      <div class="p-6 text-center text-gray-600">
        <p>Preview not available for this file type.</p>
        <p class="mt-2"><button id="btn-fallback-download" class="bg-[#5624d0] text-white text-sm px-3 py-1.5 rounded hover:bg-purple-800">Download</button></p>
      </div>`;
    content
      .querySelector("#btn-fallback-download")
      ?.addEventListener("click", () => {
        if (downloadUrl) downloadFile(downloadUrl);
      });
  }

  // Footer (optional) — kept minimal
  const footer = document.createElement("div");
  footer.className = "p-2 border-t text-right text-xs text-gray-400";
  footer.textContent = "Elimu_Online";

  // Events
  header.querySelector("#btn-close").onclick = () => {
    console.log("❌ Preview modal closed");
    overlay.remove();
    if (onClose) onClose();
  };

  header.querySelector("#btn-download").onclick = () => {
    console.log("⬇️ Download clicked:", { title, fileId, downloadUrl });
    downloadFile(downloadUrl || previewUrl || "");
  };

  // Assemble
  modal.appendChild(header);
  modal.appendChild(content);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  return overlay;
}
