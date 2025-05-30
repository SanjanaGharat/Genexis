
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1D4E6B',
                        'primary-light': '#00F5D0',
                        accent: '#00E5FF',
                    }
                }
            }
        }
        // Sample data for the dashboard
        const dashboardData = {
            interventions: [
                {
                    id: 1,
                    title: "Metabolic Optimization",
                    match: 83,
                    impact: "high",
                    impactColor: "accent",
                    actions: [
                        "Time-restricted eating (14:10 window)",
                        "Berberine supplementation (500mg 2x/day)",
                        "High-intensity interval training 3x/week"
                    ],
                    expectedImpact: "↓1.2 biological years in 6 months"
                },
                {
                    id: 2,
                    title: "Inflammation Reduction",
                    match: 76,
                    impact: "medium",
                    impactColor: "primary-light",
                    actions: [
                        "Curcumin + piperine (1g/day)",
                        "Omega-3 supplementation (2g EPA/DHA)",
                        "Sauna therapy 4x/week"
                    ],
                    expectedImpact: "↓0.8 biological years in 9 months"
                },
                {
                    id: 3,
                    title: "Mitochondrial Support",
                    match: 68,
                    impact: "low",
                    impactColor: "white",
                    actions: [
                        "NAD+ booster (NR 300mg/day)",
                        "Cold exposure therapy",
                        "PQQ supplementation (20mg/day)"
                    ],
                    expectedImpact: "↓0.4 biological years in 12 months"
                }
            ],
            biomarkers: [
                {
                    name: "hs-CRP",
                    current: "3.2 mg/L",
                    month3: "2.4 mg/L",
                    month6: "1.8 mg/L",
                    month12: "1.2 mg/L",
                    confidence: 82
                },
                {
                    name: "Fasting Glucose",
                    current: "102 mg/dL",
                    month3: "98 mg/dL",
                    month6: "92 mg/dL",
                    month12: "88 mg/dL",
                    confidence: 76
                },
                {
                    name: "Telomere Length",
                    current: "6.8 kb",
                    month3: "6.9 kb",
                    month6: "7.1 kb",
                    month12: "7.3 kb",
                    confidence: 65
                },
                {
                    name: "HDL Cholesterol",
                    current: "42 mg/dL",
                    month3: "47 mg/dL",
                    month6: "52 mg/dL",
                    month12: "58 mg/dL",
                    confidence: 71
                }
            ],
            impactData: {
                current: [42, 43.4, 44.8, 46.2, 47.6, 50.4, 53.2],
                withInterventions: [42, 41.5, 41.0, 40.6, 40.2, 39.6, 39.2]
            },
            metrics: {
                currentTrajectory: "+1.4y/year",
                interventionTrajectory: "-0.8y/year",
                interventionBarWidth: 42,
                currentAge: 61.3,
                projectedAge: 54.2,
                ageDifference: "+7.1 years"
            }
        };

        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadInterventions();
            loadBiomarkers();
            initImpactChart();
            updateMetrics();
            
            // Set up event listeners
            document.getElementById('runAnalysisBtn').addEventListener('click', runAnalysis);
            document.getElementById('intensitySelect').addEventListener('change', updateParameters);
            document.getElementById('focusSelect').addEventListener('change', updateParameters);
            document.getElementById('excludePharma').addEventListener('change', updateParameters);
            document.getElementById('excludeIV').addEventListener('change', updateParameters);
            document.getElementById('excludeDiet').addEventListener('change', updateParameters);
        });

        // Load interventions into the DOM
        function loadInterventions() {
            const container = document.getElementById('interventionsContainer');
            container.innerHTML = '';
            
            dashboardData.interventions.forEach(intervention => {
                const impactClass = {
                    high: 'HIGH IMPACT',
                    medium: 'MEDIUM IMPACT',
                    low: 'LOW IMPACT'
                };
                
                const impactBg = {
                    high: 'bg-accent',
                    medium: 'bg-primary-light',
                    low: 'bg-white'
                };
                
                const interventionEl = document.createElement('div');
                interventionEl.className = `bg-primary bg-opacity-30 p-4 rounded-lg border-l-4 border-${intervention.impactColor}`;
                interventionEl.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-bold text-${intervention.impactColor} mb-1">${intervention.title}</h3>
                            <p class="text-sm text-primary-light">${intervention.match}% match to your biomarker profile</p>
                        </div>
                        <span class="${impactBg[intervention.impact]} text-black px-2 py-1 rounded text-xs font-bold">${impactClass[intervention.impact]}</span>
                    </div>
                    <div class="mt-3">
                        <p class="text-sm mb-2">Recommended actions:</p>
                        <ul class="text-xs space-y-1">
                            ${intervention.actions.map(action => `
                                <li class="flex items-center">
                                    <span class="w-2 h-2 bg-${intervention.impactColor} rounded-full mr-2"></span>
                                    ${action}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="mt-3 flex justify-between items-center">
                        <div class="text-xs">
                            <span class="text-primary-light">Expected impact:</span>
                            <span class="ml-2 text-${intervention.impactColor}">${intervention.expectedImpact}</span>
                        </div>
                        <button class="bg-${intervention.impactColor} text-black px-3 py-1 rounded text-xs font-bold hover:bg-opacity-80 transition view-protocol" data-id="${intervention.id}">
                            View Protocol
                        </button>
                    </div>
                `;
                container.appendChild(interventionEl);
            });
            
            // Add event listeners to protocol buttons
            document.querySelectorAll('.view-protocol').forEach(button => {
                button.addEventListener('click', function() {
                    const interventionId = this.getAttribute('data-id');
                    viewProtocol(interventionId);
                });
            });
        }

        // Load biomarkers into the table
        function loadBiomarkers() {
            const tbody = document.querySelector('#biomarkersTable tbody');
            tbody.innerHTML = '';
            
            dashboardData.biomarkers.forEach(biomarker => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-3">${biomarker.name}</td>
                    <td class="font-bold">${biomarker.current}</td>
                    <td class="text-primary-light">${biomarker.month3}</td>
                    <td class="text-accent">${biomarker.month6}</td>
                    <td class="text-accent">${biomarker.month12}</td>
                    <td>
                        <div class="w-full bg-primary h-1 rounded-full">
                            <div class="bg-accent h-1 rounded-full" style="width: ${biomarker.confidence}%"></div>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Initialize the impact chart
        let impactChart;
        function initImpactChart() {
            const impactCtx = document.getElementById('impactChart').getContext('2d');
            impactChart = new Chart(impactCtx, {
                type: 'line',
                data: {
                    labels: ['Now', '3M', '6M', '9M', '12M', '18M', '24M'],
                    datasets: [
                        {
                            label: 'Current Trajectory',
                            data: dashboardData.impactData.current,
                            borderColor: '#FFFFFF',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0.3
                        },
                        {
                            label: 'With Interventions',
                            data: dashboardData.impactData.withInterventions,
                            borderColor: '#00E5FF',
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(29, 78, 107, 0.3)'
                            },
                            ticks: {
                                color: '#00F5D0',
                                callback: function(value) {
                                    return value + 'y';
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(29, 78, 107, 0.3)'
                            },
                            ticks: {
                                color: '#00F5D0'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#00F5D0'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + ' years';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Update metrics display
        function updateMetrics() {
            document.getElementById('currentTrajectory').textContent = dashboardData.metrics.currentTrajectory;
            document.getElementById('interventionTrajectory').textContent = dashboardData.metrics.interventionTrajectory;
            document.getElementById('interventionBar').style.width = dashboardData.metrics.interventionBarWidth + '%';
            document.getElementById('currentAge').textContent = dashboardData.metrics.currentAge;
            document.getElementById('projectedAge').textContent = dashboardData.metrics.projectedAge;
            document.getElementById('ageDifference').textContent = dashboardData.metrics.ageDifference;
        }

        // View protocol function
        function viewProtocol(interventionId) {
            const intervention = dashboardData.interventions.find(i => i.id == interventionId);
            if (intervention) {
                alert(`Viewing protocol for: ${intervention.title}\n\nRecommended Actions:\n- ${intervention.actions.join('\n- ')}\n\nExpected Impact: ${intervention.expectedImpact}`);
            }
        }

        // Run AI analysis
        function runAnalysis() {
            const intensity = document.getElementById('intensitySelect').value;
            const focus = document.getElementById('focusSelect').value;
            const excludePharma = document.getElementById('excludePharma').checked;
            const excludeIV = document.getElementById('excludeIV').checked;
            const excludeDiet = document.getElementById('excludeDiet').checked;
            
            // Show loading state
            const btn = document.getElementById('runAnalysisBtn');
            btn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
            `;
            btn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Update last analysis time
                const now = new Date();
                document.getElementById('lastAnalysis').textContent = `Last analysis: ${now.toLocaleString()}`;
                
                // Generate new recommendations based on parameters
                generateNewRecommendations(intensity, focus, excludePharma, excludeIV, excludeDiet);
                
                // Update button state
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                    </svg>
                    Run AI Analysis
                `;
                btn.disabled = false;
                
                // Show success message
                alert('Analysis complete! New recommendations have been generated based on your parameters.');
            }, 2000);
        }

        // Generate new recommendations based on user parameters
        function generateNewRecommendations(intensity, focus, excludePharma, excludeIV, excludeDiet) {
            // In a real app, this would call an API to get new data
            // For demo purposes, we'll just modify the existing data slightly
            
            // Update model confidence with a random value between 85-95%
            const newConfidence = Math.floor(Math.random() * 10) + 85;
            document.getElementById('modelConfidence').textContent = `Model confidence: ${newConfidence}%`;
            
            // Modify interventions based on focus area
            dashboardData.interventions.forEach(intervention => {
                if (intervention.title.toLowerCase().includes(focus)) {
                    intervention.match = Math.min(100, intervention.match + 5);
                } else {
                    intervention.match = Math.max(50, intervention.match - 3);
                }
                
                // Adjust based on intensity
                if (intensity === 'high') {
                    intervention.expectedImpact = intervention.expectedImpact.replace(/\d+\.\d+/, 
                        (parseFloat(intervention.expectedImpact.match(/\d+\.\d+/)[0]) * 1.3).toFixed(1));
                } else if (intensity === 'low') {
                    intervention.expectedImpact = intervention.expectedImpact.replace(/\d+\.\d+/, 
                        (parseFloat(intervention.expectedImpact.match(/\d+\.\d+/)[0]) * 0.7).toFixed(1));
                }
            });
            
            // Reload interventions with updated data
            loadInterventions();
            
            // Update impact data slightly
            dashboardData.impactData.withInterventions = dashboardData.impactData.withInterventions.map(val => {
                const adjustment = intensity === 'high' ? -0.2 : (intensity === 'low' ? 0.1 : -0.1);
                return parseFloat((val + adjustment).toFixed(1));
            });
            
            // Update chart
            impactChart.data.datasets[1].data = dashboardData.impactData.withInterventions;
            impactChart.update();
            
            // Update metrics
            dashboardData.metrics.projectedAge = (parseFloat(dashboardData.metrics.projectedAge) - 0.5).toFixed(1);
            dashboardData.metrics.ageDifference = `+${(parseFloat(dashboardData.metrics.currentAge) - parseFloat(dashboardData.metrics.projectedAge)).toFixed(1)} years`;
            updateMetrics();
        }

        // Update parameters display
        function updateParameters() {
            const intensity = document.getElementById('intensitySelect').value;
            const focus = document.getElementById('focusSelect').value;
            
            // You could add visual feedback here when parameters change
            console.log(`Parameters updated: Intensity=${intensity}, Focus=${focus}`);
        }
