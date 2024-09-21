let investments = [];
let totalPortfolioValue = 0;

document.getElementById('add-investment-button').addEventListener('click', function() {
    document.getElementById('investment-form').classList.toggle('hidden');
});

document.getElementById('submit-investment').addEventListener('click', function() {
    const assetName = document.getElementById('asset-name').value;
    const amountInvested = parseFloat(document.getElementById('amount-invested').value);
    const currentValue = parseFloat(document.getElementById('current-value').value);

    if (assetName && amountInvested >= 0 && currentValue >= 0) {
        const investment = {
            name: assetName,
            invested: amountInvested,
            current: currentValue
        };
        
        investments.push(investment);
        updatePortfolio();
        updateLocalStorage();
        resetForm();
    } else {
        alert('Please provide valid investment details.');
    }
});

//  function for reset to form
function resetForm() {
    document.getElementById('asset-name').value = '';
    document.getElementById('amount-invested').value = '';
    document.getElementById('current-value').value = '';
    document.getElementById('investment-form').classList.add('hidden');
}

//  function for update the form

function updatePortfolio() {
    const tableBody = document.getElementById('investment-table-body');
    tableBody.innerHTML = '';
    totalPortfolioValue = 0;

    investments.forEach((investment, index) => {
        const percentageChange = ((investment.current - investment.invested) / investment.invested * 100).toFixed(2);
        totalPortfolioValue += investment.current;

        const row = `<tr>
            <td>${investment.name}</td>
            <td>$${investment.invested.toFixed(2)}</td>
            <td>$${investment.current.toFixed(2)}</td>
            <td>${percentageChange}%</td>
            <td>
                <button onclick="updateInvestment(${index})">Update</button>
                <button onclick="removeInvestment(${index})">Remove</button>
            </td>
        </tr>`;
        
        tableBody.innerHTML += row;
    });

    document.getElementById('total-value').innerText = `$${totalPortfolioValue.toFixed(2)}`;
    updateChart();
}

function updateInvestment(index) {
    const newCurrentValue = parseFloat(prompt('Enter new current value:', investments[index].current));
    if (newCurrentValue >= 0) {
        investments[index].current = newCurrentValue;
        updatePortfolio();
        updateLocalStorage();
    }
}

function removeInvestment(index) {
    investments.splice(index, 1);
    updatePortfolio();
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('investments', JSON.stringify(investments));
}

function loadFromLocalStorage() {
    const storedInvestments = JSON.parse(localStorage.getItem('investments'));
    if (storedInvestments) {
        investments = storedInvestments;
        updatePortfolio();
    }
}

// Chart.js
let myChart;

function updateChart() {
    const labels = investments.map(inv => inv.name);
    const data = investments.map(inv => inv.current);
    
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('portfolio-chart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investment Distribution',
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Portfolio Asset Distribution'
                }
            }
        }
    });
}

loadFromLocalStorage();
