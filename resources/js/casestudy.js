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

 // Featured Case Study Chart
        const featuredCaseStudyCtx = document.getElementById('featuredCaseStudyChart').getContext('2d');
        const featuredCaseStudyChart = new Chart(featuredCaseStudyCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
                datasets: [
                    {
                        label: 'Chronological Age',
                        data: [46.0, 46.2, 46.4, 46.6, 46.8, 47.0],
                        borderColor: '#1D4E6B',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0
                    },
                    {
                        label: 'Biological Age',
                        data: [47.8, 47.2, 46.9, 46.7, 46.3, 46.0],
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
                plugins: {
                    legend: {
                        labels: {
                            color: '#00F5D0'
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Age (years)',
                            color: '#00F5D0'
                        },
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
                }
            }
        });

        // Case Study Mini Charts
        function createMiniChart(id, data) {
            const ctx = document.getElementById(id).getContext('2d');
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Baseline', '3M', '6M', '9M', '12M'],
                    datasets: [{
                        data: data,
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#00F5D0'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { display: false },
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: '#00F5D0'
                            }
                        }
                    }
                }
            });
        }

        createMiniChart('caseStudyChart1', [45.2, 44.8, 44.1, 43.7, 42.8]);
        createMiniChart('caseStudyChart2', [52.7, 52.1, 51.8, 51.5, 51.0]);
        createMiniChart('caseStudyChart3', [58.3, 57.8, 57.0, 56.2, 55.2]);

        // Results Chart
        const resultsCtx = document.getElementById('resultsChart').getContext('2d');
        const resultsChart = new Chart(resultsCtx, {
            type: 'bar',
            data: {
                labels: ['Biological Age', 'Inflammation', 'Glucose', 'Telomeres', 'Energy'],
                datasets: [{
                    label: 'Improvement',
                    data: [15, 58, 42, 11, 67],
                    backgroundColor: [
                        '#00E5FF',
                        '#00F5D0',
                        '#1D4E6B',
                        '#FFFFFF',
                        '#00E5FF'
                    ],
                    borderColor: [
                        '#00E5FF',
                        '#00F5D0',
                        '#1D4E6B',
                        '#FFFFFF',
                        '#00E5FF'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '% improvement';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(29, 78, 107, 0.3)'
                        },
                        ticks: {
                            color: '#00F5D0',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#00F5D0'
                        }
                    }
                }
            }
        });