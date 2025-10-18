document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('lead-dialog');
    const openBtns = document.querySelectorAll('[id^="open-dialog-btn"]');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('contact-form');

    // Open modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    });

    // Close modal with X button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate form submission (replace with your actual endpoint)
        console.log('Form Data:', data);

        // Show success message
        alert('✓ Success! Check your email for your free trial access.\n\nWelcome to Grow Genius!');
        
        form.reset();
        modal.classList.remove('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});