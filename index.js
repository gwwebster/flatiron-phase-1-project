const fundDropdown = document.querySelector('#fund_dropdown');
const form = document.querySelector('.form');
const estimationResult = document.querySelector('#estimation');
const searchLog = document.querySelector('#log');
const lightDark = document.querySelector('#light_dark');

//form submission
form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault()
    handleFetch()
};

// Loop through fetched JSON data to extract AGR, ER, and MI
function handleFetch() {
    fetch('http://localhost:3000/funds')
    .then(res => res.json())
    .then(funds => {
        funds.forEach(fund => {
            if (fund.symbol === fundDropdown.value) {
                let eR = Number(fund.ER)
                let mI = Number(fund.MI)
                let aGR = Number(fund.AGR)
                let fundName = fund.name
                estimateReturn(eR, mI, aGR, fundName)
            }
        })
    })
};

// estimate return
function estimateReturn(eR, mI, aGR, fundName) {
    let initialInv = Number(form.querySelector('#initial_investment').value)
    let term = Number(form.querySelector('#term_length').value)
    if (initialInv < mI) {
        alert(`Initial investment less than minimum investment of ${mI} for the selected fund. Please try again.`)
    } else {
        let grossReturn = initialInv + (initialInv * (((1 + aGR)**term) - 1))
        let totalReturn = Math.floor(grossReturn - ((initialInv * eR) * term))
        renderEstimate(totalReturn)
        handleLogRender(totalReturn, term, initialInv, eR, fundName)
    }
};