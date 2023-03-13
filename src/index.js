import './scss/app.scss'

/** Функция ожидает нажатие клавиши Enter и вызывает функцию проверки поля
 * на корректность и отправку запроса. 
 */
function handleKeypress(searchInput) {
    searchInput.addEventListener('keydown', e => {
        let searchText = e.target.value
        if (e.key === 'Enter') {
           validateAndSubmit(e, searchText)
        }
    })
}

/** Функция ожидает нажатие на кнопку и вызывает функцию проверки поля
 * на корректность и отправку запроса. 
 */
function handleClick(searchButton) {
    searchButton.addEventListener('click', e => {
        let searchText = document.querySelector('.search__input').value
        validateAndSubmit(e, searchText)
    })
}

/** Функция отправки запроса. Если есть лишние пробелы, они удаляются, если поле поиска пустое или
 * содержит менее 3 символов, вызывается функция показа предупреждения. Если запрос корректен,
 * при наличии результатов поиска в списке они удаляются, затем запрос отправляется в API.
 */
function validateAndSubmit(e, searchText) {
    e.preventDefault()
    searchText = searchText.trim()

    if(!searchText) {
        showValidationWarning('Введите запрос в поле поиска.')
    }
    else if (searchText.length <= 3) {
        showValidationWarning('Введенных символов недостаточно. Введите более 3 символов.')
    }
    else {
        clearResultList()
        fetchRepos(searchText)
    }
}

/** Функция получения ответа от API. Я использовал обычный квери во избежание установки дополнительных зависимостей.
 * Показывается сообщение о загрузке, затем получается ответ, и если нет удовлетворяющих запросу репозиториев,
 * выводится сообщение, что ничего не найдено. Если репозитории есть, они отрисовываются в списке.
 */
async function fetchRepos(text) {
    showLoadingMessage()
    await fetch(`https://api.github.com/search/repositories?q=${text}+in:name&page=1&per_page=10`)
    .then(res => res.json()).then(json => {
        hideLoadingMessage()
        if (json.total_count == 0) {
            showUnsuccessMessage()
        }
        appendResultsToPage(json.items)
    })
}

/** Сообщение о том, что ничего не найдено. */
function showUnsuccessMessage() {
    let resultList = document.querySelector('.result')
    let unsuccessMessage = document.createElement('li')
    unsuccessMessage.classList.add('result__unsuccess')
    unsuccessMessage.textContent = 'Ничего не найдено'
    resultList.append(unsuccessMessage)
}

/** Отрисовка результатов поиска. Написано без лишних абстракций, по большей части из-за
 * простоты структуры документа.
 */
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

/** Очищение списка результатов, если таковой имеется. */
function clearResultList() {
    for(let item of document.querySelectorAll('.result')) {
        item.textContent = ''
    }
}

/** Заглушка, уведомляющая пользователя, что происходит загрузка. */
function showLoadingMessage() {
    let resultList = document.querySelector('.result')
    let loadingMessage = document.createElement('li')
    loadingMessage.classList.add('result__loading')
    loadingMessage.textContent = 'Загрузка...'
    resultList.append(loadingMessage)
}

/** Сокрытие заглушки, когда загрузка завершена и список готов к отрисовке. */
function hideLoadingMessage() {
    let loadingMessage = document.querySelector('.result__loading')
    loadingMessage.innerHTML = ''
}

/** Вывод на экран уведомления о некорректности запроса. */
function showValidationWarning(string) {
    let notificationList = document.querySelector('.notifications')
    if(notificationList.children.length <= 5) {
        let notificationItem = document.createElement('div')
    notificationItem.classList.add('notifications__item')
    notificationItem.textContent = string
    notificationList.append(notificationItem)
    setTimeout(() => {hideValidationWarning(notificationItem)}, 3000)
    }
}

/** Удаление уведомления. */
function hideValidationWarning(notificationItem) {
    notificationItem.remove()
}

let searchInput = document.querySelector('.search__input')
let searchButton = document.querySelector('.search__button')

/** Запускаем слушатели на форму и кнопку. */
handleKeypress(searchInput)
handleClick(searchButton)