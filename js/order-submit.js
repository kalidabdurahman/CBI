function appendCartPayloadToFormData(formData, cartItems) {
  formData.append("cartItemsJson", JSON.stringify(window.cartItemJsonForSubmit()));
  formData.append("cartSummary", window.buildCartPlainTextSummary());
  formData.append("cartItemCount", String(cartItems.length));
}

function appendCartItemImagesToFormData(formData, cartItems) {
  cartItems.forEach((item, itemIndex) => {
    (item.images || []).forEach((image, imageIndex) => {
      const itemNumber = itemIndex + 1;
      const imageNumber = imageIndex + 1;

      formData.append(`item${itemNumber}Image${imageNumber}`, image.data);
      formData.append(`item${itemNumber}ImageName${imageNumber}`, image.name);
      formData.append(`item${itemNumber}ImageType${imageNumber}`, image.type || "image/jpeg");
    });
  });
}
