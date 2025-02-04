document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        navbarToggler: document.querySelector(".navbar-toggler"),
        searchIcons: {
            mobile: document.getElementById("searchIconMobile"),
            desktop: document.getElementById("searchIconDesktop")
        },
        searchPanel: document.getElementById("searchPanel"),
        searchInput: document.querySelector(".search-input"),
        offcanvas: document.querySelector(".offcanvas")
    };

    // Combine search panel handlers
    const handleSearchPanel = (e, action) => {
        e?.stopPropagation();
        if (action === 'toggle') {
            elements.searchPanel.classList.toggle("active");
            elements.searchPanel.classList.contains("active") && elements.searchInput.focus();
        } else if (action === 'close') {
            elements.searchPanel.classList.remove("active");
        }
    };

    // Event listeners for search
    [elements.searchIcons.mobile, elements.searchIcons.desktop].forEach(icon => 
        icon.addEventListener("click", e => handleSearchPanel(e, 'toggle'))
    );

    // Global click handler
    document.addEventListener("click", (event) => {
        const isOutsideSearch = !event.target.closest(".search-panel") && 
                               !event.target.closest(".search-btn");
        const isOutsideNav = !event.target.closest(".navbar-toggler") && 
                            !event.target.closest(".offcanvas");

        if (isOutsideSearch) handleSearchPanel(null, 'close');
        if (isOutsideNav && elements.offcanvas.classList.contains("show")) {
            elements.navbarToggler.classList.remove("active");
            elements.offcanvas.classList.remove("show");
        }
    });

    // Preserve search panel clicks
    elements.searchPanel.addEventListener("click", e => e.stopPropagation());

    // Navbar toggle
    elements.navbarToggler.addEventListener("click", () => {
        elements.navbarToggler.classList.toggle("active");
        elements.offcanvas.classList.toggle("show");
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity()) {
                // Here you would typically send the form data to a server
                confirmationModal.show();
                this.reset();
                this.classList.remove('was-validated');
            }
            this.classList.add('was-validated');
        });
    }

    // Form handling
    const confirmationModalElement = document.getElementById('confirmationModal');

    if (confirmationModalElement) {
        confirmationModalElement.addEventListener('hidden.bs.modal', function () {
            if (contactForm) {
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }
        });
    }

    // Gallery filtering
    const filterButtons = document.querySelectorAll('.dropdown-item');
    const dropdownButton = document.querySelector('.dropdown-toggle');
    const galleryLists = document.querySelectorAll('.list');

    if (filterButtons.length && dropdownButton) {
        // Set initial state
        dropdownButton.textContent = 'Paintings';

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
                
                // Update button text
                dropdownButton.textContent = capitalizedCategory;
                
                // Update visibility
                galleryLists.forEach(list => {
                    list.classList.toggle('active', list.classList.contains(category));
                });
            });
        });
    }

    // Gallery scroll spy
    const sections = document.querySelectorAll('.gallery-category');
    const navLinks = document.querySelectorAll('.gallery-nav .nav-link');
    
    if (sections.length && navLinks.length) {
        const options = {
            root: null,
            rootMargin: '-20% 0px -79% 0px',
            threshold: [0, 0.1, 1]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));

        // Smooth scroll for navigation links
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Gallery navigation
    if (sections.length && navLinks.length) {
        // Set initial active state
        navLinks[0].classList.add('active');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
});