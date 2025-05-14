export function Footer() {
  const footer = document.createElement("footer");
  footer.className = "bg-[#1e1e2f] text-gray-300 pt-12 px-6";

  footer.innerHTML = `
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

      <!-- Brand -->
      <div>
        <h3 class="text-white text-lg font-bold mb-2">Elimu_Online</h3>
        <p class="text-sm text-gray-400">
          Empowering learners with high-quality KCSE resources — notes, exams, and more.
        </p>
        <div class="flex gap-4 mt-4">
          <a href="#" class="hover:text-white"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-white"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-white"><i class="fab fa-youtube"></i></a>
        </div>
      </div>

      <!-- Navigation -->
      <div>
        <h4 class="text-white font-semibold mb-3">Explore</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/about" class="hover:underline">About Us</a></li>
          <li><a href="/resources" class="hover:underline">Resources</a></li>
          <li><a href="/login" class="hover:underline">Login</a></li>
          <li><a href="/register" class="hover:underline">Sign Up</a></li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h4 class="text-white font-semibold mb-3">Support</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:underline">FAQs</a></li>
          <li><a href="#" class="hover:underline">Help Center</a></li>
          <li><a href="#" class="hover:underline">Contact Us</a></li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h4 class="text-white font-semibold mb-3">Subscribe</h4>
        <p class="text-sm text-gray-400 mb-2">Stay updated with the latest free & premium uploads.</p>
        <form class="flex flex-col sm:flex-row gap-2">
          <input 
            type="email"
            placeholder="Your email"
            class="px-3 py-2 rounded w-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          />
          <button class="bg-[#5624d0] hover:bg-purple-800 text-white px-4 py-2 rounded w-full sm:w-auto">
            Sign Up
          </button>
        </form>
      </div>

    </div>

    <!-- Divider -->
    <div class="border-t border-gray-700 mt-10 pt-4 pb-6 text-center text-sm text-gray-500">
      &copy; 2025 Elimu_Online — Empowering learners, one file at a time.
    </div>
  `;

  return footer;
}
