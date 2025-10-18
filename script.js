document.addEventListener('DOMContentLoaded', function() {
    const openDialogBtn = document.getElementById('open-dialog-btn');
    const leadDialog = document.getElementById('lead-dialog');
    const closeBtn = document.querySelector('.close-btn');
    const contactForm = document.getElementById('contact-form');

    // --- Modal Control ---

    // Function to open the dialog
    openDialogBtn.addEventListener('click', function() {
        // Set display to 'flex' to make the modal visible and centered
        leadDialog.style.display = 'flex'; 
    });

    // Function to close the dialog using the X button
    closeBtn.addEventListener('click', function() {
        leadDialog.style.display = 'none';
    });

    // Close the dialog if user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === leadDialog) {
            leadDialog.style.display = 'none';
        }
    });

    // --- Form Submission Handling ---
    
    // IMPORTANT: This uses the Fetch API for a smooth submission.
    // Ensure your form's 'action' attribute is set correctly for Formspree or Google Forms.
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop the browser from doing a default page redirect

        const form = event.target;
        const formData = new FormData(form);
        const formUrl = form.action;

        // Check if the form action URL is the placeholder
        if (formUrl.includes('YOUR_FORMSPREE_OR_GOOGLE_FORMS_ENDPOINT')) {
            alert('🚨 Submission Failed: Please replace the placeholder URL in index.html with your actual Formspree or Google Form endpoint.');
            return;
        }

        try {
            const response = await fetch(formUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    // This 'Accept' header is often required by services like Formspree
                    'Accept': 'application/json' 
                }
            });

            if (response.ok) {
                alert('Success! Thank you for registering. Your free tip will be sent to your number/email shortly.');
                form.reset(); // Clear the form fields
                leadDialog.style.display = 'none'; // Close the dialog
            } else {
                // Handle non-200 responses (e.g., validation errors from the form service)
                alert('Submission Error: There was an issue with your data. Please check your details and try again.');
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('A network error occurred. Please check your connection and try again.');
        }
    });
});