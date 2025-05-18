// src/components/FeaturedResourcesSection.js

export function FeaturedResourcesSection() {
  const section = document.createElement("section");
  section.className = "bg-gray-100 py-16 px-4 sm:px-6 lg:px-8";

  const container = document.createElement("div");
  container.className = "max-w-7xl mx-auto";

  container.innerHTML = `
    <div class="mb-10 text-center">
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
        <span class="inline-block align-middle mr-2">📚</span>Recently Added Resources
      </h2>
      <p class="text-lg text-gray-600">Find high school notes, exams, schemes & more</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
      <input
        type="text"
        id="search-input"
        placeholder="Search by title, subject or keyword..."
        class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <select id="filter-category" class="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/4">
        <option value="">All Categories</option>
        <option value="Notes">Notes</option>
        <option value="Exams">Exams</option>
        <option value="E-Books">E-Books</option>
        <option value="Schemes">Schemes of Work</option>
        <option value="Lesson Plans">Lesson Plans</option>
      </select>
      <select id="filter-form" class="px-4 py-2 border border-gray-300 rounded w-full sm:w-1/4">
        <option value="">All Forms</option>
        <option value="Form 1">Form 1</option>
        <option value="Form 2">Form 2</option>
        <option value="Form 3">Form 3</option>
        <option value="Form 4">Form 4</option>
      </select>
    </div>

    <div id="resource-grid" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <!-- Resource cards will be injected here -->
    </div>
  `;

  section.appendChild(container);

  const grid = container.querySelector("#resource-grid");

  // ✅ Sample data (replace with fetch in production)
  const resources = [
    {
      image: "/images/sample1.jpg", // ✅ KCSE Chemistry Paper preview
      title: "KCSE Chemistry Paper 1 - Nov 2017",
      subject: "Chemistry",
      form: "Form 4",
      category: "Exams",
      author: "KNEC",
      price: 0,
      isFree: true,
    },
    {
      image: "/images/sample2.jpg",
      title: "Form 1 Mid Term Past Paper - English & Literature",
      subject: "English",
      form: "Form 1",
      category: "Exams",
      author: "ELIMU",
      price: 0,
      isFree: true,
    },
    {
      image: "/images/sample3.jpg",
      title: "Form 4 Mathematics Paper 2 - Mock Exam (Sept 2019)",
      subject: "Maths",
      form: "Form 4",
      category: "Exams",
      author: "Busy Teacher",
      price: 125,
      isFree: false,
    },
  ];

  const renderResources = (data) => {
    grid.innerHTML = data.map(getResourceCard).join("");
  };

  const applyFilters = () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    const category = document.getElementById("filter-category").value;
    const form = document.getElementById("filter-form").value;

    const filtered = resources.filter((res) => {
      return (
        res.title.toLowerCase().includes(query) &&
        (category ? res.category === category : true) &&
        (form ? res.form === form : true)
      );
    });

    renderResources(filtered);
  };

  setTimeout(() => {
    document
      .getElementById("search-input")
      .addEventListener("input", applyFilters);
    document
      .getElementById("filter-category")
      .addEventListener("change", applyFilters);
    document
      .getElementById("filter-form")
      .addEventListener("change", applyFilters);
    renderResources(resources); // Initial load
  }, 100);

  return section;
}

// ✅ Resource card template
function getResourceCard({
  image,
  title,
  subject,
  form,
  category,
  author,
  price,
  isFree,
}) {
  const priceDisplay = isFree
    ? `<span class="text-green-600 font-semibold text-sm">Free</span>`
    : `<span class="text-yellow-600 font-semibold text-sm">KSh ${price}.00</span>`;

  const button = isFree
    ? `<button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Download</button>`
    : `<button class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Buy Now</button>`;

  return `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col">
      <img src="${image}" alt="${title}" class="w-full h-36 object-cover rounded-t-lg">
      <div class="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-md font-semibold text-gray-800 mb-1">${title}</h3>
          <p class="text-sm text-gray-500">${subject} · ${form}</p>
          <p class="text-xs text-gray-400 mt-1">By ${author}</p>
        </div>
        <div class="mt-4 flex justify-between items-center">
          ${priceDisplay}
          ${button}
        </div>
      </div>
    </div>
  `;
}
