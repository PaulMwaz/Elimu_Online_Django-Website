export function About() {
  const section = document.createElement("section");
  section.className = "min-h-screen bg-gray-100 p-10 text-center";

  section.innerHTML = `
    <h1 class="text-3xl font-bold text-[#5624d0] mb-4">About Elimu-Online</h1>
    <p class="text-gray-700 max-w-xl mx-auto">
      Elimu-Online is a modern e-learning platform built for high school students to access verified KCSE resources. 
      From detailed notes to past exam papers and digital e-books, we are committed to enhancing academic excellence through accessible digital tools.
    </p>
  `;

  return section;
}
