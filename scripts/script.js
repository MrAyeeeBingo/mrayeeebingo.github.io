let itemPool = [
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
    "Mentions the Foo Fighter's last good album",
    "Joins a voice call",
    "Repeats something over and over",
    "Mentions something that freaks him out",
    "Starts a new game (surely he will finish it!)",
    "Pee break",
    "Watches T-Pain's stream",
    "Insults a fictional character",
    "Random Jurassic Park trivia",
    "Gives animal facts"
]

// lazy brute force because i can't be assed to think rn
const winConditions = {
    verticalWins: [
        ["cell00", "cell05", "cell10", "cell15", "cell20"],
        ["cell01", "cell06", "cell11", "cell16", "cell21"],
        ["cell02", "cell07", "cell12", "cell17", "cell22"],
        ["cell03", "cell08", "cell13", "cell18", "cell23"],
        ["cell04", "cell09", "cell14", "cell19", "cell24"] 
    ],
    horizontalWins: [
        ["cell00","cell01","cell02","cell03","cell04"],
        ["cell05","cell06","cell07","cell08","cell09"],
        ["cell10","cell11","cell12","cell13","cell14"],
        ["cell15","cell16","cell17","cell18","cell19"],
        ["cell20","cell21","cell22","cell23","cell24"]
    ],
    diagonalWins: [
        ["cell00","cell06","cell12","cell18","cell24"],
        ["cell20","cell16","cell12","cell08","cell04"]
    ]
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
let clickedCells  = ["cell12"]
let bingoCells = []


function init() {
    // pageElements.menuButton.addEventListener('click', () => menuButtonClickHandler())
    for (let cell of pageElements.cellList) {
        cell.addEventListener('click', () => cellClickHandler(cell))
    }
    pageElements.generateButton.addEventListener('click', () => generateButtonClickHandler())
}

const menuButtonClickHandler = () => {
    menuButtonElement.classList.add('clicked')
    console.log("menu button clicked")
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
        clickedCells.push(cell.id)
    } else {
        cell.classList.remove('clicked')
        clickedCells.splice(clickedCells.indexOf(cell.id), 1)
    }
    checkForBingos(cell.id)
}

const setCellContents = () => {
    let i = 0
    for (let cell of pageElements.cellList) {
        cell.textContent = itemPool[i++]
        if (cell.classList.contains('clicked')) {
            cell.classList.remove('clicked')
        }
    }
}

const randomizeBoard = () => {
    shuffle(itemPool)
    setCellContents()
    clickedCells = ["cell12"]
    bingoCells = []
    updateBingoCells()
    exportBoardToURL()
}

const checkForBingos = cellId => {
    // const clickedCells = [...document.getElementsByClassName('cell clicked')].map(cell => cell.id)
    const checkWin = winType => winConditions[winType].filter(combination => combination.every(cell => clickedCells.includes(cell)))
    
    const verticalBingos = checkWin("verticalWins")
    const horizontalBingos = checkWin("horizontalWins")
    const diagonalBingos = checkWin("diagonalWins")

    bingoCells = [...new Set([...verticalBingos, ...horizontalBingos, ...diagonalBingos].flat(2))]
    updateBingoCells()
}

const updateBingoCells = () => {
    const previousBingoCellElements = document.querySelectorAll('.bingo')
    for (const el of previousBingoCellElements) {
        el.classList.remove('bingo')
    }
    const currentBingoCellElements = bingoCells.map(cellId => document.querySelector(`#${cellId}`))
    for (const el of currentBingoCellElements) {
        el.classList.add('bingo')
    }
}

const exportBoardToURL = () => {
    const stringifiedItems = itemPool.toString()
    const encodedItems = encodeURIComponent(btoa(stringifiedItems))
    // console.log(`unencoded: ${stringifiedItems}\nencoded items: ${encodedItems}`)
    currentURL.searchParams.set('board', encodedItems)
    window.history.replaceState({}, document.title, currentURL.toString())
}

const importBoardFromURL = url => {
    const decodedItems = atob(decodeURIComponent(url))

    pageElements.generateButton.textContent = "Regenerate Board"
    pageElements.generateButton.classList.add('clicked')
    pageElements.board.style.display = 'grid'
    
    itemPool = decodedItems.split(',')
    setCellContents()
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