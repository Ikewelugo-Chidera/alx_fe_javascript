let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

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
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);

  createAddQuoteForm();
});