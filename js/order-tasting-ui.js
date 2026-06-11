function renderRegularFillingOptions() {
  const container = document.getElementById("regularFillingsContainer");
  if (!container || container.children.length > 0) return;

  container.innerHTML = fillingOptions.map(filling => `
    <label class="filling-option">
      <input type="checkbox" name="regularBoxSideFillings" value="${filling}">
      <span>${filling}</span>
    </label>
  `).join("");

  container.querySelectorAll("input[name='regularBoxSideFillings']").forEach(box => {
    box.addEventListener("change", function () {
      const checked = document.querySelectorAll("input[name='regularBoxSideFillings']:checked");
      if (checked.length > 2) {
        this.checked = false;
        showFormError("⚠️ Regular tasting boxes can have up to 2 side fillings.");
        return;
      }
      clearFormError();
    });
  });
}

function renderDeluxeSliceCards() {
  const container = document.getElementById("deluxeSlicesContainer");
  if (!container) return;

  if (!container.children.length) {
    let html = "";

    for (let i = 1; i <= 6; i++) {
      html += `
        <div class="slice-card">
          <h4>Slice ${i}</h4>

          <div class="form-group">
            <label for="slice${i}Flavor">Flavor <span class="required-asterisk">*</span></label>
            <select id="slice${i}Flavor" name="slice${i}Flavor" required></select>
          </div>

          <div class="form-group">
            <label for="slice${i}Frosting">Frosting <span class="required-asterisk">*</span></label>
            <select id="slice${i}Frosting" name="slice${i}Frosting" required></select>
          </div>

          <div class="form-group">
            <label for="slice${i}Filling">Filling (optional)</label>
            <select id="slice${i}Filling" name="slice${i}Filling"></select>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  for (let i = 1; i <= 6; i++) {
    populateSelect(
      document.getElementById(`slice${i}Flavor`),
      flavorOptions,
      "Select a flavor"
    );

    populateSelect(
      document.getElementById(`slice${i}Frosting`),
      tastingFrostingOptions,
      "Select a frosting"
    );

    populateSelect(
      document.getElementById(`slice${i}Filling`),
      fillingOptions,
      "Select a filling (optional)",
      true
    );
  }

  container.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", clearFormError);
  });
}

function toggleTastingTypePanels() {
  const tastingBoxType = document.getElementById("tastingBoxType").value;
  const regularPanel = document.getElementById("regularTastingFields");
  const deluxePanel = document.getElementById("deluxeTastingFields");

  if (tastingBoxType === "regular") {
    renderRegularFillingOptions();
  }

  if (tastingBoxType === "deluxe") {
    renderDeluxeSliceCards();
  }

  setSectionEnabled(regularPanel, tastingBoxType === "regular");
  setSectionEnabled(deluxePanel, tastingBoxType === "deluxe");

  renderTastingBoxPriceInfo();

  renderContactStepEstimate();
}
