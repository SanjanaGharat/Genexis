
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1D4E6B',
                        'primary-light': '#2A6B8F',
                        secondary: '#000000',
                        accent: '#00F5D0',
                        'accent-dark': '#00C4A3',
                        'accent-light': '#00E5FF',
                        'dark-gray': '#333333',
                    },
                    fontFamily: {
                        montserrat: ['Montserrat', 'sans-serif'],
                        orbitron: ['Orbitron', 'sans-serif'],
                    },
                    animation: {
                        fadeIn: 'fadeIn 1s ease',
                        slideUp: 'slideUp 0.5s ease',
                        spin: 'spin 1s linear infinite',
                        spinSlow: 'spin 1.5s linear infinite',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        spin: {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                        },
                    },
                }
            }
        }



    // Camera setup
    const video = document.getElementById('userVideo');
    const canvas = document.getElementById('captureCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const resetBtn = document.getElementById('resetBtn');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const shareResultsBtn = document.getElementById('shareResultsBtn');
    const analysisResults = document.getElementById('analysisResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressMessage = document.getElementById('progressMessage');
    
    // Access camera
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 1280, 
                    height: 720,
                    facingMode: 'user' 
                } 
            });
            video.srcObject = stream;
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access the camera. Please ensure you've granted camera permissions.");
        }
    }
    
    // Update progress text during analysis
    function updateProgress() {
        const messages = [
            "Analyzing 47 epigenetic markers...",
            "Processing DNA methylation patterns...",
            "Assessing skin biomarkers...",
            "Calculating telomere length estimates...",
            "Evaluating oxidative stress levels...",
            "Processing inflammation markers...",
            "Generating personalized recommendations..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            progressMessage.textContent = messages[i];
            i = (i + 1) % messages.length;
        }, 1500);
        
        return interval;
    }
    
    // Capture and analyze
    captureBtn.addEventListener('click', async () => {
        try {
            // Show loading
            loadingIndicator.classList.remove('hidden');
            const progressInterval = updateProgress();
            
            // Capture image
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Simulate analysis delay (in real app, this would be an API call)
            setTimeout(() => {
                // Hide loading
                loadingIndicator.classList.add('hidden');
                clearInterval(progressInterval);
                
                // Show results
                analysisResults.classList.remove('hidden');
                
                // Scroll to results
                analysisResults.scrollIntoView({ behavior: 'smooth' });
                
                // Generate some random variations for demo purposes
                const chronoAge = Math.floor(Math.random() * 20) + 25;
                document.getElementById('actualAge').textContent = chronoAge;
                document.getElementById('actualAgeBig').textContent = chronoAge;
                
                const epiAgeOffset = (Math.random() * 6 - 3).toFixed(1);
                const epiAge = (chronoAge + parseFloat(epiAgeOffset)).toFixed(1);
                document.getElementById('biologicalAge').textContent = epiAge;
                document.getElementById('biologicalAgeBig').textContent = epiAge;
                
                // Update difference indicator
                const ageDifference = document.getElementById('ageDifference');
                if (epiAgeOffset < 0) {
                    ageDifference.textContent = `${Math.abs(epiAgeOffset)} years younger`;
                    ageDifference.className = 'difference text-base mt-2 px-3 py-1 rounded-full inline-block bg-opacity-20 bg-green-500 text-green-500';
                } else if (epiAgeOffset > 0) {
                    ageDifference.textContent = `+${epiAgeOffset} years older`;
                    ageDifference.className = 'difference text-base mt-2 px-3 py-1 rounded-full inline-block bg-opacity-20 bg-red-500 text-red-500';
                } else {
                    ageDifference.textContent = `±0 years`;
                    ageDifference.className = 'difference text-base mt-2 px-3 py-1 rounded-full inline-block bg-opacity-20 bg-gray-500 text-gray-300';
                }
                
                document.getElementById('skinHealthScore').textContent = 
                    `${Math.floor(Math.random() * 30) + 70}/100`;
                
                const reversalPotential = (Math.random() * 5).toFixed(1);
                document.getElementById('reversalPotential').textContent = reversalPotential;
                
                // Update telomere length
                const telomereLength = (6.5 + Math.random() * 1.5).toFixed(1);
                document.getElementById('telomereEstimate').textContent = `${telomereLength} kb`;
                
                // Update oxidative stress
                const oxidativeLevels = ['Low', 'Moderate', 'High'];
                document.getElementById('oxidativeStressLevel').textContent = 
                    oxidativeLevels[Math.floor(Math.random() * oxidativeLevels.length)];
                
                // Update inflammation
                const inflammationLevels = ['Normal', 'Elevated', 'High'];
                document.getElementById('inflammationStatus').textContent = 
                    inflammationLevels[Math.floor(Math.random() * inflammationLevels.length)];
            }, 6000);
        } catch (error) {
            console.error("Error during analysis:", error);
            loadingIndicator.classList.add('hidden');
            alert("Analysis failed. Please try again.");
        }
    });
    
    // Reset
    resetBtn.addEventListener('click', () => {
        analysisResults.classList.add('hidden');
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
        initCamera(); // Reinitialize camera
    });
    
    // Save Plan
    savePlanBtn.addEventListener('click', () => {
        alert("Your longevity plan has been saved to your account!");
    });
    
    // Share Results
    shareResultsBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Epigenetic Age Analysis',
                text: `Check out my epigenetic age results! Chronological age: ${document.getElementById('actualAge').textContent}, Biological age: ${document.getElementById('biologicalAge').textContent}`,
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
                alert("Couldn't share, but you can copy the link manually.");
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const textArea = document.createElement('textarea');
            textArea.value = `My epigenetic age results:\nChronological age: ${document.getElementById('actualAge').textContent}\nBiological age: ${document.getElementById('biologicalAge').textContent}\n\nView more at: ${window.location.href}`;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert("Results copied to clipboard!");
        }
    });
    
    // Initialize camera on load
    window.addEventListener('DOMContentLoaded', initCamera);
