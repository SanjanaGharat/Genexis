        // FAQ accordion functionality
        document.addEventListener('DOMContentLoaded', function() {
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const faqItem = question.closest('.faq-item');
                    const answer = faqItem.querySelector('.faq-answer');
                    const icon = faqItem.querySelector('.faq-icon');
                    
                    // Toggle active class on item
                    faqItem.classList.toggle('active-faq');
                    faqItem.classList.toggle('bg-gray-700');
                    faqItem.classList.toggle('bg-gray-800');
                    
                    // Toggle answer visibility
                    answer.classList.toggle('open');
                    
                    // Toggle icon
                    if (answer.classList.contains('open')) {
                        icon.classList.remove('text-gray-400');
                        icon.classList.add('text-[#00F5D0]');
                        icon.innerHTML = '<path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />';
                    } else {
                        icon.classList.add('text-gray-400');
                        icon.classList.remove('text-[#00F5D0]');
                        icon.innerHTML = '<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />';
                    }
                    
                    // Close other open FAQs in the same section
                    const parentSection = faqItem.closest('.bg-gray-900');
                    parentSection.querySelectorAll('.faq-item').forEach(item => {
                        if (item !== faqItem) {
                            item.classList.remove('active-faq', 'bg-gray-700');
                            item.classList.add('bg-gray-800');
                            const otherAnswer = item.querySelector('.faq-answer');
                            const otherIcon = item.querySelector('.faq-icon');
                            otherAnswer.classList.remove('open');
                            otherIcon.classList.add('text-gray-400');
                            otherIcon.classList.remove('text-[#00F5D0]');
                            otherIcon.innerHTML = '<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />';
                        }
                    });
                });
            });
        });
