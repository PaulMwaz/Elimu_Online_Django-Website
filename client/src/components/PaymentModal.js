export function openPaymentModal(resourceId, title, price) {
  console.log(
    `💳 DEBUG: Opening payment modal → [ID: ${resourceId}, Title: ${title}, Price: Ksh ${price}]`
  );

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div class="bg-white w-[95%] max-w-md p-6 rounded-lg shadow-xl relative animate-fade-in">
      <h2 class="text-xl font-bold text-center text-[#5624d0] mb-2">Pay to Unlock</h2>
      <p class="text-sm text-center mb-4">
        You're about to unlock <strong>${title}</strong> for <strong>Ksh ${price}</strong>.
      </p>
      <input
        type="tel"
        id="mpesa-phone"
        placeholder="Enter M-Pesa Number (e.g., 0712345678)"
        class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-400 mb-4"
      />
      <div class="flex justify-between items-center mt-4 gap-4">
        <button id="cancel-pay" class="w-1/2 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded">
          Cancel
        </button>
        <button id="confirm-pay" class="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Pay with M-Pesa
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  console.log("🧩 DEBUG: Modal rendered and added to DOM");

  // Cancel button
  document.getElementById("cancel-pay").onclick = () => {
    console.log("❌ DEBUG: Payment modal closed by user");
    modal.remove();
  };

  // Confirm payment
  document.getElementById("confirm-pay").onclick = () => {
    const phone = document.getElementById("mpesa-phone").value.trim();

    if (!/^07\d{8}$/.test(phone)) {
      console.warn("⚠️ DEBUG: Invalid phone number:", phone);
      alert("Please enter a valid Safaricom number (e.g., 0712345678).");
      return;
    }

    console.log(
      `📲 DEBUG: Initiating payment → ResourceID: ${resourceId}, Phone: ${phone}`
    );
    initiatePayment(resourceId, phone, modal);
  };
}

async function initiatePayment(resourceId, phoneNumber, modal) {
  try {
    const response = await fetch("/api/payment/stkpush/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resource_id: resourceId,
        phone_number: phoneNumber,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Payment failed");
    }

    console.log("✅ DEBUG: Payment initiation response:", result);

    modal.innerHTML = `
      <div class="text-center p-6">
        <h3 class="text-green-600 font-bold text-xl mb-2">Payment Sent</h3>
        <p class="text-sm text-gray-700">
          Please complete the payment on your phone (M-Pesa STK Push).
        </p>
        <button class="mt-4 bg-[#5624d0] text-white px-4 py-2 rounded" onclick="document.body.removeChild(this.parentElement.parentElement)">
          Done
        </button>
      </div>
    `;
  } catch (err) {
    console.error("❌ ERROR: M-Pesa STK Push failed:", err);
    alert("Failed to initiate payment. Please try again.");
    modal.remove();
  }
}
