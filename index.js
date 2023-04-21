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
                let searchFund = fund
                estimateReturn(searchFund)
            }
        })
    })
};

// estimate return
function estimateReturn(searchFund) {
    let initialInv = Number(form.querySelector('#initial_investment').value)
    let term = Number(form.querySelector('#term_length').value)
    if (initialInv < Number(searchFund.MI)) {
        alert(`Initial investment less than minimum investment of $${searchFund.MI} for the selected fund. Please try again.`)
    } else {
        let grossReturn = initialInv + (initialInv * (((1 + Number(searchFund.AGR))**term) - 1))
        let totalReturn = Math.floor(grossReturn - ((initialInv * Number(searchFund.ER) * term)))
        renderEstimate(totalReturn)
        handleLogRender(totalReturn, term, initialInv, searchFund)
    }
};

function renderEstimate(totalReturn) {
    estimationResult.textContent = `~$${totalReturn}`
};

// Append search result to search log list
function handleLogRender(totalReturn, term, initialInv, searchFund) {
    let li = document.createElement('li')
    li.innerHTML = `<p>Fund: ${searchFund.name}</p>
    <p>Estimated Return: <span class="returns">$${totalReturn}</span></p>
    <p>Term Length: ${term} years</p>
    <p>Initial Investment: $${initialInv}</p>
    <p>Expense Ratio: ${Number(searchFund.ER) * 100}%</p>`
    searchLog.appendChild(li)
    li.addEventListener('mouseenter', handleMouse)
};

//Event listener for highlighting estimated return in search log
function handleMouse() {
    this.querySelector('.returns').classList.add('highlighted')
    this.addEventListener('mouseleave', () => {
        this.querySelector('.returns').classList.remove('highlighted')
    })
};

//light/dark mode
lightDark.addEventListener('click', changeColor)

function changeColor() {
    (function (window) {
        let style = document.querySelector("head")
        .appendChild(document.createElement("style"))

        let styleSheet = document.styleSheets[document.styleSheets.length - 1]
        styleSheet.insertRule("* {}", 0)
        styleSheet.insertRule('.form {}', 1)
        styleSheet.insertRule('select, button, input {}', 2)

        window.universal = styleSheet.cssRules
      })(window);
    if (lightDark.querySelector('button').textContent === "Dark") {
        window.universal[0].style.backgroundColor = 'black'
        window.universal[0].style.color = 'white'
        window.universal[1].style.border = '2px solid white'
        window.universal[2].style.backgroundColor = '#DCDCDC'
        window.universal[2].style.color = 'black'
        lightDark.querySelector('button').textContent = "Light"
    } else {
        window.universal[0].style.backgroundColor = '#e4e4e4'
        window.universal[0].style.color = 'black'
        window.universal[1].style.border = '2px solid black'
        window.universal[2].style.backgroundColor = '#e4e4e4'
        lightDark.querySelector('button').textContent = "Dark"
    }
};