export function TestimonialsSection() {
  const section = document.createElement("section");
  section.className = "bg-white py-16 px-4 sm:px-6 lg:px-8 relative";

  section.innerHTML = `
    <div class="max-w-7xl mx-auto text-center relative">
      <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
        What Our Users Say
      </h2>
      <p class="text-lg text-gray-600 mb-10">
        Hear from students, teachers, and parents who’ve used Elimu_Online.
      </p>

      <!-- Carousel Wrapper with Arrows -->
      <div class="relative">
        <!-- Left Arrow -->
        <button id="scroll-left" class="hidden md:flex items-center justify-center w-10 h-10 bg-white border shadow-md rounded-full absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 hover:bg-purple-100 transition">
          ←
        </button>

        <!-- Carousel Track -->
        <div id="testimonial-carousel" class="overflow-x-auto scroll-smooth">
          <div id="testimonial-track" class="flex gap-6 sm:gap-8 md:gap-10 w-max px-2">
            ${getTestimonialCard({
              image: "/images/user1.jpg",
              name: "David Mwangi",
              title: "Physics Teacher",
              quote:
                "Elimu_Online offers high-quality teaching resources that match the curriculum perfectly.",
            })}
            ${getTestimonialCard({
              image: "/images/user2.webp",
              name: "Grace Nyambura",
              title: "Form 3 Student",
              quote:
                "The notes and revision kits helped me improve my grades and prepare for KCSE.",
            })}
            ${getTestimonialCard({
              image: "/images/user3.jpg",
              name: "Achieng Atieno",
              title: "Parent & Former Teacher",
              quote:
                "It’s the best digital resource for my children—convenient and well-structured.",
            })}
            ${getTestimonialCard({
              image: "/images/user4.jpg",
              name: "Samuel Kiptoo",
              title: "Computer Studies Teacher",
              quote:
                "The lesson plans and schemes have been a game changer in preparing weekly classes.",
            })}
            ${getTestimonialCard({
              image: "/images/user5.avif",
              name: "Naomi Wairimu",
              title: "Form 4 Student",
              quote:
                "Having access to past papers and exam tips made my studies less stressful.",
            })}
            ${getTestimonialCard({
              image: "/images/user6.webp",
              name: "Peter Okello",
              title: "Maths Tutor",
              quote:
                "I recommend Elimu_Online to all teachers. It's organized, updated, and simple to use.",
            })}
          </div>
        </div>

        <!-- Right Arrow -->
        <button id="scroll-right" class="hidden md:flex items-center justify-center w-10 h-10 bg-white border shadow-md rounded-full absolute -right-5 top-1/2 transform -translate-y-1/2 z-10 hover:bg-purple-100 transition">
          →
        </button>
      </div>
    </div>
  `;

  // ✅ JavaScript: Scroll logic for buttons and auto-scroll
  setTimeout(() => {
    const carousel = section.querySelector("#testimonial-carousel");
    const track = section.querySelector("#testimonial-track");
    const leftArrow = section.querySelector("#scroll-left");
    const rightArrow = section.querySelector("#scroll-right");
    const cardWidth = 340; // Adjust this based on your card width

    // Manual scroll
    leftArrow.addEventListener("click", () => {
      carousel.scrollBy({ left: -cardWidth, behavior: "smooth" });
    });

    rightArrow.addEventListener("click", () => {
      carousel.scrollBy({ left: cardWidth, behavior: "smooth" });
    });

    // Auto-scroll logic
    let scrollX = 0;
    const scrollStep = cardWidth + 24;

    setInterval(() => {
      if (
        carousel.scrollLeft + carousel.offsetWidth >=
        track.scrollWidth - cardWidth
      ) {
        scrollX = 0;
        carousel.scrollTo({ left: scrollX, behavior: "smooth" });
      } else {
        scrollX += scrollStep;
        carousel.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 5000);
  }, 200);

  return section;
}

// ✅ Card Generator with wrap protection
function getTestimonialCard({ image, name, title, quote }) {
  return `
    <div class="bg-gray-50 min-w-[260px] max-w-[90vw] sm:min-w-[300px] md:min-w-[340px] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
      <img src="${image}" alt="${name}" class="w-24 h-24 rounded-full object-cover mb-4 shadow-md border-2 border-purple-200" />
      <h3 class="text-lg font-semibold text-gray-900">${name}</h3>
      <p class="text-sm text-purple-600 mb-2">${title}</p>
      <p class="text-gray-700 text-sm whitespace-normal text-wrap leading-relaxed break-words">
        "${quote}"
      </p>
    </div>
  `;
}
