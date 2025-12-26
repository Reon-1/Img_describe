// Add click listener to "Describe Image" button
document.getElementById("describeBtn").onclick = async () => {
  // Get the first file selected by the user
  const input = document.getElementById("imageInput").files[0];
  if (!input) {
    alert("Please select an image first!");
    return;
  }

  const reader = new FileReader(); // create a FileReader to read the image
  reader.onload = async () => {
    //show image preview
    const previewImg = document.getElementById("previewImg");
    const imagePreview = document.getElementById("imagePreview");
    previewImg.src = reader.result;
    imagePreview.style.display = "block";

    //show loading text
    document.getElementById("description").textContent = "Analyzing Image...";

    // Convert image to base64, remove prefix
    const base64Image = reader.result.split(",")[1];

    // Send POST request to backend
    const response = await fetch("/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Image }),
    });

    // Get the response from server and display
    const data = await response.json();
    document.getElementById("description").textContent = data.description;
  };

  reader.readAsDataURL(input); // start reading the file
};
