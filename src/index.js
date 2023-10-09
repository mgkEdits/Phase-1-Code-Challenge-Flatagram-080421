// write your code here
const init =() =>{
    // global variables
    const cardTitle = document.getElementById("card-title");
    const cardImage = document.getElementById("card-image");
    const likeCount = document.getElementById("like-count");
    const commentsList = document.getElementById("comments-list");
    const commentForm = document.getElementById('comment-form');
    const likeButton = document.getElementById('like-button');

    let isImageVisible = true;


    // functions
    displayData()

    //function to display data to the page
    function displayData() {

        // Fetch the data from the API
        fetch(`http://localhost:3000/images/1`)
        .then(response => response.json())
        .then(data => {

        //  update HTML elements with it
        cardTitle.textContent = data.title;
        cardImage.src = data.image;
        cardImage.alt = data.title;
        likeCount.textContent = `${data.likes} likes`;

        // Update the image card title and image source
        })

        fetch(`http://localhost:3000/comments`)
        .then(response => response.json())
        .then(data => {
        // Update the comments list
        commentsList.innerHTML = ''; // Clear existing comments
        data.comments.forEach(comment => {
           const li = document.createElement('li');
           li.textContent = comment.content;
           commentsList.appendChild(li);
        });

      })
    }


    //image toogle event listener
    cardTitle.addEventListener("click", () =>  {
        if (isImageVisible) {
          cardImage.style.display = "none";
          isImageVisible = false;
        } else {
          cardImage.style.display = "block";
          isImageVisible = true;
        }
    });

   
    // Add a click event listener to the like button
    likeButton.addEventListener('click', () => {
      fetch(`http://localhost:3000/images/1`)
        .then(response => response.json())
        .then(data => {
        let likes =data.likes;
        likeCount.textContent = `${likes} likes`;

        // Increase the likes count
        likes++;

        // Update the like count element with the new value
        likeCount.textContent = `${likes} likes`;

        // Send a PATCH request to update likes on the server
        fetch(`http://localhost:3000/characters/images/1`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ likes: likes }),
      });
    })

    //event listener to delete comments
    commentsList.addEventListener("click", (event) =>{
        // Check if the clicked element is an <li> element within the comments list
        if (event.target && event.target.tagName === "LI") {
          // Remove the clicked comment element from the DOM
          event.target.remove();
          
        }
      });

    //random image event listener
    cardImage.addEventListener('click', () =>{
        fetch('https://dog.ceo/api/breeds/image/random')
        .then((response) => response.json())
        .then((data) => {
           const newDogImageUrl = data.message;

           // Replace the current dog image with the new random image
          cardImage.src = newDogImageUrl;
          cardImage.alt = 'New random dog image';

          // Update the server with the new image URL
         updateServerWithNewImage(newDogImageUrl);
       })
    })
    

    //function to update server
    function updateServerWithNewImage(newImageUrl) {
        // Create a PATCH request to update the image on the server
       fetch(`http://localhost:3000/images/1`, {
          method: 'PATCH',
          headers: {
             'Content-Type': 'application/json',
            },
          body: JSON.stringify({image: newImageUrl, }),
        })
    }

    //event listener for adding comments
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const commentInput = document.querySelector('input#comment');
        const commentContent = commentInput.value.trim(); // Get the comment content
        
        // Create a new comment object
        const newComment = {
            imageId: 1, // Replace with the appropriate imageId
            content: commentContent,
        };
        

        // Make a POST request to the server to save the new comment
        fetch('http://localhost:3000/comments', {

            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        })
        .then((response) => response.json())
        .then((data) => {
          // Once the comment is saved to the server, add it to the comments list
          const newCommentElement = document.createElement('li');
          newCommentElement.textContent = data.content;
          commentsList.appendChild(newCommentElement);

          // Clear the comment input field
          commentInput.value = '';
        })

    })
    
 

}

document.addEventListener("DOMContentLoaded", init) ;