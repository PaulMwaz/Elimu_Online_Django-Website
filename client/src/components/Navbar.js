export function Navbar() {
  const nav = document.createElement("nav");
  nav.className =
    "bg-white/90 backdrop-blur shadow-md fixed w-full top-0 z-50 px-6 py-4 flex justify-between items-center";

  nav.innerHTML = `
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" class="h-8 w-8 rounded-full bg-white border" />
      <span class="text-xl font-bold text-[#5624d0]">Elimu_Online</span>
    </div>

    <div class="hidden md:flex gap-6 text-sm font-medium text-gray-700">
      <a href="/" class="hover:text-[#5624d0]">Home</a>
      <a href="/about" class="hover:text-[#5624d0]">About Us</a>
      <a href="/resources" class="hover:text-[#5624d0]">Resources</a>
    </div>

    <div class="hidden md:flex gap-3">
      <a href="/login" class="px-4 py-2 border border-[#5624d0] text-[#5624d0] rounded hover:bg-gray-100">Login</a>
      <a href="/register" class="px-4 py-2 bg-[#5624d0] text-white rounded hover:bg-purple-800">Sign Up</a>
    </div>
  `;

  // SPA-style routing
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", link.getAttribute("href"));
      window.dispatchEvent(new Event("popstate"));
    });
  });

  return nav;
}
