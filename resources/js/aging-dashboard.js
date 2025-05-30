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
        // Update time
        function updateTime() {
            const now = new Date();
            document.getElementById('current-time').textContent = 
                now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        setInterval(updateTime, 1000);
        updateTime();

        // Simulate real-time data changes
        function simulateRealTimeData() {
            // Heart rate
            const hr = 68 + Math.floor(Math.random() * 15);
            document.getElementById('heart-rate').textContent = hr;
            
            // HRV
            const hrv = 45 + Math.floor(Math.random() * 30);
            document.getElementById('hrv').textContent = hrv;
            
            // Oxygen
            const oxygen = 96 + Math.floor(Math.random() * 3);
            document.getElementById('oxygen').textContent = oxygen;
            
            // Glucose
            const glucose = 85 + Math.floor(Math.random() * 30);
            document.getElementById('glucose').textContent = glucose;
            
            // Bio age - slight fluctuation
            const bioAge = 37.5 + (Math.random() * 1.5).toFixed(1);
            document.getElementById('bio-age').textContent = bioAge;
        }
        setInterval(simulateRealTimeData, 3000);
        simulateRealTimeData();

        // Age Gauge
        const ageGaugeCtx = document.getElementById('ageGauge').getContext('2d');
        const ageGauge = new Chart(ageGaugeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [75, 25],
                    backgroundColor: ['#00E5FF', '#1D4E6B'],
                    borderWidth: 0
                }]
            },
            options: {
                circumference: 270,
                rotation: 225,
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        // Main Aging Chart
        const agingCtx = document.getElementById('agingChart').getContext('2d');
        const agingChart = new Chart(agingCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Biological Age',
                        data: [41.2, 40.8, 40.5, 40.1, 39.8, 39.5, 39.2, 38.9, 38.7, 38.5, 38.3, 38.1],
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Chronological Age',
                        data: [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42],
                        borderColor: '#1D4E6B',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0
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
                            color: '#00F5D0'
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
                    }
                }
            }
        });

        // Small charts
        function createSmallChart(id, labels, data, color) {
            const ctx = document.getElementById(id).getContext('2d');
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        borderColor: color,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { display: false },
                        x: { display: false }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // Chart 1 - Inflammation
        createSmallChart('chart1', 
            ['Q1', 'Q2', 'Q3', 'Q4'], 
            [5.2, 4.8, 3.9, 3.5], 
            '#00E5FF'
        );

        // Chart 2 - Metabolic
        createSmallChart('chart2', 
            ['Q1', 'Q2', 'Q3', 'Q4'], 
            [105, 98, 95, 92], 
            '#00F5D0'
        );

        // Chart 3 - Hormonal
        createSmallChart('chart3', 
            ['Q1', 'Q2', 'Q3', 'Q4'], 
            [320, 350, 380, 410], 
            '#00E5FF'
        );

        // Chart 4 - Cellular
        createSmallChart('chart4', 
            ['Q1', 'Q2', 'Q3', 'Q4'], 
            [68, 72, 74, 76], 
            '#00F5D0'
        );
    