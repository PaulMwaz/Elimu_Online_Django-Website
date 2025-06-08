(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const p=window.location.hostname==="localhost"?"http://127.0.0.1:8000/api":"https://elimu-backend-59739536402.europe-west1.run.app/api";function L(e,t=null){console.log("🔐 Saving tokens to localStorage..."),localStorage.setItem("auth_token",e),t&&localStorage.setItem("refresh_token",t)}function k(){const e=localStorage.getItem("auth_token");return console.log("🔎 Fetched access token:",e?"✔️ Found":"❌ Missing"),e}function m(){const e=!!k();return console.log("👁️ Logged in:",e),e}function M(){console.log("🚪 Logging out: clearing localStorage tokens & user..."),localStorage.removeItem("auth_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("auth_user")}async function F(e,t){console.log("🚀 Attempting login with:",e);const o=await fetch(`${p}/token/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})});if(!o.ok){const r=await o.json().catch(()=>({message:"Login failed"}));throw console.error("❌ Login failed:",r),new Error(r.detail||r.message||"Invalid credentials")}const s=await o.json();console.log("✅ JWT tokens received:",s),L(s.access,s.refresh);const n=await C(s.access);return localStorage.setItem("auth_user",JSON.stringify(n)),console.log("👤 Logged-in user profile:",n),{token:s.access,user:n}}async function C(e){console.log("📡 Fetching user profile with token...");const t=await fetch(`${p}/users/me/`,{headers:{Authorization:`Bearer ${e}`}});return t.ok?await t.json():(console.warn("⚠️ Failed to fetch profile. Using fallback."),{name:"User",email:"unknown"})}function A(){const e=localStorage.getItem("auth_user");return console.log("🧾 Current user from localStorage:",e),e?JSON.parse(e):null}async function N(e){console.log("📝 Registering user with data:",e);const t=await fetch(`${p}/users/register/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){const s=await t.json().catch(()=>({message:"Registration failed"}));throw console.error("❌ Registration error:",s),new Error(s.message||"Signup error")}const o=await t.json();return console.log("✅ Registration successful:",o),o}function $(){const e=["/images/slide1.jpg","/images/slide2.jpg","/images/slide3.jpg"];let t=0;const o=document.createElement("div");o.className="relative w-screen h-screen overflow-hidden";const s=document.createElement("img");s.src=e[t],s.alt="Hero Slide",s.className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700",s.onerror=()=>{s.src="/images/placeholder.jpg"},o.appendChild(s);const n=document.createElement("div");n.className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center px-2 sm:px-6",n.innerHTML=`
    <h1 class="text-3xl md:text-5xl font-bold mb-4">Welcome to Elimu_Online</h1>
    <p class="text-base md:text-lg max-w-xl">
      Discover trusted, curriculum-aligned KCSE resources from experienced educators — notes, exams, and more.
    </p>
  `,o.appendChild(n);const r=document.createElement("button");r.innerHTML="←",r.className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 z-20";const a=document.createElement("button");a.innerHTML="→",a.className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 transform bg-black bg-opacity-50 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-80 z-20",o.appendChild(r),o.appendChild(a);function d(){s.src=e[t]}return r.addEventListener("click",()=>{t=(t-1+e.length)%e.length,d()}),a.addEventListener("click",()=>{t=(t+1)%e.length,d()}),setInterval(()=>{t=(t+1)%e.length,d()},6e3),o}function P(){const e=document.createElement("section");return e.className="bg-[#F4FFF6] py-16 px-6",e.innerHTML=`
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">Why Choose Elimu_Online?</h2>
      <p class="text-[#475569] mb-10 max-w-2xl mx-auto">
        We're not just another resource website — we're a learning companion built for Kenyan students and teachers.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">KCSE-Aligned Content</h3>
          <p class="text-sm text-gray-600">Every resource is crafted with the national curriculum in mind.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">Trusted by Educators</h3>
          <p class="text-sm text-gray-600">Used by teachers and schools to improve academic outcomes.</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-300">
          <div class="text-3xl mb-4">📚</div>
          <h3 class="text-xl font-semibold text-[#10B981] mb-2">Always Up to Date</h3>
          <p class="text-sm text-gray-600">Content is refreshed every term with timely topics and exams.</p>
        </div>
      </div>
    </div>
  `,e}function B(){const e=document.createElement("section");return e.className="bg-white py-16 px-6 text-center",e.innerHTML=`
    <h2 class="text-3xl md:text-4xl font-bold text-[#1E293B] mb-6">How It Works</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">📝</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">1. Sign Up</h3>
        <p class="text-sm text-gray-600 mt-2">Create your account and join the learning community.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">🔍</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">2. Browse Resources</h3>
        <p class="text-sm text-gray-600 mt-2">Explore notes, exams, lesson plans, and more by category.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">📥</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">3. View or Download</h3>
        <p class="text-sm text-gray-600 mt-2">Instantly access resources or save them offline.</p>
      </div>
      <div class="bg-[#F4FFF6] p-6 rounded-lg shadow hover:shadow-md transition">
        <div class="text-3xl mb-3">🚀</div>
        <h3 class="font-semibold text-lg text-[#1E293B]">4. Stay Ahead</h3>
        <p class="text-sm text-gray-600 mt-2">Learn with ease and stay updated with new content every term.</p>
      </div>
    </div>
  `,e}function T(){const e=document.createElement("section");e.className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8";const t=document.createElement("div");t.className="max-w-7xl mx-auto",t.innerHTML=`
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
  `,e.appendChild(t);const o=t.querySelector("#resource-grid"),s=[{image:"/images/sample1.jpg",title:"KCSE Chemistry Paper 1 - Nov 2017",subject:"Chemistry",form:"Form 4",category:"Exams",author:"KNEC",price:0,isFree:!0},{image:"/images/sample2.jpg",title:"Form 1 Mid Term Past Paper - English & Literature",subject:"English",form:"Form 1",category:"Exams",author:"ELIMU",price:0,isFree:!0},{image:"/images/sample3.jpg",title:"Form 4 Mathematics Paper 2 - Mock Exam (Sept 2019)",subject:"Maths",form:"Form 4",category:"Exams",author:"Busy Teacher",price:125,isFree:!1}],n=a=>{o.innerHTML=a.map(j).join("")},r=()=>{const a=document.getElementById("search-input").value.toLowerCase(),d=document.getElementById("filter-category").value,i=document.getElementById("filter-form").value,l=s.filter(c=>c.title.toLowerCase().includes(a)&&(d?c.category===d:!0)&&(i?c.form===i:!0));n(l)};return setTimeout(()=>{document.getElementById("search-input").addEventListener("input",r),document.getElementById("filter-category").addEventListener("change",r),document.getElementById("filter-form").addEventListener("change",r),n(s)},100),e}function j({image:e,title:t,subject:o,form:s,category:n,author:r,price:a,isFree:d}){const i=d?'<span class="text-green-600 font-semibold text-sm">Free</span>':`<span class="text-yellow-600 font-semibold text-sm">KSh ${a}.00</span>`;return`
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col">
      <img src="${e}" alt="${t}" class="w-full h-36 object-cover rounded-t-lg">
      <div class="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 class="text-md font-semibold text-gray-800 mb-1">${t}</h3>
          <p class="text-sm text-gray-500">${o} · ${s}</p>
          <p class="text-xs text-gray-400 mt-1">By ${r}</p>
        </div>
        <div class="mt-4 flex justify-between items-center">
          ${i}
          ${d?'<button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Download</button>':'<button class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Buy Now</button>'}
        </div>
      </div>
    </div>
  `}function R(){const e=document.createElement("section");e.className="bg-gray-50 pt-[80px]";const t=$(),o=P(),s=B(),n=T();return e.appendChild(t),e.appendChild(o),e.appendChild(s),e.appendChild(n),e}function q(){const e=document.createElement("section");return e.className="min-h-screen bg-gray-100 p-10 text-center",e.innerHTML=`
    <h1 class="text-3xl font-bold text-[#5624d0] mb-4">About Elimu-Online</h1>
    <p class="text-gray-700 max-w-xl mx-auto">
      Elimu-Online is a modern e-learning platform built for high school students to access verified KCSE resources. 
      From detailed notes to past exam papers and digital e-books, we are committed to enhancing academic excellence through accessible digital tools.
    </p>
  `,e}function I(){const e=document.createElement("section");e.className="min-h-screen bg-gray-100 flex items-center justify-center px-4";const t=document.createElement("div");return t.className="w-full max-w-md bg-white p-8 rounded shadow-md",t.innerHTML=`
    <h2 class="text-2xl font-bold mb-6 text-center text-[#5624d0]">Create an Account</h2>
    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
        <input id="name" type="text" placeholder="Your Name" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" placeholder="example@email.com" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" placeholder="********" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <button type="submit" class="w-full bg-[#5624d0] text-white py-2 rounded hover:bg-purple-800 transition">
        Sign Up
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Already have an account?
        <a href="/login" class="text-[#5624d0] hover:underline">Login</a>
      </p>
    </form>
  `,t.querySelectorAll("a").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const r=s.getAttribute("href");console.log("🔗 SPA link clicked:",r),window.history.pushState({},"",r),window.dispatchEvent(new Event("popstate"))})}),t.querySelector("form").addEventListener("submit",async s=>{s.preventDefault();const n=t.querySelector("#name").value.trim(),r=t.querySelector("#email").value.trim(),a=t.querySelector("#password").value.trim();console.log("📝 Attempting registration with:",{name:n,email:r});try{const d=await N({name:n,email:r,password:a});console.log("✅ Registration response:",d),alert("🎉 Registration successful. Please login."),window.history.pushState({},"","/login"),window.dispatchEvent(new Event("popstate"))}catch(d){console.error("❌ Registration error:",d.message),alert(`Error: ${d.message}`)}}),e.appendChild(t),e}function H(){const e=document.createElement("section");e.className="min-h-screen bg-gray-100 flex items-center justify-center px-4";const t=document.createElement("div");return t.className="w-full max-w-md bg-white p-8 rounded shadow-md",t.innerHTML=`
    <h2 class="text-2xl font-bold mb-6 text-center text-[#5624d0]">Login to Your Account</h2>
    <form class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" placeholder="example@email.com" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" placeholder="********" required class="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5624d0]" />
      </div>
      <button type="submit" class="w-full bg-[#5624d0] text-white py-2 rounded hover:bg-purple-800 transition">
        Login
      </button>
      <p class="text-sm text-center mt-4 text-gray-600">
        Don’t have an account?
        <a href="/signup" class="text-[#5624d0] hover:underline">Sign Up</a>
      </p>
    </form>
  `,t.querySelectorAll("a").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const r=s.getAttribute("href");console.log("🔗 SPA navigation to:",r),window.history.pushState({},"",r),window.dispatchEvent(new Event("popstate"))})}),t.querySelector("form").addEventListener("submit",async s=>{s.preventDefault();const n=t.querySelector("#email").value.trim(),r=t.querySelector("#password").value.trim();console.log("🔐 Attempting login with:",{email:n,password:r});try{const a=await F(n,r);console.log("✅ Login success:",a);const d=document.querySelector("nav");d?d.replaceWith(v()):console.warn("⚠️ Navbar not found to refresh."),alert("Login successful!"),window.history.pushState({},"","/dashboard"),window.dispatchEvent(new Event("popstate"))}catch(a){console.error("❌ Login failed:",a.message),alert(`Error: ${a.message}`)}}),e.appendChild(t),e}const x=window.location.hostname==="localhost"?"http://127.0.0.1:8000/api":"https://elimu-backend-59739536402.europe-west1.run.app/api";console.log("🌍 API Base URL:",x);async function U(e,t={}){console.log("📡 Fetching:",e);const o=await fetch(e,{headers:{"Content-Type":"application/json",...t.headers},...t});if(!o.ok){const n=await o.json().catch(()=>({message:o.statusText}));throw console.error("❌ API Error:",n.message),new Error(n.message||"Something went wrong")}const s=await o.json();return console.log("✅ Fetched successfully:",e,s),s}async function D(){return console.log("📥 fetchResources() called"),await U(`${x}/resources/`)}function O(e,t){console.log("📦 Opening Preview Modal for:",t,e);const o=document.createElement("div");o.className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50",o.innerHTML=`
    <div class="bg-white rounded-lg shadow-xl w-[95%] max-w-3xl p-6 relative">
      <h3 class="text-lg font-bold mb-4 text-center text-[#5624d0]">${t}</h3>
      <iframe src="${e}" class="w-full h-[500px] border rounded" frameborder="0"></iframe>
      <button class="absolute top-3 right-4 text-gray-700 hover:text-black text-xl font-bold" id="modal-close">&times;</button>
    </div>
  `,o.querySelector("#modal-close").addEventListener("click",()=>{console.log("❌ Preview Modal closed."),o.remove()}),document.body.appendChild(o),console.log("✅ Preview Modal mounted.")}function _(e,t){console.log("💰 Opening Payment Modal for:",e,"Resource ID:",t);const o=document.createElement("div");o.className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4",o.innerHTML=`
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
      <h2 class="text-xl font-bold text-gray-800 mb-3">Pay with M-Pesa</h2>
      <p class="text-sm text-gray-600 mb-4">
        To unlock <span class="font-medium text-black">"${e}"</span>, enter your phone number to receive an M-Pesa prompt.
      </p>

      <input type="tel" id="mpesa-phone" placeholder="Safaricom number e.g. 0712345678"
        class="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      <button id="pay-now-btn"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
        Pay Now
      </button>

      <button id="cancel-payment-btn"
        class="mt-4 text-sm text-gray-500 hover:underline w-full text-center">
        Cancel
      </button>
    </div>
  `,o.querySelector("#cancel-payment-btn").addEventListener("click",()=>{console.log("🚫 Payment Modal closed by user."),o.remove()}),o.querySelector("#pay-now-btn").addEventListener("click",()=>{const s=o.querySelector("#mpesa-phone").value.trim();if(!/^07\d{8}$/.test(s)){alert("❌ Enter a valid Safaricom number (e.g., 0712345678)");return}console.log("📲 Initiating STK Push to:",s,"for resource:",t),alert(`M-Pesa STK Push initiated to ${s} for "${e}"`),o.remove()}),document.body.appendChild(o),console.log("✅ Payment Modal mounted.")}function W(){console.log("🟪 DEBUG: Rendering Dashboard");const e=document.createElement("section");return e.className="flex min-h-screen",e.innerHTML=`
    <aside class="fixed top-0 left-0 w-64 h-full bg-[#1f2937] text-white shadow-md z-40 hidden md:flex flex-col pt-[64px]">
      <h2 class="text-lg font-bold text-center mb-6">High School Resources</h2>
      <nav class="flex flex-col px-4 gap-3 text-sm font-medium">
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="notes">📚 Notes</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="ebooks">📖 E-Books</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="exams">📝 Exams</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="schemes">📘 Schemes of Work</button>
        <button class="btn-resource hover:bg-[#374151] px-3 py-2 rounded text-left" data-type="lessons">🗂️ Lesson Plans</button>
      </nav>
    </aside>

    <main id="dashboard-content" class="flex-1 ml-0 md:ml-64 pt-2 px-2 md:px-4 bg-gray-50 min-h-screen">
      <h3 class="text-xl font-semibold mt-0 mb-4">Select a category</h3>
    </main>
  `,e.querySelectorAll(".btn-resource").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-type");console.log(`📁 DEBUG: Resource type selected → ${o}`),K(o)})}),e}async function K(e){const t=document.getElementById("dashboard-content"),o={notes:"Notes",ebooks:"E-Books",exams:"Exams",schemes:"Schemes of Work",lessons:"Lesson Plans"},s=e==="notes"||e==="ebooks"?"level":"term";try{console.log("📦 DEBUG: Fetching resources from API...");const r=(await D()).filter(i=>i.category===o[e]);console.log(`📦 DEBUG: Total fetched → ${r.length}`),console.table(r);const a={};r.forEach(i=>{const l=i[s]||"Uncategorized";a[l]||(a[l]=[]),a[l].push(i)});let d=`<h2 class="text-2xl font-bold text-[#5624d0] mb-4">${o[e]}</h2>`;for(const[i,l]of Object.entries(a))console.log(`📂 DEBUG: Rendering group → ${i} (${l.length})`),d+=`
        <div class="mb-6">
          <h4 class="text-xl font-semibold text-gray-700 mb-2">${i} ${o[e]}</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${l.map(c=>{const u=c.is_free,E=c.price?`Ksh ${c.price}`:"Premium",S=u?`<button class="px-3 py-1 bg-green-500 text-white rounded text-sm btn-view" data-url="${c.file_url}" data-title="${c.title}">View</button>`:`<button class="px-3 py-1 bg-yellow-500 text-white rounded text-sm btn-pay" data-id="${c.id}" data-title="${c.title}" data-price="${c.price}">Pay ${E}</button>`;return`
                  <div class="border p-4 rounded shadow-sm bg-white">
                    <h5 class="font-medium">${c.title}</h5>
                    <div class="mt-2 flex gap-2">${S}</div>
                  </div>
                `}).join("")}
          </div>
        </div>
      `;t.innerHTML=d,document.querySelectorAll(".btn-view").forEach(i=>{i.addEventListener("click",()=>{const l=i.getAttribute("data-url"),c=i.getAttribute("data-title");console.log(`👁️ DEBUG: Preview clicked → ${c}`),O(l,c)})}),document.querySelectorAll(".btn-pay").forEach(i=>{i.addEventListener("click",()=>{const l=i.getAttribute("data-id"),c=i.getAttribute("data-title"),u=i.getAttribute("data-price");console.log(`💳 DEBUG: Unlocking premium → ${c} | ID: ${l} | Price: ${u}`),_(c,l)})})}catch(n){console.error("❌ Failed to fetch or render resources:",n),t.innerHTML='<p class="text-red-500">Failed to load resources. Please try again later.</p>'}}function b(){const e=document.getElementById("page-content");if(!e){console.warn("⚠️ router(): #page-content container not found");return}e.innerHTML="";const t=window.location.pathname;console.log(`🔀 router(): Navigating to → ${t}`),t==="/"?(console.log("📄 Rendering → Home"),e.appendChild(R())):t==="/about"?(console.log("📄 Rendering → About"),e.appendChild(q())):t==="/signup"?(console.log("📄 Rendering → Signup"),e.appendChild(I())):t==="/login"?(console.log("📄 Rendering → Login"),e.appendChild(H())):["/dashboard","/notes","/ebooks","/exams","/schemes","/lessons"].includes(t)?(console.log(`📄 Rendering Dashboard for → ${t}`),e.appendChild(W())):(console.error("❌ 404 - Unknown route:",t),e.innerHTML=`
      <div class="p-8 text-center">
        <h1 class="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
        <p class="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
      </div>
    `)}function v(){const e=A();console.log("👤 Current User in Navbar:",e);const t=document.createElement("nav");t.className="fixed top-0 left-0 w-full h-[64px] bg-white shadow z-50 flex items-center justify-between px-6",t.innerHTML=`
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" class="h-8 w-8 rounded-full bg-white border" />
      <span class="text-xl font-bold text-[#5624d0]">Elimu_Online</span>
    </div>

    <!-- Public Links (only when NOT logged in) -->
    ${m()?"":`
      <div class="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        <a href="/" class="hover:text-[#5624d0]">Home</a>
        <a href="/about" class="hover:text-[#5624d0]">About Us</a>
        <a href="/resources" class="hover:text-[#5624d0]">Resources</a>
      </div>
    `}

    <!-- Desktop Auth -->
    <div id="auth-section" class="hidden md:flex gap-3 text-sm font-medium">
      ${m()?z(e):g()}
    </div>

    <!-- Mobile toggle -->
    <button id="menuToggle" class="md:hidden text-[#5624d0] text-2xl focus:outline-none transition duration-200">
      <span id="menuIcon">☰</span>
    </button>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="hidden absolute top-full left-0 w-full bg-white shadow-md z-40 py-4 px-6 flex flex-col gap-4 text-sm">
      ${m()?"":`
        <a href="/" class="hover:text-[#5624d0]">Home</a>
        <a href="/about" class="hover:text-[#5624d0]">About Us</a>
        <a href="/resources" class="hover:text-[#5624d0]">Resources</a>
      `}
      <div id="mobile-auth-links">
        ${m()?G(e):h()}
      </div>
    </div>
  `,t.querySelectorAll("a").forEach(l=>{l.addEventListener("click",y)});const o=t.querySelector("#menuToggle"),s=t.querySelector("#menuIcon"),n=t.querySelector("#mobileMenu");o==null||o.addEventListener("click",()=>{const l=!n.classList.contains("hidden");console.log("📱 Menu toggle clicked. Open:",!l),n.classList.toggle("hidden"),s.textContent=l?"☰":"✖"});const r=t.querySelector("#dropdownToggle"),a=t.querySelector("#dropdownMenu");r==null||r.addEventListener("click",()=>{a.classList.toggle("hidden")}),document.addEventListener("click",l=>{t.contains(l.target)||a==null||a.classList.add("hidden")});const d=t.querySelector("#logoutBtn"),i=t.querySelector("#logoutBtnMobile");return[d,i].forEach(l=>{l&&l.addEventListener("click",()=>{console.log("🚪 Logging out user..."),M();const c=t.querySelector("#auth-section"),u=t.querySelector("#mobile-auth-links");c&&(c.innerHTML=g(),f(c)),u&&(u.innerHTML=h(),f(u)),n==null||n.classList.add("hidden"),s.textContent="☰",window.history.pushState({},"","/"),b()})}),t}function y(e){e.preventDefault();const t=e.target.getAttribute("href");console.log("🔗 Navigating to:",t),window.history.pushState({},"",t),window.dispatchEvent(new Event("popstate"))}function g(){return console.log("🔐 Rendering logged-out auth links"),`
    <a href="/login" class="px-4 py-2 border border-[#5624d0] text-[#5624d0] rounded hover:bg-gray-100">Login</a>
    <a href="/signup" class="px-4 py-2 bg-[#5624d0] text-white rounded hover:bg-purple-800">Sign Up</a>
  `}function z(e){const t=(e==null?void 0:e.name)||"User";return console.log("👤 Rendering profile dropdown for:",t),`
    <div class="relative" id="userDropdown">
      <button id="dropdownToggle" class="flex items-center gap-2 px-4 py-2 bg-[#5624d0] text-white rounded">
        👤 ${t}
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div id="dropdownMenu" class="absolute hidden right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
        <a href="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">Profile</a>
        <button id="logoutBtn" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
      </div>
    </div>
  `}function h(){return`
    <a href="/login" class="hover:text-[#5624d0]">Login</a>
    <a href="/signup" class="hover:text-[#5624d0]">Sign Up</a>
  `}function G(e){return`
    <p class="text-sm font-semibold text-[#5624d0]">👤 ${(e==null?void 0:e.name)||"User"}</p>
    <a href="/profile" class="text-sm text-[#5624d0]">Profile</a>
    <button id="logoutBtnMobile" class="text-left text-red-600 hover:underline">Logout</button>
  `}function f(e){e.querySelectorAll("a").forEach(t=>{t.addEventListener("click",y)})}function J(){const e=document.createElement("footer"),t=window.location.pathname;return console.log("📍 Rendering footer for path:",t),t.startsWith("/dashboard")||t.startsWith("/notes")||t.startsWith("/exams")||t.startsWith("/ebooks")?(console.log("🧾 Using minimal footer layout for internal pages"),e.className="bg-gray-900 text-gray-400 text-center py-4 text-sm",e.innerHTML=`
      &copy; 2025 <strong class="text-white">Elimu_Online</strong> — Empowering learners, one file at a time.
    `):(console.log("🖼️ Using full homepage footer layout"),e.className="bg-[#1e1e2f] text-gray-300 pt-12 px-6",e.innerHTML=`
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
            <li><a href="/signup" class="hover:underline">Sign Up</a></li>
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

      <div class="border-t border-gray-700 mt-10 pt-4 pb-6 text-center text-sm text-gray-500">
        &copy; 2025 Elimu_Online — Empowering learners, one file at a time.
      </div>
    `),e}function w(){const e=document.getElementById("app");e.innerHTML="";const t=document.createElement("div");t.className="min-h-screen flex flex-col bg-gray-50";const o=v();t.appendChild(o);const s=window.location.pathname==="/",n=document.createElement("main");n.id="page-content",n.className=s?"flex-grow":"flex-grow mt-[80px] px-4 sm:px-6 md:px-8 py-6",t.appendChild(n);const r=J();t.appendChild(r),e.appendChild(t),b()}window.addEventListener("DOMContentLoaded",()=>{console.log("🚀 App Loaded (DOMContentLoaded)"),window.scrollTo(0,0),w()});window.addEventListener("popstate",()=>{console.log("🔙 SPA Navigation (popstate)"),window.scrollTo(0,0),w()});
