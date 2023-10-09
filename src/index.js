// Your code here
const init = () => {
  // Global variables
  const cardTitle = document.getElementById("card-title");
  const cardImage = document.getElementById("card-image");
  const likeCount = document.getElementById("like-count");
  const commentsList = document.getElementById("comments-list");
  const commentForm = document.getElementById("comment-form");
  const likeButton = document.getElementById("like-button");

  let isImageVisible = true;

  // Function to display data to the page
  function displayData() {
    // Fetch the data from the API
    fetch(`http://localhost:3000/images/1`)
      .then((response) => response.json())
      .then((data) => {
        // Update HTML elements with it
        cardTitle.textContent = data.title;
        cardImage.src = data.image;
        cardImage.alt = data.title;
        likeCount.textContent = `${data.likes} likes`;

        // Update the image card title and image source
      });

    fetch(`http://localhost:3000/comments`)
      .then((response) => response.json())
      .then((data) => {
        // Update the comments list
        commentsList.innerHTML = ""; // Clear existing comments
        data.forEach((comment) => {
          const li = document.createElement("li");
          li.textContent = comment.content;
          commentsList.appendChild(li);
        });
      });
  }

  // Function to update server with new image
  function updateServerWithNewImage(newImageUrl) {
    // Create a PATCH request to update the image on the server
    fetch(`http://localhost:3000/images/1`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: newImageUrl }),
    });
  }

  // Function to handle adding comments
  function addComment(commentContent) {
    // Create a new comment object
    const newComment = {
      imageId: 1, // Replace with the appropriate imageId
      content: commentContent,
    };

    // Make a POST request to the server to save the new comment
    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
  }

  // Event listeners

  // Image toggle event listener
  cardTitle.addEventListener("click", () => {
    if (isImageVisible) {
      cardImage.style.display = "none";
      isImageVisible = false;
    } else {
      cardImage.style.display = "block";
      isImageVisible = true;
    }
  });

  // Like button event listener
  likeButton.addEventListener("click", () => {
    fetch(`http://localhost:3000/images/1`)
      .then((response) => response.json())
      .then((data) => {
        let likes = data.likes;
        likes++; // Increase the likes count

        // Update the like count element with the new value
        likeCount.textContent = `${likes} likes`;

        // Send a PATCH request to update likes on the server
        fetch(`http://localhost:3000/images/1`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: likes }),
        });
      });
  });

  // Delete comments event listener
  commentsList.addEventListener("click", (event) => {
    // Check if the clicked element is an <li> element within the comments list
    if (event.target && event.target.tagName === "LI") {
      // Remove the clicked comment element from the DOM
      const deletedComment = event.target.textContent;

      // Send a DELETE request to the server to delete the comment
      fetch(`http://localhost:3000/comments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: deletedComment }),
      })

      event.target.remove();
    }
  });

  // Random image event listener
  cardImage.addEventListener("click", () => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      .then((data) => {
        const newDogImageUrl = data.message;

        // Replace the current dog image with the new random image
        cardImage.src = newDogImageUrl;
        cardImage.alt = "New random dog image";

        // Update the server with the new image URL
        updateServerWithNewImage(newDogImageUrl);
      });
  });

  // Comment form submit event listener
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const commentInput = document.querySelector("input#comment");
    const commentContent = commentInput.value.trim(); // Get the comment content

    if (commentContent !== "") {
      // Check if the comment content is not empty
      // Add the comment to the comments list on the frontend
      const newCommentElement = document.createElement("li");
      newCommentElement.textContent = commentContent;
      commentsList.appendChild(newCommentElement);

      // Clear the comment input field
      commentInput.value = "";

      // Add the comment to the server
      addComment(commentContent);
    }
  });

  // Initial data display
  displayData();
};

document.addEventListener("DOMContentLoaded", init);
