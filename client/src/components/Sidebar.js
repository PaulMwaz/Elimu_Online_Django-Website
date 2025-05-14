export function Sidebar() {
  const sidebar = document.createElement("aside");
  sidebar.className = "w-60 bg-[#2c2c54] text-white p-4 h-full";

  sidebar.innerHTML = `
    <ul class="space-y-4 font-medium">
      <li><a href="/dashboard" class="hover:text-yellow-300">Dashboard</a></li>
      <li><a href="/notes" class="hover:text-yellow-300">Notes</a></li>
      <li><a href="/exams" class="hover:text-yellow-300">Exams</a></li>
      <li><a href="/ebooks" class="hover:text-yellow-300">E-Books</a></li>
      <li><a href="/logout" class="hover:text-yellow-300">Logout</a></li>
    </ul>
  `;

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState({}, "", link.getAttribute("href"));
      window.dispatchEvent(new Event("popstate"));
    });
  });

  return sidebar;
}
