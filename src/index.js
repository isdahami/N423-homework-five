import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDoc, collection, addDoc, getDocs, doc, where, query } from 'firebase/firestore';
import * as MODEL from "./model.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnd3PDyN-O4s6V069iXcuRUOM3bsZneuA",
    authDomain: "n423-data-ike.firebaseapp.com",
    projectId: "n423-data-ike",
    storageBucket: "n423-data-ike.appspot.com",
    messagingSenderId: "853532599706",
    appId: "1:853532599706:web:4b712f2fa0426920f60623",
    measurementId: "G-XBZ6L53PLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getAllAlbums() {
    // Retrieve all documents from the "Albums" collection in Firestore
    const querySnapshot = await getDocs(collection(db, "Albums"));
    // Log a message indicating that data has been fetched from Firestore
    console.log("Fetched data from Firestore:");
    // Iterate over each document in the query snapshot
    querySnapshot.forEach((doc) => {
        // Create a reference to the container element with the ID "content-albums"
        const albumsContainer = document.getElementById("content-albums");
        // Create a new div element to represent an album
        const albumDiv = document.createElement("div");
        // Add a CSS class to the album div
        albumDiv.classList.add("albumDiv");

        // Create an img element for displaying the album cover image
        const imageElement = document.createElement("img");
        // Set the src attribute of the image element to the album's photo URL
        imageElement.src = doc.data().albumPhoto;
        // Set an alt attribute for accessibility (album cover description)
        imageElement.alt = "Album Cover";
        
        // Append the image element to the album div
        albumDiv.appendChild(imageElement);

        // Add other album details (album name, artist name, genre)
        albumDiv.innerHTML += `
            <span class="albumTxt">${doc.data().albumName}</span>
            <span class="albumTxt">${doc.data().artistName}</span>
            <span class="albumTxt">${doc.data().genre}</span>
            <button class="shopBtn">Buy Now</button>
        `;

        // Append the album div to the albums container, displaying it on the page
        albumsContainer.appendChild(albumDiv);
    });
}

    
async function queryAlbums() {
    // Get the selected genre from the dropdown
    let searchGenre = $('#genreSelect').val();
    // Log the selected genre and the dropdown element for debugging
    console.log("Dropdown element:", $('#genreSelect'));
    console.log("Selected Genre:", searchGenre);

    // Get a reference to the albums container
    const albumsContainer = document.getElementById("content-albums");
    // Clear existing album elements in the container
    albumsContainer.innerHTML = "";

    if (searchGenre) {
        // Create a Firestore query to filter albums by the selected genre
        const q = query(collection(db, "Albums"), where("genre", "==", searchGenre));
        // Log the Firestore query for debugging
        console.log("Firestore Query:", q);
        
        try {
            // Execute the Firestore query and get a query snapshot
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                // If matching albums are found, iterate over the query snapshot
                querySnapshot.forEach((doc) => {
                    // Create an album div element and apply styling
                    const albumDiv = document.createElement("div");
                    albumDiv.classList.add("albumDiv");

                    // Create an image element for the album cover
                    const imageElement = document.createElement("img");
                    imageElement.src = doc.data().albumPhoto;
                    imageElement.alt = "Album Cover";

                    // Append the image element to the album div
                    albumDiv.appendChild(imageElement);

                    // Add album details to the album div
                    albumDiv.innerHTML += `
                        <span class="albumTxt">${doc.data().albumName}</span>
                        <span class="albumTxt">${doc.data().artistName}</span>
                        <span class="albumTxt">${doc.data().genre}</span>
                        <button class="shopBtn">Buy Now</button>
                    `;

                    // Append the album div to the albums container
                    albumsContainer.appendChild(albumDiv);
                });
            } else {
                // If no matching albums are found, display all albums
                getAllAlbums();
                console.log('No matching albums found');
            }
        } catch (error) {
            // Handle any errors that occur during the Firestore query
            console.error("Error querying Firestore:", error);
        }
    }
}


function route() {
    /* Getting the hash tag from the URL. */
    let hashTag = window.location.hash;
    /* Removing the hash tag from the URL. */
    let pageID = hashTag.replace("#", "");

    /* This is a conditional statement. If the pageID is empty, then the page will be changed to the home page. If the pageID is not empty, then the page will be changed to the pageID. */
    if(pageID == "") {
        MODEL.changePage("home");
        
    } else {
        MODEL.changePage(pageID);
        getAllAlbums(); // Wait for data to be fetched
    }     
}

function initListeners() {
    /* Listening for a change in the hash tag. */
    $(window).on("hashchange", route);
    
    /* Calling the route function. */
    route();
    
    // // Initial query for all albums
    // getAllAlbums();
    $(document).on('change', '#genreSelect', queryAlbums);
}

$(document).ready(function () {
    initListeners();  
    getAllAlbums();
});