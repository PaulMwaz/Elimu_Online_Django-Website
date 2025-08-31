// client/src/components/FileCard.js
// ------------------------------------------------------------
// Vanilla JS card factory used across the app.
// - Strong debug logs (grouped + tables)
// - Safe defaults (placeholder preview, N/A labels)
// - Buttons adapt: Free → Preview + Download, Paid → Preview + Buy
// - Callbacks: onPreview, onDownload, onBuy (all optional)
// - Keyboard accessible, robust to missing props
// ------------------------------------------------------------

/**
 * Create a DOM element with classes/attrs quickly.
 */
function el(tag, className = "", attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined && v !== null) node.setAttribute(k, String(v));
  }
  return node;
}

/**
 * Logs in a collapsible group (no throw on old browsers).
 */
function logGroup(title, obj) {
  try {
    console.groupCollapsed(title);
    if (obj !== undefined) console.log(obj);
    console.groupEnd();
  } catch {}
}

/**
 * Props:
 *  - title              (string, required)
 *  - subtitle           (string, optional, shown under title)
 *  - sizeLabel          (string, e.g. "2.1 MB", optional)
 *  - pageCount          (number|string, optional)
 *  - previewImageUrl    (string url, optional)
 *  - previewUrl         (string url, optional)
 *  - downloadUrl        (string url, optional)
 *  - isFree             (bool, default true)
 *  - price              (number|string, default 0)
 *  - onPreview()        (fn, optional)
 *  - onDownload()       (fn, optional)
 *  - onBuy()            (fn, optional)
 */
export function FileCard(props = {}) {
  const {
    title = "Untitled resource",
    subtitle = "",
    sizeLabel = "",
    pageCount = "",
    previewImageUrl,
    previewUrl,
    downloadUrl,
    isFree = true,
    price = 0,
    onPreview,
    onDownload,
    onBuy,
  } = props;

  logGroup("📦 Rendering <FileCard>", {
    ...props,
    // don’t log huge functions
    onPreview: Boolean(onPreview),
    onDownload: Boolean(onDownload),
    onBuy: Boolean(onBuy),
  });

  // ---------- shell -------------------------------------------------
  const card = el(
    "div",
    "bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 w-full"
  );
  card.dataset.title = title;

  // ---------- header (image) ----------------------------------------
  const header = el(
    "div",
    "relative w-full h-60 overflow-hidden rounded-t-xl bg-gray-100"
  );
  const img = el("img", "w-full h-full object-cover", {
    alt: `Preview of ${title}`,
    loading: "lazy",
    decoding: "async",
  });

  // fallback preview image if none provided or load fails
  const fallbackPreview =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='100%' height='100%' fill='#eef'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='22' fill='#556'>No preview</text></svg>`
    );

  img.src = previewImageUrl || fallbackPreview;
  img.onerror = () => {
    console.warn("🖼️ FileCard preview image failed. Using fallback.", {
      title,
      previewImageUrl,
    });
    img.src = fallbackPreview;
  };

  const badge = el(
    "span",
    `absolute top-2 left-2 text-xs font-bold text-white px-2 py-1 rounded ${
      isFree ? "bg-green-600" : "bg-yellow-600"
    }`
  );
  badge.textContent = isFree ? "Free" : `KSh ${Number(price || 0).toFixed(0)}`;

  header.appendChild(img);
  header.appendChild(badge);

  // ---------- body ---------------------------------------------------
  const body = el("div", "p-4 flex flex-col space-y-2");
  const titleEl = el("h3", "text-sm font-semibold text-[#5624d0] truncate");
  titleEl.textContent = title;

  const meta = el("p", "text-xs text-gray-500");
  const parts = [
    sizeLabel,
    pageCount ? `${pageCount} page${Number(pageCount) === 1 ? "" : "s"}` : "",
  ]
    .filter(Boolean)
    .join(" • ");
  meta.textContent = parts || "—";

  if (subtitle) {
    const subtitleEl = el("p", "text-[11px] text-gray-400");
    subtitleEl.textContent = subtitle;
    body.appendChild(subtitleEl);
  }

  // Actions
  const actions = el("div", "flex gap-2 justify-end");

  // Preview button
  const previewBtn = el(
    "button",
    `px-3 py-1.5 rounded-md text-sm ${
      previewUrl
        ? "bg-indigo-600 text-white hover:bg-indigo-700"
        : "bg-slate-300 text-white cursor-not-allowed"
    }`,
    { type: "button", "aria-label": `Preview ${title}`, title: "Preview" }
  );
  previewBtn.textContent = "Preview";

  // Download / Buy button depends on isFree
  const rightBtn = el(
    "button",
    `px-3 py-1.5 rounded-md text-sm ${
      isFree
        ? downloadUrl
          ? "bg-[#5624d0] text-white hover:bg-purple-800"
          : "bg-slate-300 text-white cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700"
    }`,
    { type: "button" }
  );
  rightBtn.textContent = isFree ? "Download" : `Buy`;

  // Accessibility focus styles
  [previewBtn, rightBtn].forEach((b) => b.classList.add("focus:outline-none"));

  // Append nodes
  body.appendChild(titleEl);
  body.appendChild(meta);
  body.appendChild(actions);
  actions.appendChild(previewBtn);
  actions.appendChild(rightBtn);

  card.appendChild(header);
  card.appendChild(body);

  // ---------- handlers -----------------------------------------------
  previewBtn.addEventListener("click", () => {
    if (!previewUrl) return;
    console.log("👁️ Preview clicked:", { title, previewUrl });
    try {
      if (typeof onPreview === "function") {
        onPreview({ title, previewUrl, isFree, price });
      } else {
        window.open(previewUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      console.error("❌ onPreview handler error:", e);
    }
  });

  rightBtn.addEventListener("click", () => {
    if (isFree) {
      if (!downloadUrl) return;
      console.log("⬇️ Download clicked:", { title, downloadUrl });
      try {
        if (typeof onDownload === "function") {
          onDownload({ title, downloadUrl });
        } else {
          // do a simple anchor download
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (e) {
        console.error("❌ onDownload handler error:", e);
      }
    } else {
      console.log("💳 Buy clicked:", { title, price });
      try {
        if (typeof onBuy === "function") {
          onBuy({ title, price });
        } else {
          alert(`This file costs KSh ${Number(price || 0).toFixed(0)}.`);
        }
      } catch (e) {
        console.error("❌ onBuy handler error:", e);
      }
    }
  });

  // Keyboard support (Enter on focused image opens preview if available)
  img.tabIndex = 0;
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && previewUrl) {
      previewBtn.click();
    }
  });

  return card;
}
