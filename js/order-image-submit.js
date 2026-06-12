function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        data: reader.result.split(",")[1],
        name: file.name,
        type: file.type || "image/jpeg"
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function collectImagesFromInputs(selector) {
  const inputs = Array.from(document.querySelectorAll(selector));
  const images = [];

  for (const input of inputs.slice(0, 3)) {
    const file = input.files && input.files[0];
    if (!file) continue;
    images.push(await readFileAsBase64(file));
  }

  return images;
}

async function appendImagesToFormData(formData, imageInputs) {
  for (let i = 0; i < Math.min(3, imageInputs.length); i++) {
    const file = imageInputs[i].files[0];
    if (!file) continue;

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    formData.append(`image${i + 1}`, base64);
    formData.append(`imageName${i + 1}`, file.name);
    formData.append(`imageType${i + 1}`, file.type || "image/jpeg");
  }
}
