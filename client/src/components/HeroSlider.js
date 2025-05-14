export function HeroSlider() {
  const images = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
  ];
  let currentIndex = 0;

  // ✅ Fullscreen container
  const container = document.createElement("div");
  container.className = "relative w-screen h-screen overflow-hidden";

  // ✅ Hero image
  const imageEl = document.createElement("img");
  imageEl.src = images[currentIndex];
  imageEl.alt = "Hero Slide";
  imageEl.className =
    "absolute inset-0 w-full h-full object-cover transition-opacity duration-700";

  // ✅ Fallback for broken image
  imageEl.onerror = () => {
    imageEl.src = "/images/placeholder.jpg"; // optional placeholder fallback
  };

  container.appendChild(imageEl);

  // ✅ Overlay with heading & subtitle
  const overlay = document.createElement("div");
  overlay.className =
    "absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-2 sm:px-6";
  overlay.innerHTML = `
    <h1 class="text-3xl md:text-5xl font-bold mb-4">Welcome to Elimu_Online</h1>
    <p class="text-base md:text-lg max-w-xl">
      Discover trusted, curriculum-aligned KCSE resources from experienced educators — notes, exams, and more.
    </p>
  `;
  container.appendChild(overlay);

  // ✅ Left navigation arrow
  const leftBtn = document.createElement("button");
  leftBtn.innerHTML = "←";
  leftBtn.className =
    "absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 z-20";

  // ✅ Right navigation arrow
  const rightBtn = document.createElement("button");
  rightBtn.innerHTML = "→";
  rightBtn.className =
    "absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 z-20";

  container.appendChild(leftBtn);
  container.appendChild(rightBtn);

  // ✅ Slide logic
  function updateImage() {
    imageEl.src = images[currentIndex];
  }

  leftBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  });

  rightBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  });

  // ✅ Auto advance slides
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  }, 6000);

  return container;
}
