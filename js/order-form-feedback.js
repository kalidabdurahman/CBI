function showFormError(message) {
  const currentStep = window.getOrderCurrentStep();
  const errorBox = document.getElementById(`formErrorStep${currentStep + 1}`);
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function clearFormError() {
  const currentStep = window.getOrderCurrentStep();
  const errorBox = document.getElementById(`formErrorStep${currentStep + 1}`);
  if (errorBox) {
    errorBox.textContent = "";
    errorBox.style.display = "none";
  }
}

function showSubmitStatus(message, type = "info") {
  const statusBox = document.getElementById("submitStatusMessage");
  if (!statusBox) return;

  statusBox.textContent = message;
  statusBox.classList.toggle("submit-status-error", type === "error");
  statusBox.style.display = "block";
  statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearSubmitStatus() {
  const statusBox = document.getElementById("submitStatusMessage");
  if (!statusBox) return;

  statusBox.textContent = "";
  statusBox.classList.remove("submit-status-error");
  statusBox.style.display = "none";
}
