 // Age Parameters
    let chronologicalAge = 35;
    let biologicalAge = 35;
    let agingChart = null;

    // Initialize with user's chronological age
    function initializeAges() {
        const inputAge = parseInt(document.getElementById('chrono-age-input').value);
        if (inputAge < 18 || inputAge > 120) {
            document.getElementById('age-validation').classList.remove('hidden');
            return;
        }
        document.getElementById('age-validation').classList.add('hidden');
        
        chronologicalAge = inputAge;
        biologicalAge = calculateBaselineBiologicalAge(chronologicalAge);
        updateAllDisplays();
    }

    // Calculate baseline biological age with realistic variation
    function calculateBaselineBiologicalAge(chronoAge) {
        // Base variation (±3 years) plus lifestyle adjustment
        const baseVariation = (Math.random() * 6) - 3;
        
        // Modern populations average 0.5-1.5 years older biologically
        const populationOffset = 0.8 + (Math.random() * 0.7);
        
        return chronoAge + baseVariation + populationOffset;
    }

    // Main calculation function
    function calculateBiologicalAge() {
        if (!chronologicalAge) return;
        
        // Get all current values
        const exercise = parseInt(document.getElementById('exercise-slider').value);
        const sleepQuality = parseInt(document.getElementById('sleep-quality-slider').value);
        const nutrition = parseInt(document.getElementById('nutrition-select').value);
        const stressLevel = document.querySelector('input[name="stress"]:checked').value;
        
        // Supplement flags
        const supplements = {
            nad: document.getElementById('nad-boosters').checked,
            resveratrol: document.getElementById('resveratrol').checked,
            omega3: document.getElementById('omega3').checked,
            vitaminD: document.getElementById('vitamin-d').checked
        };
        
        // Reset to baseline
        biologicalAge = calculateBaselineBiologicalAge(chronologicalAge);
        
        // Calculate impacts (in years)
        const impacts = {
            exercise: calculateExerciseImpact(exercise),
            sleep: calculateSleepImpact(sleepQuality),
            nutrition: calculateNutritionImpact(nutrition),
            stress: calculateStressImpact(stressLevel),
            supplements: calculateSupplementImpact(supplements)
        };
        
        // Apply all impacts
        biologicalAge += impacts.exercise;
        biologicalAge += impacts.sleep;
        biologicalAge += impacts.nutrition;
        biologicalAge += impacts.stress;
        biologicalAge += impacts.supplements;
        
        // Constrain to reasonable biological limits
        biologicalAge = Math.max(chronologicalAge - 15, 
                               Math.min(chronologicalAge + 10, biologicalAge));
        
        updateAllDisplays();
        generateRecommendations(impacts);
    }

    // Individual impact calculations
    function calculateExerciseImpact(hours) {
        // Based on 2021 Mayo Clinic Proceedings study
        if (hours === 0) return 1.5; // Sedentary penalty
        if (hours <= 3) return 0;    // Minimal impact
        if (hours <= 7) return -0.8; // Moderate benefit
        if (hours <= 12) return -1.5; // Optimal benefit
        return -1.2;                 // Diminished returns for extreme athletes
    }

    function calculateSleepImpact(quality) {
        // Based on 2022 Sleep Medicine Reviews meta-analysis
        if (quality <= 3) return 1.8; // Poor sleep
        if (quality <= 6) return 0.5; // Suboptimal
        if (quality <= 8) return -0.3; // Good
        return -0.7;                  // Excellent
    }

    function calculateNutritionImpact(level) {
        // Based on 2023 Nature Aging diet study
        switch(level) {
            case 1: return 1.2;  // Western
            case 2: return 0;    // Balanced
            case 3: return -0.7; // Mediterranean
            case 4: return -1.1; // Anti-inflammatory
            case 5: return -1.6; // Longevity-focused
            default: return 0;
        }
    }

    function calculateStressImpact(level) {
        // Based on 2020 PNAS stress-aging study
        switch(level) {
            case "high": return 1.4;
            case "mod": return 0.3;
            case "low": return -0.5;
            default: return 0;
        }
    }

    function calculateSupplementImpact(supps) {
        // Based on 2023 Aging Cell supplement review
        let total = 0;
        if (supps.nad) total -= 0.4;
        if (supps.resveratrol) total -= 0.3;
        if (supps.omega3) total -= 0.2;
        if (supps.vitaminD) total -= 0.15;
        return Math.max(-1.2, total); // Cap total supplement benefit
    }

    // Update all display elements
    function updateAllDisplays() {
        // Main age display
        document.getElementById('bio-age-result').textContent = biologicalAge.toFixed(1);
        document.getElementById('chrono-age-display').textContent = chronologicalAge;
        
        // Age difference
        const diff = biologicalAge - chronologicalAge;
        const diffElement = document.getElementById('age-diff');
        diffElement.textContent = Math.abs(diff).toFixed(1) + " years " + 
                                 (diff < 0 ? "younger" : "older");
        diffElement.className = diff < 0 ? "font-semibold text-teal-600" : "font-semibold text-amber-600";
        
        // Update chart
        updateAgingChart();
    }

    // Initialize the aging trajectory chart
    function initAgingChart() {
        const ctx = document.getElementById('aging-chart').getContext('2d');
        agingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Current', '1 Year', '3 Years', '5 Years'],
                datasets: [{
                    label: 'Biological Age',
                    data: [biologicalAge, biologicalAge, biologicalAge, biologicalAge],
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: chronologicalAge - 5,
                        max: chronologicalAge + 5
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Update chart with new projections
    function updateAgingChart() {
        if (!agingChart) initAgingChart();
        
        // Calculate projected aging trajectory
        const currentLifestyleFactor = calculateLifestyleFactor();
        const projections = [
            biologicalAge,
            biologicalAge + (1 * currentLifestyleFactor),
            biologicalAge + (3 * currentLifestyleFactor),
            biologicalAge + (5 * currentLifestyleFactor)
        ];
        
        agingChart.data.datasets[0].data = projections;
        agingChart.options.scales.y.min = Math.min(chronologicalAge - 5, biologicalAge - 2);
        agingChart.options.scales.y.max = Math.max(chronologicalAge + 5, biologicalAge + 2);
        agingChart.update();
    }

    // Calculate overall lifestyle impact factor (0.7-1.3)
    function calculateLifestyleFactor() {
        // Normal aging is 1.0
        let factor = 1.0;
        
        // Good factors reduce aging rate
        if (document.getElementById('exercise-slider').value > 5) factor *= 0.9;
        if (document.getElementById('sleep-quality-slider').value > 7) factor *= 0.95;
        if (document.getElementById('nutrition-select').value > 3) factor *= 0.9;
        if (document.querySelector('input[name="stress"]:checked').value === "low") factor *= 0.85;
        
        // Bad factors increase aging rate
        if (document.getElementById('exercise-slider').value < 2) factor *= 1.1;
        if (document.getElementById('sleep-quality-slider').value < 4) factor *= 1.15;
        if (document.getElementById('nutrition-select').value === 1) factor *= 1.1;
        if (document.querySelector('input[name="stress"]:checked').value === "high") factor *= 1.2;
        
        return Math.max(0.7, Math.min(1.3, factor));
    }

    // Generate personalized recommendations
    function generateRecommendations(impacts) {
        const recs = [];
        
        // Exercise recommendation
        if (impacts.exercise >= 0) {
            recs.push("🚴 Increase exercise to 4+ hours/week for anti-aging benefits");
        } else if (impacts.exercise < -1) {
            recs.push("🏆 Excellent activity level - maintain your exercise routine");
        }
        
        // Sleep recommendation
        if (impacts.sleep > 0.5) {
            recs.push("😴 Improve sleep quality - aim for 7-8 hours of quality sleep");
        }
        
        // Nutrition recommendation
        if (impacts.nutrition >= 0.5) {
            recs.push("🥗 Consider adopting a Mediterranean or anti-inflammatory diet");
        }
        
        // Stress recommendation
        if (impacts.stress > 0.8) {
            recs.push("🧘‍♀️ Implement stress reduction techniques like meditation");
        }
        
        // Supplements recommendation
        if (impacts.supplements > -0.3) {
            recs.push("💊 Consider adding NAD+ boosters or Omega-3s to your regimen");
        }
        
        // Display recommendations
        const recsContainer = document.getElementById('recommendations');
        recsContainer.innerHTML = recs.map(r => `<div class="p-2 bg-white rounded shadow-sm">${r}</div>`).join('');
        
        // Add default if no specific recommendations
        if (recs.length === 0) {
            recsContainer.innerHTML = '<div class="p-2 bg-white rounded shadow-sm">✨ Your current lifestyle is supporting healthy aging - keep it up!</div>';
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Sliders
        document.getElementById('exercise-slider').addEventListener('input', function() {
            document.getElementById('exercise-value').textContent = this.value;
            calculateBiologicalAge();
        });
        
        document.getElementById('sleep-quality-slider').addEventListener('input', function() {
            const quality = ["Poor", "Fair", "Good", "Excellent"][Math.floor(this.value / 3)];
            document.getElementById('sleep-quality-value').textContent = quality;
            calculateBiologicalAge();
        });
        
        // Select and radios
        document.getElementById('nutrition-select').addEventListener('change', calculateBiologicalAge);
        document.querySelectorAll('input[name="stress"]').forEach(radio => {
            radio.addEventListener('change', calculateBiologicalAge);
        });
        
        // Checkboxes
        document.querySelectorAll('.supplement-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', calculateBiologicalAge);
        });
    }

    // Initialize everything
    window.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        initializeAges();
        initAgingChart();
    });