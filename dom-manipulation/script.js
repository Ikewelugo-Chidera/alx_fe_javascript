let quotes = [];

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const newQuote = quoteTextInput.value.trim();
  const newCategory = quoteCategoryInput.value.trim();

  if (newQuote !== "" && newCategory !== "") {
    quotes.push({ text: newQuote, category: newCategory });
    saveQuotes();
    populateCategories();
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

document.addEventListener("DOMContentLoaded", function () {
    loadQuotes();
    createAddQuoteForm();
    populateCategories();

  document.getElementById("newQuote").addEventListener("click", filterQuotes);

  document.getElementById("addQuoteBtn").addEventListener("click",addQuote);

  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

  setInterval(syncWithServer, 10000);
});
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear existing options except 'All'
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categorySelect.value = savedFilter;
    filterQuotes(); // Automatically filter on load
  }
}
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10");
    const serverQuotes = await response.json();

    const formattedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));

    return formattedQuotes;
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    return [];
  }
}
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  let newQuotesAdded = 0;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      newQuotesAdded++;
    }
  });

  if (newQuotesAdded > 0) {
    saveQuotes();
    populateCategories();
    notifyUser(${newQuotesAdded} new quote(s) synced from server.);
  }
}
function notifyUser(message) {
  const existingNotice = document.getElementById("syncNotice");
  if (existingNotice) existingNotice.remove();

  const notice = document.createElement("div");
  notice.id = "syncNotice";
  notice.textContent = message;
  notice.style.background = "#dff0d8";
  notice.style.padding = "10px";
  notice.style.marginTop = "10px";
  notice.style.border = "1px solid #3c763d";
  notice.style.color = "#3c763d";

  document.body.insertBefore(notice, document.body.firstChild);

  // Remove after 5 seconds
  setTimeout(() => {
    notice.remove();
  }, 5000);
}
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    });

    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (err) {
    console.error("Failed to post quote:", err);
  }
}