const itemPool = [
    "Brings up 9/11",
    "Talks about backrooms",
    "Mentions bigfoot",
    "Tells someone to shut up",
    "Plays Melee",
    "Tells someone to keep themselves safe",
    "Watches ghost videos",
    "Watches movie scenes",
    "Plays disney songs",
    "Gets Stun-locked",
    "Plays another game in the Melee category",
    "Alfy cameo",
    "Takes a shot",
    "Weird new chatter joins",
    "Bed is made",
    "Bed isn't made",
    "Verbally assaults a regular chatter",
    "Plays a different character than Falco",
    "Eats on stream",
    "Tech issues",
    "Scrolls through Just Chatting",
    "Pops a gummy",
    //"Mentions the Foo Fighter's last good album",
    "Joins a voice call",
    "Repeats something over and over",
    "Mentions something that freaks him out",
    "Starts a new game (surely he will finish it!)",
    "Pee break",
    "Watches T-Pain's stream",
    "Insults a fictional character",
    "Random Jurassic Park trivia",
    "Gives animal facts",
    "Stays on Live Animal Cam for 30+ Minutes",
    "Argues with nobody"
]

const itemMap = itemPool.reduce((map, e, i) => map.set(i, e), new Map())

let currentBoardConfiguration = [...itemMap.entries()].map(([key, value]) => key)

const rows = [
    [0, 1, 2, 3, 4 ],
    [5, 6, 7, 8, 9 ],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24]
]
const columns = [
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24]
]
const diagonals = [
    [0,6,12,18,24],
    [4,8,12,16,20]
]

const bingoLookup = id => {
    const row = parseInt(id / 5)
    const col = id % 5
    if (!diagonals.flat().includes(id))
        return [rows[row], columns[col]]
    if (id == 12)
        return [rows[row], columns[col], diagonals[0], diagonals[1]]
    return [rows[row], columns[col], diagonals[0].includes(id) ? diagonals[0] : diagonals[1]]
}

const pageElements = {
    menuButton: document.querySelector('.menu-icon'),
    cellList: document.querySelectorAll('.cell'),
    generateButton: document.querySelector('.generate-button'),
    board: document.querySelector('.board'),
    infoSidebar: document.querySelector('.info-sidebar'),
    bingoWins: document.querySelector('.bingo-wins'),
    bingoFreeSpace: document.getElementById('bingo-free-space-rule'),
    bingoNoFreeSpace: document.getElementById('bingo-no-free-space-rule'),
    bingoVertical: document.getElementById('bingo-vertical-rule'),
    bingoHorizontal: document.getElementById('bingo-horizontal-rule'),
    bingoDiagonal: document.getElementById('bingo-diagonal-rule'),
    bingoFull: document.getElementById('bingo-full-bingo-rule'),
}

function init() {
    for (const cell of pageElements.cellList) {
        cell.addEventListener('click', () => cellClickHandler(cell))
    }
    pageElements.generateButton.addEventListener('click', () => generateButtonClickHandler())
    document.querySelector('.main-icon').addEventListener('click', () => resetPage())
}

const generateButtonClickHandler = () => {
    const button = pageElements.generateButton;
    randomizeBoard()
    let isClicked = button.classList.contains('clicked')
    if (!isClicked) {
        button.textContent = "Regenerate Board"
        button.classList.add('clicked')
        pageElements.board.style.display = 'grid'
    }
}

const cellClickHandler = cell => {
    const isClicked = cell.classList.contains('clicked')
    if (!isClicked) {
        cell.classList.add('clicked')
    } else {
        cell.classList.remove('clicked')
        cell.classList.remove('bingo')
    }
    updateBingoCells(cell)
}

const randomizeBoard = () => {
    shuffle(currentBoardConfiguration)
    setCellContents()
    document.querySelectorAll('.bingo').forEach(cell => cell.classList.remove('bingo'))
    exportBoardToURL()
}

const setCellContents = () => {
    let i = 0
    for (let cell of pageElements.cellList) {
        cell.textContent = itemMap.get(parseInt(currentBoardConfiguration[i++]))
        if (cell.classList.contains('clicked')) {
            cell.classList.remove('clicked')
        }
    }
}

const cellIsBingo = cell => {
    const bingoNeighbors = bingoLookup(parseInt(cell.id.slice(-2)))
        .map(arr => arr.map(num => document.getElementById(`cell${num.toString().padStart(2,'0')}`)))
    for (const set of bingoNeighbors) {
        if (set.every(el => el.classList.contains('clicked') || el.classList.contains('free-space'))) {
            return true
        }
    }
    return false
}

const updateBingoCells = cell => {
    const id = parseInt(cell.id.slice(-2))
    const bingoNeighbors = bingoLookup(id)
    .flat()
    .map(num => document.getElementById(`cell${num.toString().padStart(2,'0')}`))
    for (const neighbor of bingoNeighbors) {
        if (cellIsBingo(neighbor)) {
            neighbor.classList.add('bingo')
        } else {
            neighbor.classList.remove('bingo')
        }
    }
}

const exportBoardToURL = () => {
    const boardState = encodeURIComponent(btoa(currentBoardConfiguration.toString()))
    currentURL.searchParams.set('board', boardState)
    window.history.replaceState({}, document.title, currentURL.toString())
}

const importBoardFromURL = url => {
    const decoded = atob(decodeURIComponent(url)).split(',')

    pageElements.generateButton.textContent = "Regenerate Board"
    pageElements.generateButton.classList.add('clicked')
    pageElements.board.style.display = 'grid'

    currentBoardConfiguration = [...decoded]
    setCellContents()
}

const resetPage = () => {
    currentURL.searchParams.delete('board')
    // window.history.replaceState({}, document.title, currentURL.toString())
    window.location.href = currentURL.toString()
    // window.location.reload()
}

const shuffle = arr => {
    let i = arr.length
    while (i > 0) {
        r = Math.floor(Math.random() * i)
        i--
        [arr[i], arr[r]] = [arr[r], arr[i]]
    }
  return arr
}

const currentURL = new URL(window.location.href)
window.addEventListener('load', () => {
    if (currentURL.searchParams.has('board')) {
        try {
            importBoardFromURL(currentURL.searchParams.get('board'))
        }
        catch (e) {
            console.error(`Failed to parse board from URL parameters: ${currentURL.searchParams.get('board')}`)
        }
    }
    init()
})
