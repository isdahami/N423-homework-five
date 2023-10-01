/*
 * It gets the pageId.html file and then puts the data into the app div
 * pageId - This is the id of the page that you want to change to.
 */
export function changePage(pageId) {
    /* Using the jQuery get method to get the pageId.html file and then it is using the jQuery html
    method to put the data into the app div. */
    $.get(`pages/${pageId}.html`, function(data) {
        // Replace the content of the #app div with the data from the HTML file.
        $("#app").html(data); 
    }).done(function() {
        // Successfully loaded the HTML.
        console.log(`Successfully loaded ${pageId}.html`);
    }).fail(function(textStatus) {
        // Handle errors here.
        console.error(`Error loading ${pageId}.html: ${textStatus}`);
    });
    
};


