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
    "Mentions the Foo Fighter's last good album",
    "Joins a voice call",
    "Repeats something over and over",
    "Mentions something that freaks him out",
    "Starts a new game (surely he will finish it!)",
    "Pee break",
    "Watches T-Pain's stream",
    "Insults a fictional character"
]

// lazy brute force because i can't be assed to think rn
const winConditions = {
    verticalWins: [
        ["cell00", "cell05", "cell10", "cell15", "cell20"],
        ["cell01", "cell06", "cell11", "cell16", "cell21"],
        ["cell02", "cell07",           "cell17", "cell22"],
        ["cell03", "cell08", "cell13", "cell18", "cell23"],
        ["cell04", "cell09", "cell14", "cell19", "cell24"] 
    ],
    horizontalWins: [
        ["cell00","cell01","cell02","cell03","cell04"],
        ["cell05","cell06","cell07","cell08","cell09"],
        ["cell10","cell11",        ,"cell13","cell14"],
        ["cell15","cell16","cell17","cell18","cell19"],
        ["cell20","cell21","cell22","cell23","cell24"]
    ],
    diagonalWins: [
        ["cell00","cell06","cell18","cell24"],
        ["cell20","cell16","cell08","cell04"]
    ]
}

const menuButtonElement = document.querySelector('.menu-icon')
const cellElementArray = document.querySelectorAll('.cell')
const boardButtonElement = document.querySelector('.generate-button')
const boardElement = document.querySelector('.board')
const infoSidebarElement = document.querySelector('.info-sidebar')
const bingoListElements = {
    bingoWins: document.querySelector('.bingo-wins'),
    bingoFreeSpace: document.getElementById('bingo-free-space-rule'),
    bingoNoFreeSpace: document.getElementById('bingo-no-free-space-rule'),
    bingoVertical: document.getElementById('bingo-vertical-rule'),
    bingoHorizontal: document.getElementById('bingo-horizontal-rule'),
    bingoDiagonal: document.getElementById('bingo-diagonal-rule'),
    bingoFull: document.getElementById('bingo-full-bingo-rule'),
}
let currentBingos = {
    any: false, freeSpace: false, noFreeSpace: false, vertical: false, horizontal: false, diagonal: false, full: false
}


init()

function init() {
    menuButtonElement.addEventListener('click', () => menuButtonClickHandler())
    for (let cell of cellElementArray) {
        cell.addEventListener('click', () => cellClickHandler(cell))
    }
    boardButtonElement.addEventListener('click', () => boardButtonClickHandler())
}

const menuButtonClickHandler = () => {
    menuButtonElement.classList.add('clicked')
    console.log("menu button clicked")
}

const boardButtonClickHandler = () => {
    populateBoard()
    let isClicked = boardElement.classList.contains('clicked')
    if (!isClicked) {
        boardButtonElement.textContent = "Regenerate Board"
        boardButtonElement.classList.add('clicked')
        boardElement.style.display = 'grid'
        infoSidebarElement.style.display = 'flex'
    }
}

const cellClickHandler = cell => {
    const isClicked = cell.classList.contains('clicked')
    if (isClicked)
        cell.classList.remove('clicked')
    else
        cell.classList.add('clicked')
    checkForBingos()
}

const populateBoard = () => {
    shuffle(itemPool)
    let i = 0
    for (let cell of cellElementArray) {
        cell.textContent = itemPool[i++]
        if (cell.classList.contains('clicked')) {
            cell.classList.remove('clicked')
        }
    }
}

const checkForBingos = () => {
    // const clickedCells = [...document.getElementsByClassName('cell clicked')].map(cell => cell.id)

    // for (let winCheck of winConditions.verticalWins) {
    //     const hasBingo = winCheck.every(x => clickedCells.includes(x))
    //     if (hasBingo) {
    //         currentBingos
    //     }
    //     // console.log(`${winCheck} has bingo: ${hasBingo}`)
    // }
    

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
