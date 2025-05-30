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
        // Acceleration Gauge
        const accelerationCtx = document.getElementById('accelerationGauge').getContext('2d');
        const accelerationGauge = new Chart(accelerationCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [65, 35],
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

        // Clock Comparison Chart
        const clockComparisonCtx = document.getElementById('clockComparison').getContext('2d');
        const clockComparison = new Chart(clockComparisonCtx, {
            type: 'bar',
            data: {
                labels: ['Horvath', 'Hannum', 'PhenoAge', 'GrimAge'],
                datasets: [{
                    label: 'Age Acceleration (years)',
                    data: [2.1, 1.7, 2.4, 3.0],
                    backgroundColor: [
                        '#00E5FF',
                        '#00F5D0',
                        '#1D4E6B',
                        '#FFFFFF'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(29, 78, 107, 0.3)'
                        },
                        ticks: {
                            color: '#00F5D0'
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
                    legend: { display: false }
                }
            }
        });

        // Epigenetic Timeline
        const timelineCtx = document.getElementById('epigeneticTimeline').getContext('2d');
        const epigeneticTimeline = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: [
                    '2020-01-01',
                    '2020-07-01',
                    '2021-01-01',
                    '2021-07-01',
                    '2022-01-01',
                    '2022-07-01',
                    '2023-01-01',
                    '2023-07-01',
                    '2024-01-01'
                ],
                datasets: [
                    {
                        label: 'Chronological Age',
                        data: [38.0, 38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 42.0],
                        borderColor: '#1D4E6B',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0
                    },
                    {
                        label: 'Epigenetic Age',
                        data: [39.1, 39.8, 40.5, 41.3, 41.8, 42.1, 42.3, 42.1, 41.8],
                        borderColor: '#00E5FF',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Intervention Start',
                        data: [null, null, null, null, null, 42.1, 42.3, 42.1, 41.8],
                        borderColor: '#00F5D0',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.3,
                        segment: {
                            borderDash: ctx => ctx.p0DataIndex === 4 ? [6, 6] : undefined
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'year',
                            tooltipFormat: 'MMM yyyy'
                        },
                        grid: {
                            color: 'rgba(29, 78, 107, 0.3)'
                        },
                        ticks: {
                            color: '#00F5D0'
                        }
                    },
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
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#00F5D0'
                        }
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 42.1,
                                yMax: 42.1,
                                xMin: '2022-07-01',
                                xMax: '2024-01-01',
                                borderColor: '#00F5D0',
                                borderWidth: 1,
                                borderDash: [6, 6]
                            },
                            box1: {
                                type: 'box',
                                xMin: '2022-07-01',
                                xMax: '2024-01-01',
                                backgroundColor: 'rgba(0, 245, 208, 0.05)',
                                borderWidth: 0
                            }
                        }
                    }
                }
            }
        });

        // Intervention Correlation
        const interventionCtx = document.getElementById('interventionCorrelation').getContext('2d');
        const interventionCorrelation = new Chart(interventionCtx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Positive Correlation',
                        data: [
                            {x: 0.7, y: -0.2},
                            {x: 0.8, y: -0.3},
                            {x: 0.9, y: -0.4},
                            {x: 1.0, y: -0.5}
                        ],
                        backgroundColor: '#00E5FF',
                        pointRadius: 6
                    },
                    {
                        label: 'Negative Correlation',
                        data: [
                            {x: 0.3, y: 0.1},
                            {x: 0.4, y: 0.2},
                            {x: 0.5, y: 0.3},
                            {x: 0.6, y: 0.4}
                        ],
                        backgroundColor: '#1D4E6B',
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Intervention Adherence',
                            color: '#00F5D0'
                        },
                        grid: {
                            color: 'rgba(29, 78, 107, 0.3)'
                        },
                        ticks: {
                            color: '#00F5D0'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Age Acceleration Change',
                            color: '#00F5D0'
                        },
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

        // Rate of Change
        const rateCtx = document.getElementById('rateOfChange').getContext('2d');
        const rateOfChange = new Chart(rateCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Rate of Aging (years/year)',
                    data: [1.4, 1.2, 0.7, -0.3],
                    borderColor: '#00E5FF',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Years of Acceleration',
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

        // Simulate gauge value changes
        function simulateEpigeneticChanges() {
            const acceleration = 2.0 + Math.random() * 0.4;
            document.getElementById('acceleration-value').textContent = `+${acceleration.toFixed(1)}`;
            
            // Update gauge chart
            accelerationGauge.data.datasets[0].data = [acceleration/3.5*100, 100-(acceleration/3.5*100)];
            accelerationGauge.update();
        }
        setInterval(simulateEpigeneticChanges, 5000);
    