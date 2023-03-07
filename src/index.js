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
    await fetch(`https://api.github.com/search/repositories?q=${text}&page=1&per_page=10`)
    .then(res => res.json()).then(json => {
        if (json.total_count == 0) {
            showUnsuccessMessage()
        }
        appendResultsToPage(json.items)
    })
}

function showUnsuccessMessage() {
    let resultList = document.querySelector('.result')
    let unsuccessMessage = document.createElement('li')
    unsuccessMessage.classList.add('result__item')
    unsuccessMessage.textContent = 'Ничего не найдено'
    resultList.append(unsuccessMessage)
}

function appendResultsToPage(array) {
    let resultList = document.querySelector('.result')
    for(let elem of array) {

        let li = document.createElement('li')
        li.classList.add('result__item')

        let name = document.createElement('div')
        let description = document.createElement('div')
        let owner = document.createElement('div')

        name.classList.add('item__name')
        description.classList.add('item__description')
        owner.classList.add('item__owner')


        name.textContent = elem.full_name
        description.textContent = elem.description
        owner.textContent = elem.owner.login

        li.append(name)
        li.append(description)
        li.append(owner)

        resultList.append(li)
    }
}

function clearResultList() {
    for(let item of document.querySelectorAll('.result')) {
        item.textContent = ''
    }
}

let searchInput = document.querySelector('.search__input')
let searchButton = document.querySelector('.search__button')

handleKeypress(searchInput)
handleClick(searchButton)