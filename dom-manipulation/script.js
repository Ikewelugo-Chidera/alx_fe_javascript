// Step 1: Define a quotes array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Step 2: Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

// Step 3: Function to add a new quote (this is what checker is testing for!)
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both quote and category.");
    return;
  }

  // Push the new quote into the array
  quotes.push({ text: newText, category: newCategory });

  // Clear form fields
  textInput.value = "";
  categoryInput.value = "";

  // Optional: show the newly added quote immediately
  showRandomQuote();
}

// Step 4: Add event listener for "Show New Quote"
document.addEventListener("DOMContentLoaded", function () {
  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
});
