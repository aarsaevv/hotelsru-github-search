import './scss/app.scss'

function handleKeypress(searchInput) {
    searchInput.addEventListener('keydown', e => {
        let searchText = e.target.value
        if (e.key === 'Enter') {
           clearResultList()
           validateAndSubmit(e, searchText)
        }
    })
}

function handleClick(searchButton) {
    searchButton.addEventListener('click', e => {
        let searchText = document.querySelector('.search__input').value
        clearResultList()
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
    showLoadingMessage()
    await fetch(`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`)
    .then(res => res.json()).then(json => {
        hideLoadingMessage()
        if (json.total_count == 0) {
            showUnsuccessMessage()
        }
        appendResultsToPage(json.items)
    })
}

function showUnsuccessMessage() {
    let resultList = document.querySelector('.result')
    let unsuccessMessage = document.createElement('li')
    unsuccessMessage.classList.add('result__unsuccess')
    unsuccessMessage.textContent = 'Ничего не найдено'
    resultList.append(unsuccessMessage)
}

function appendResultsToPage(array) {
    let resultList = document.querySelector('.result')
    for(let elem of array) {

        let li = document.createElement('li')
        li.classList.add('result__item')

        let repoLink = document.createElement('a')
        let description = document.createElement('div')
        let owner = document.createElement('div')
        let stars = document.createElement('div')

        repoLink.classList.add('item__link')
        description.classList.add('item__description')
        owner.classList.add('item__owner')
        stars.classList.add('item__stars')

        repoLink.setAttribute('href', elem.html_url)
        repoLink.setAttribute('target', '_blank')
        repoLink.textContent = elem.name

        description.textContent = elem.description ? 'Описание: ' + elem.description : 'No description.'
        owner.textContent = 'Автор: ' + elem.owner.login
        // Небольшое форматирование количества лайков - показывать тысячи звездочек.
        stars.textContent = '☆ ' + ((elem.stargazers_count > 1000) ?
        (elem.stargazers_count / 1000).toFixed(1) + 'k' :
        elem.stargazers_count) 

        li.append(repoLink)
        li.append(description)
        li.append(owner)
        li.append(stars)

        resultList.append(li)
    }
}

function clearResultList() {
    for(let item of document.querySelectorAll('.result')) {
        item.textContent = ''
    }
}

function showLoadingMessage() {
    let resultList = document.querySelector('.result')
    let loadingMessage = document.createElement('li')
    loadingMessage.classList.add('result__loading')
    loadingMessage.textContent = 'Загрузка...'
    resultList.append(loadingMessage)
}

function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.result__loading')
    loadingMessage.innerHTML = ''
}

let searchInput = document.querySelector('.search__input')
let searchButton = document.querySelector('.search__button')

handleKeypress(searchInput)
handleClick(searchButton)

// Кэширование?