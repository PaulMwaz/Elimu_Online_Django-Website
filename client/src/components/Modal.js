// src/components/Modal.js

export function openPreviewModal(fileUrl, title) {
  console.log("📦 Opening Preview Modal for:", title, fileUrl);

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

  modal.querySelector("#modal-close").addEventListener("click", () => {
    console.log("❌ Preview Modal closed.");
    modal.remove();
  });

  document.body.appendChild(modal);
  console.log("✅ Preview Modal mounted.");
}

export function openPaymentModal(title, resourceId) {
  console.log(
    "💰 Opening Payment Modal for:",
    title,
    "Resource ID:",
    resourceId
  );

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4";

  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
      <h2 class="text-xl font-bold text-gray-800 mb-3">Pay with M-Pesa</h2>
      <p class="text-sm text-gray-600 mb-4">
        To unlock <span class="font-medium text-black">"${title}"</span>, enter your phone number to receive an M-Pesa prompt.
      </p>

      <input type="tel" id="mpesa-phone" placeholder="Safaricom number e.g. 0712345678"
        class="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      <button id="pay-now-btn"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
        Pay Now
      </button>

      <button id="cancel-payment-btn"
        class="mt-4 text-sm text-gray-500 hover:underline w-full text-center">
        Cancel
      </button>
    </div>
  `;

  // Cancel handler
  modal.querySelector("#cancel-payment-btn").addEventListener("click", () => {
    console.log("🚫 Payment Modal closed by user.");
    modal.remove();
  });

  // Pay Now handler
  modal.querySelector("#pay-now-btn").addEventListener("click", () => {
    const phone = modal.querySelector("#mpesa-phone").value.trim();
    if (!/^07\d{8}$/.test(phone)) {
      alert("❌ Enter a valid Safaricom number (e.g., 0712345678)");
      return;
    }

    console.log(
      "📲 Initiating STK Push to:",
      phone,
      "for resource:",
      resourceId
    );

    // 🔁 Replace this with your actual payment API call
    alert(`M-Pesa STK Push initiated to ${phone} for "${title}"`);
    modal.remove();
  });

  document.body.appendChild(modal);
  console.log("✅ Payment Modal mounted.");
}
