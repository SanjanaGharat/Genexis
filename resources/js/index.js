 // Mobile menu toggle
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        menu.classList.toggle('hidden');
        
        // Toggle icon between menu and close
        const svg = this.querySelector('svg');
        if (!expanded) {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        } else {
            svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileButton = document.getElementById('mobile-menu-button');
        
        // Close mobile menu if click is outside
        if (!mobileMenu.contains(e.target) && !mobileButton.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileButton.setAttribute('aria-expanded', 'false');
            mobileButton.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            
            // Also close all mobile dropdowns
            document.querySelectorAll('.mobile-dropdown-content').forEach(content => {
                content.classList.remove('show');
                content.style.maxHeight = '0';
            });
            
            document.querySelectorAll('.mobile-dropdown-toggle').forEach(button => {
                button.setAttribute('aria-expanded', 'false');
                const icon = button.querySelector('svg:last-child');
                icon.style.transform = 'rotate(0deg)';
            });
        }
        
        // Close desktop dropdowns if click is outside
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.classList.add('opacity-0', 'invisible');
            }
        });
    });

    // Mobile dropdown functionality
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to document listener
            
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            
            const dropdown = this.closest('.mobile-dropdown');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            
            if (!expanded) {
                content.classList.add('show');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
                // Wait for transition to complete before removing show class
                setTimeout(() => {
                    content.classList.remove('show');
                }, 300);
            }
            
            // Rotate chevron icon
            const icon = this.querySelector('svg:last-child');
            icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });