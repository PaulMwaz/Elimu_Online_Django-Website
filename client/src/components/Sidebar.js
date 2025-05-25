// src/components/Sidebar.js

export function Sidebar() {
  console.log("🟪 DEBUG: Rendering Sidebar");

  const sidebar = document.createElement("aside");
  sidebar.className = `
    fixed top-0 left-0 h-screen w-64 bg-[#1f2937] text-white shadow-lg
    pt-[64px] px-4 z-40 hidden md:block
  `;

  sidebar.innerHTML = `
    <h2 class="text-lg font-semibold text-white mb-6 pl-1">
      High School Resources
    </h2>
    <ul class="space-y-3 text-sm font-medium">
      <li>
        <a href="/dashboard" class="block py-2 px-3 rounded hover:bg-[#374151]">
          🏠 Dashboard
        </a>
      </li>
      <li>
        <a href="/notes" class="block py-2 px-3 rounded hover:bg-[#374151]">
          📚 Notes
        </a>
      </li>
      <li>
        <a href="/exams" class="block py-2 px-3 rounded hover:bg-[#374151]">
          📝 Exams
        </a>
      </li>
      <li>
        <a href="/ebooks" class="block py-2 px-3 rounded hover:bg-[#374151]">
          📖 E-Books
        </a>
      </li>
      <li>
        <a href="/schemes" class="block py-2 px-3 rounded hover:bg-[#374151]">
          📘 Schemes of Work
        </a>
      </li>
      <li>
        <a href="/lessons" class="block py-2 px-3 rounded hover:bg-[#374151]">
          🗂️ Lesson Plans
        </a>
      </li>
      <li>
        <a href="/logout" class="block py-2 px-3 rounded hover:bg-red-700 text-red-300">
          🚪 Logout
        </a>
      </li>
    </ul>
  `;

  // ✅ Enable SPA routing
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      console.log("🔗 Sidebar nav:", href);
      window.history.pushState({}, "", href);
      window.dispatchEvent(new Event("popstate"));
    });
  });

  return sidebar;
}
