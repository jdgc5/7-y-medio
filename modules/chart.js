function drawChart(game) {
    const ctx = document.getElementById("myChart").getContext("2d");
    
    // Si hay un gráfico anterior, destrúyelo
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    
    // Crea un nuevo gráfico
    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ['Victorias', 'Derrotas', 'Empate', 'Racha Victorias', 'Racha Derrotas'],
            datasets: [
                {
                    label: "Jugador1",
                    data: [game.jugadores[0].victorias, game.jugadores[0].derrotas, game.jugadores[0].empate, game.rachas.jugador1, game.rachas.derrotas.jugador1],
                    backgroundColor: "rgba(0, 0, 255, 1)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Banca",
                    data: [game.jugadores[1].victorias, game.jugadores[1].derrotas, game.jugadores[1].empate, game.rachas.jugador2, game.rachas.derrotas.jugador2],
                    backgroundColor: "rgba(255, 0, 0, 1)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    });
}

export { drawChart };
