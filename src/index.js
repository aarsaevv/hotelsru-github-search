import './scss/app.scss'

function handleKeypress(searchInput) {
    searchInput.addEventListener('keypress', e => {
        let searchText = e.target.value
        if (e.key === 'Enter') {
           validateAndSubmit(e, searchText)
        }
    })
}

function handleClick(searchButton) {
    searchButton.addEventListener('click', e => {
        let searchText = document.getElementById('search__input').value
        validateAndSubmit(e, searchText)
    })
}

function validateAndSubmit(e, searchText) {
    e.preventDefault()
    searchText = searchText.trim()
        if(!searchText) {
            throw('Введите запрос в поле поиска')
        }
        if (searchText.length <= 2) {
            throw('Введенных символов недостаточно')
        }
        fetchRepos(searchText)
}

async function fetchRepos(text) {
    await fetch(`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`)
    .then(res => res.json()).then(json => {
        if (json.total_count == 0) {
            throw('Ничего не найдено')
        }
        console.log(json.items)
    })
}

let searchInput = document.querySelector('.search__input')
let searchButton = document.querySelector('.search__button')

handleKeypress(searchInput)
handleClick(searchButton)