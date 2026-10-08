const API_BASE_URL = "http://localhost:3000";

const form = document.querySelector("#shorten-form");
const urlInput = document.querySelector("#original-url");
const shortenButton = document.querySelector("#shorten-button");
const result = document.querySelector("#result");
const shortUrlLink = document.querySelector("#short-url");
const copyButton = document.querySelector("#copy-button");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFeedback();

  if (!urlInput.reportValidity()) {
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: urlInput.value.trim() }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível encurtar esse link. Tente novamente.");
    }

    const data = await response.json();
    const shortUrl = new URL(
      encodeURIComponent(data.shortUrl),
      `${API_BASE_URL}/`,
    ).toString();

    shortUrlLink.href = shortUrl;
    shortUrlLink.textContent = shortUrl;
    result.hidden = false;
  } catch (error) {
    message.textContent =
      error instanceof TypeError
        ? "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
        : error.message;
    message.hidden = false;
  } finally {
    setLoading(false);
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shortUrlLink.href);
    copyButton.textContent = "Copiado!";
  } catch {
    message.textContent = "Não foi possível copiar o link neste navegador.";
    message.hidden = false;
  }
});

urlInput.addEventListener("input", clearFeedback);

function setLoading(isLoading) {
  shortenButton.disabled = isLoading;
  shortenButton.querySelector("span:first-child").textContent = isLoading
    ? "Encurtando..."
    : "Encurtar link";
}

function clearFeedback() {
  message.hidden = true;
  message.textContent = "";
  result.hidden = true;
  copyButton.textContent = "Copiar link";
}
