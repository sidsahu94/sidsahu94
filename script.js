// const apiKey = "fa0a723aca0e4b59b57c32b84a1d3b28"; // Replace with your NewsAPI key

// let page = 1;
// let country = "in";
// let category = "";
// let query = "";
// let isLoading = false;

// const newsContainer = document.getElementById("newsContainer");
// const loader = document.getElementById("loader");
// const countrySelect = document.getElementById("countrySelect");
// const categorySelect = document.getElementById("categorySelect");
// const searchInput = document.getElementById("searchInput");
// const darkModeToggle = document.getElementById("darkModeToggle");

// async function fetchNews() {
//     if (isLoading) return;
//     isLoading = true;
//     loader.style.display = "block";

//     let url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=12&apiKey=${apiKey}`;
//     if (category) url += `&category=${category}`;
//     if (query) url = `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=12&apiKey=${apiKey}`;

//     const res = await fetch(url);
//     const data = await res.json();
//     loader.style.display = "none";
//     isLoading = false;

//     if (data.articles) {
//         data.articles.forEach(article => {
//             const card = document.createElement("div");
//             card.className = "news-card";
//             card.innerHTML = `
//                 <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="">
//                 <h3>${article.title}</h3>
//                 <p>${article.description || ""}</p>
//                 <a href="${article.url}" target="_blank">Read more</a>
//             `;
//             newsContainer.appendChild(card);
//         });
//     }
// }

// // Event Listeners
// countrySelect.addEventListener("change", () => {
//     country = countrySelect.value;
//     page = 1;
//     newsContainer.innerHTML = "";
//     fetchNews();
// });
// categorySelect.addEventListener("change", () => {
//     category = categorySelect.value;
//     page = 1;
//     newsContainer.innerHTML = "";
//     fetchNews();
// });
// searchInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//         query = searchInput.value.trim();
//         page = 1;
//         newsContainer.innerHTML = "";
//         fetchNews();
//     }
// });
// darkModeToggle.addEventListener("click", () => {
//     document.body.classList.toggle("dark");
// });

// // Infinite Scroll
// window.addEventListener("scroll", () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
//         page++;
//         fetchNews();
//     }
// });

// // Initial Load
// fetchNews();
const apiKey = "fa0a723aca0e4b59b57c32b84a1d3b28"; // Replace with your NewsAPI key

let page = 1;
let country = "in";
let category = "";
let query = "";
let isLoading = false;

const newsContainer = document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const countrySelect = document.getElementById("countrySelect");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");

async function fetchNews() {
    if (isLoading) return;
    isLoading = true;
    loader.style.display = "block";

    let url = "";
    if (query) {
        // Search mode uses everything endpoint, ignoring country/category filters
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=12&apiKey=${apiKey}`;
    } else {
        // Top headlines mode uses country and category filters
        url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=12&apiKey=${apiKey}`;
        if (category) url += `&category=${category}`;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();

        loader.style.display = "none";
        isLoading = false;

        if (data.status !== "ok") {
            alert(`Error fetching news: ${data.message}`);
            return;
        }

        // Clear news container on first page load to avoid duplicates
        if (page === 1) {
            newsContainer.innerHTML = "";
        }

        if (data.articles.length === 0 && page === 1) {
            newsContainer.innerHTML = "<p>No news found.</p>";
            // Remove infinite scroll listener if present
            window.removeEventListener("scroll", handleScroll);
            return;
        }

        // Append news cards
        data.articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "news-card";
            card.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" alt="News Image">
                <h3>${article.title}</h3>
                <p>${article.description || ""}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more</a>
            `;
            newsContainer.appendChild(card);
        });

        // If fewer articles than pageSize, no more pages available
        if (data.articles.length < 12) {
            window.removeEventListener("scroll", handleScroll);
        } else {
            window.addEventListener("scroll", handleScroll);
        }

    } catch (error) {
        loader.style.display = "none";
        isLoading = false;
        alert("Failed to fetch news. Please try again later.");
        console.error(error);
    }
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
        page++;
        fetchNews();
    }
}

// Initialize infinite scroll listener
window.addEventListener("scroll", handleScroll);

// Event listeners for filters and search input
countrySelect.addEventListener("change", () => {
    country = countrySelect.value;
    // Reset category and search when country changes
    category = "";
    categorySelect.value = "";
    query = "";
    searchInput.value = "";
    page = 1;
    newsContainer.innerHTML = "";
    fetchNews();
});

categorySelect.addEventListener("change", () => {
    category = categorySelect.value;
    // Reset search when category changes
    query = "";
    searchInput.value = "";
    page = 1;
    newsContainer.innerHTML = "";
    fetchNews();
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        query = searchInput.value.trim();
        page = 1;
        newsContainer.innerHTML = "";
        fetchNews();
    }
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Initial fetch on page load
fetchNews();
