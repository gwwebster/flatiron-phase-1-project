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