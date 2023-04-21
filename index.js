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

function renderEstimate(totalReturn) {
    estimationResult.textContent = `~$${totalReturn}`
};

// Append search result to search log list
function handleLogRender(totalReturn, term, initialInv, eR, fundName) {
    let li = document.createElement('li')
    li.innerHTML = `<p>Fund: ${fundName}</p>
    <p>Estimated Return: <span class="returns">$${totalReturn}</span></p>
    <p>Term Length: ${term} years</p>
    <p>Initial Investment: $${initialInv}</p>
    <p>Expense Ratio: ${Number(eR) * 100}%</p>`
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