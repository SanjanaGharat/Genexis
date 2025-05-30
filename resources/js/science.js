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


        // Clock Comparison Chart
        const clockComparisonCtx = document.getElementById('clockComparisonChart').getContext('2d');
        const clockComparisonChart = new Chart(clockComparisonCtx, {
            type: 'radar',
            data: {
                labels: ['Accuracy', 'Precision', 'Mortality Prediction', 'Disease Correlation', 'Intervention Sensitivity'],
                datasets: [
                    {
                        label: 'Horvath Clock',
                        data: [85, 82, 78, 75, 65],
                        backgroundColor: 'rgba(0, 229, 255, 0.2)',
                        borderColor: '#00E5FF',
                        borderWidth: 2,
                        pointBackgroundColor: '#00E5FF'
                    },
                    {
                        label: 'GrimAge',
                        data: [82, 80, 92, 88, 70],
                        backgroundColor: 'rgba(0, 245, 208, 0.2)',
                        borderColor: '#00F5D0',
                        borderWidth: 2,
                        pointBackgroundColor: '#00F5D0'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(29, 78, 107, 0.5)'
                        },
                        grid: {
                            color: 'rgba(29, 78, 107, 0.5)'
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#00F5D0'
                        },
                        pointLabels: {
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

        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        const performanceChart = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['Horvath', 'Hannum', 'PhenoAge', 'GrimAge'],
                datasets: [{
                    label: 'AUC-ROC for Mortality',
                    data: [0.72, 0.75, 0.81, 0.86],
                    backgroundColor: [
                        'rgba(0, 229, 255, 0.7)',
                        'rgba(0, 245, 208, 0.7)',
                        'rgba(29, 78, 107, 0.7)',
                        'rgba(255, 255, 255, 0.7)'
                    ],
                    borderColor: [
                        '#00E5FF',
                        '#00F5D0',
                        '#1D4E6B',
                        '#FFFFFF'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0.5,
                        max: 0.9,
                        grid: {
                            color: 'rgba(29, 78, 107, 0.3)'
                        },
                        ticks: {
                            color: '#00F5D0',
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#00F5D0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'AUC: ' + context.raw.toFixed(3);
                            }
                        }
                    }
                }
            }
        });
    