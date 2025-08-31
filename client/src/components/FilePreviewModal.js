// client/src/components/FilePreviewModal.js
// ------------------------------------------------------------
// Rich preview + download/buy modal (vanilla JS)
// - Detailed debug logs (grouped)
// - Supports image or PDF preview (with Google Docs fallback)
// - Free: direct download
// - Paid: checkIfPaid → download, else initiate M-Pesa
// - Graceful when previewUrl / downloadUrl are missing
// - ESC and backdrop click to close
// ------------------------------------------------------------

import { downloadFile, checkIfPaid, initiateMpesa } from "../services/api.js";

/**
 * Props:
 *  - title        : string
 *  - previewUrl   : string (can be image or pdf). Optional.
 *  - downloadUrl  : string (required for actual download)
 *  - isFree       : boolean (default true)
 *  - price        : number|string
 *  - fileId       : number|string (resource id used by checkIfPaid)
 *  - onClose      : fn()
 */
export function FilePreviewModal({
  title,
  previewUrl,
  downloadUrl,
  isFree = true,
  price = 0,
  fileId,
  onClose,
}) {
  // ---------- logging ------------------------------------------------
  try {
    console.groupCollapsed("🪟 FilePreviewModal:init");
    console.table({
      title,
      previewUrl,
      downloadUrl,
      isFree,
      price,
      fileId,
    });
    console.groupEnd();
  } catch {}

  // ---------- base elements -----------------------------------------
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center z-50";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const modal = document.createElement("div");
  modal.className =
    "bg-white rounded-xl shadow-lg w-[96vw] max-w-4xl max-h-[90vh] flex flex-col";

  // ---------- header -------------------------------------------------
  const header = document.createElement("div");
  header.className = "flex justify-between items-center p-4 border-b";

  const heading = document.createElement("h3");
  heading.className = "text-lg font-bold text-[#5624d0] truncate";
  heading.textContent = title || "Preview";

  const closeBtn = document.createElement("button");
  closeBtn.className =
    "text-gray-500 hover:text-red-600 text-sm font-bold px-3 py-1 rounded";
  closeBtn.textContent = "Close";
  closeBtn.onclick = handleClose;

  header.appendChild(heading);
  header.appendChild(closeBtn);

  // ---------- body (preview) ----------------------------------------
  const body = document.createElement("div");
  body.className =
    "flex-1 overflow-y-auto bg-gray-50 flex items-center justify-center";

  const isPdf =
    typeof (previewUrl || downloadUrl) === "string" &&
    /\.pdf(\?|$)/i.test(previewUrl || downloadUrl);

  if (previewUrl) {
    if (isPdf) {
      // Try native PDF first; if it fails, user can click "Open in new tab"
      const iframe = document.createElement("iframe");
      iframe.className = "w-full h-[75vh]";
      iframe.title = "PDF preview";
      iframe.src = previewUrl;

      // Fallback to Google Docs viewer for public files (still useful in dev)
      iframe.onerror = () => {
        const fallback = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
          previewUrl
        )}`;
        console.warn("📄 PDF iframe error — trying Google viewer fallback");
        iframe.src = fallback;
      };

      body.appendChild(iframe);
    } else {
      const img = document.createElement("img");
      img.className = "w-full max-h-[75vh] object-contain";
      img.alt = "Document preview";
      img.src = previewUrl;

      // tiny SVG placeholder if image fails
      img.onerror = () => {
        console.warn("🖼️ Preview image failed, using placeholder.");
        img.src =
          "data:image/svg+xml;utf8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='100%' height='100%' fill='#eef'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='22' fill='#556'>No preview available</text></svg>`
          );
      };

      body.appendChild(img);
    }
  } else {
    const msg = document.createElement("div");
    msg.className = "p-8 text-center text-gray-500";
    msg.textContent = "No preview available for this file.";
    body.appendChild(msg);
  }

  // ---------- footer -------------------------------------------------
  const footer = document.createElement("div");
  footer.className = "p-4 border-t flex items-center gap-3 justify-end";

  // Open-in-new-tab (always available if we have a previewUrl)
  if (previewUrl) {
    const openBtn = document.createElement("button");
    openBtn.className =
      "px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100";
    openBtn.textContent = "Open in new tab";
    openBtn.onclick = () => {
      console.log("🔗 Open preview in new tab:", previewUrl);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    };
    footer.appendChild(openBtn);
  }

  const primaryBtn = document.createElement("button");
  primaryBtn.className =
    "bg-[#5624d0] text-white text-sm px-4 py-2 rounded hover:bg-purple-800 transition disabled:opacity-60";
  primaryBtn.textContent = isFree
    ? "Download"
    : `Unlock & Download (KSh ${Number(price || 0).toFixed(0)})`;
  primaryBtn.disabled = !downloadUrl;

  primaryBtn.onclick = handlePrimaryClick;
  footer.appendChild(primaryBtn);

  if (!downloadUrl) {
    const hint = document.createElement("span");
    hint.className = "text-xs text-red-500";
    hint.textContent = "No download URL configured.";
    footer.appendChild(hint);
  }

  // ---------- assemble ----------------------------------------------
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);

  // Close on ESC and backdrop
  const escHandler = (e) => e.key === "Escape" && handleClose();
  document.addEventListener("keydown", escHandler);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) handleClose();
  });

  // return the overlay so caller can append to DOM
  return overlay;

  // ---------- handlers ----------------------------------------------
  function setBusy(el, busy) {
    el.disabled = !!busy;
    el.textContent = busy ? "Please wait…" : el._label || el.textContent;
  }

  async function handlePrimaryClick() {
    try {
      console.groupCollapsed("⬇️ FilePreviewModal:primaryClick");
      console.log({ isFree, downloadUrl, fileId });

      if (!downloadUrl) {
        alert("File is not downloadable yet. Please contact support.");
        console.warn("❌ Missing downloadUrl.");
        return;
      }

      if (isFree) {
        console.log("✅ Free file — downloading");
        downloadFile(downloadUrl);
      } else {
        console.log("💰 Paid file — checking payment status…");
        setBusy(primaryBtn, true);
        primaryBtn._label = `Unlock & Download (KSh ${Number(
          price || 0
        ).toFixed(0)})`;

        let paid = false;
        try {
          paid = await checkIfPaid(fileId);
        } catch (err) {
          console.error("❌ checkIfPaid failed:", err);
          alert("Could not verify payment status. Please try again.");
        }

        if (paid) {
          console.log("✅ Payment verified — downloading");
          downloadFile(downloadUrl);
        } else {
          console.log("🔒 Not paid — prompting M-Pesa…");
          const phone = prompt("📱 Enter your M-Pesa number to continue:");
          if (phone) {
            try {
              const result = await initiateMpesa(phone, price);
              console.log("📩 M-Pesa initiated:", result);
              alert(
                "Payment initiated — confirm on your phone, then retry download."
              );
            } catch (err) {
              console.error("❌ initiateMpesa failed:", err);
              alert("Could not start payment. Please try again.");
            }
          }
        }
      }
    } finally {
      setBusy(primaryBtn, false);
      console.groupEnd();
    }
  }

  function handleClose() {
    try {
      console.log("❌ FilePreviewModal closed");
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
      if (typeof onClose === "function") onClose();
    } catch (e) {
      console.error("❌ Error during modal close:", e);
    }
  }
}
