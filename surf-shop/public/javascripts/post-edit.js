let postEditForm = document.getElementById("postEditForm");
postEditForm.addEventListener("submit", (e) => {
  let imageUploads = document.getElementById("imageUpload").files.length;
  let existingImgs = document.querySelectorAll(".imageDeleteCheckbox").length;
  let imgDeletion = document.querySelectorAll(
    ".imageDeleteCheckbox:checked"
  ).length;
  let newTotal = existingImgs + imageUploads - imgDeletion;
  if (newTotal > 4) {
    e.preventDefault();
    alert(
      `We can't have more than 4 images for a single person. You need to remove at least ${
        newTotal - 4
      } image${newTotal - 4 > 1 ? "s" : ""}`
    );
  }
});
