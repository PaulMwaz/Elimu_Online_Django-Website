export function Register() {
  const section = document.createElement("section");
  section.className =
    "min-h-screen bg-gray-100 flex items-center justify-center px-4";

  const wrapper = document.createElement("div");
  wrapper.className = "w-full max-w-md bg-white p-8 rounded shadow-md";

  wrapper.innerHTML = `
    <h2 class="text-2xl font-bold mb-6 text-center text-[#5624d0]">Create an Account</h2>
    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" placeholder="Your Name" class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input type="email" placeholder="example@email.com" class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input type="password" placeholder="********" class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <button type="submit" class="w-full bg-[#5624d0] text-white py-2 rounded hover:bg-purple-800 transition">
        Sign Up
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Already have an account?
        <a href="/login" class="text-[#5624d0] hover:underline">Login</a>
      </p>
    </form>
  `;

  // Optional: SPA link handling
  wrapper.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", link.getAttribute("href"));
      window.dispatchEvent(new Event("popstate"));
    });
  });

  section.appendChild(wrapper);
  return section;
}
