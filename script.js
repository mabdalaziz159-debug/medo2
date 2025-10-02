// -------------------------------------------
// جلب نكتة عشوائية عند الضغط على الزر
// -------------------------------------------
document.getElementById("getJokeBtn")?.addEventListener("click", async () => {
  const jokeDisplay = document.getElementById("jokeDisplay");
  if (!jokeDisplay) return;

  try {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any");
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    const joke = data.type === "single" ? data.joke : `${data.setup} - ${data.delivery}`;
    jokeDisplay.textContent = joke;
  } catch (error) {
    jokeDisplay.textContent = "Oops! Couldn't fetch a joke.";
    console.error("Error fetching joke:", error);
  }
});

// -------------------------------------------
// Fetch بيانات عامة
// -------------------------------------------
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error.message);
    throw error;
  }
}

// -------------------------------------------
// تحديث واجهة المستخدم
// -------------------------------------------
function updateUI(data) {
  try {
    const container = document.getElementById("dataContainer");
    if (!container) throw new Error("Container not found");
    container.textContent = data.message;
  } catch (error) {
    console.error("UI update failed:", error.message);
  }
}

// -------------------------------------------
// زر submit لأي صفحة
// -------------------------------------------
document.getElementById("submitBtn")?.addEventListener("click", async () => {
  try {
    const result = await fetchData();
    updateUI(result);
  } catch {
    alert("Something went wrong. Please try again.");
  }
});

// -------------------------------------------
// إدارة الأخطاء العامة
// -------------------------------------------
window.addEventListener("error", e => console.error("Global error caught:", e.message));
window.addEventListener("unhandledrejection", e => console.error("Unhandled promise rejection:", e.reason));

// -------------------------------------------
// إدارة النكت في صفحات متعددة
// -------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const jokeList = document.getElementById("jokeList");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  if (!jokeList || !searchForm || !searchInput) return;

  // جلب النكت
  async function fetchJokes() {
    try {
      const res = await fetch("https://v2.jokeapi.dev/joke/Any?amount=10");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const jokes = data.jokes || [data];
      renderJokes(jokes);
    } catch (error) {
      console.error("Error fetching jokes:", error);
      jokeList.innerHTML = "<p>Failed to load jokes.</p>";
    }
  }

  // عرض النكت
  function renderJokes(jokes) {
    jokeList.innerHTML = "";
    jokes.forEach(joke => {
      const card = document.createElement("div");
      card.className = "joke-card";
      card.setAttribute("tabindex", "0");
      card.innerHTML = `<p>${joke.setup || joke.joke}</p>`;
      jokeList.appendChild(card);
    });
  }

  // التعامل مع الضغط على بطاقة النكتة
  jokeList.addEventListener("click", e => {
    const card = e.target.closest(".joke-card");
    if (card) alert("You clicked a joke!");
  });

  // الضغط على Enter للبطاقة للوصولية
  jokeList.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.classList.contains("joke-card")) {
      alert("You pressed Enter on a joke!");
    }
  });

  // البحث عن النكت
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    filterJokes(searchInput.value);
  });

  searchInput.addEventListener("input", () => filterJokes(searchInput.value));

  function filterJokes(query) {
    const cards = document.querySelectorAll(".joke-card");
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(query.toLowerCase()) ? "block" : "none";
    });
  }

  // تأثير الانيميشن عند التمرير
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".animate-on-scroll").forEach(section => observer.observe(section));

  // بدء تحميل النكت
  fetchJokes();
});
