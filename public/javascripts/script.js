const squareSize = 20
let matrix = []

function drawGrid(ctx, height, width) {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'

    let currentVerticalStart = 1
    while (currentVerticalStart <= width + 1) {
        ctx.beginPath()
        ctx.moveTo(currentVerticalStart, 0)
        ctx.lineTo(currentVerticalStart, height + 1)
        ctx.stroke()
        currentVerticalStart += squareSize
    }

    let currentHorizontalStart = 1
    while (currentHorizontalStart <= height + 1) {
        ctx.beginPath()
        ctx.moveTo(0, currentHorizontalStart)
        ctx.lineTo(width + 1, currentHorizontalStart)
        ctx.stroke()
        currentHorizontalStart += squareSize
    }
}

function drawSquares(ctx) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            drawSquare(ctx, matrix[i][j] ? 'orange' : 'white', j, i)
        }
    }
}

function drawSquare(ctx, style, x, y) {
    ctx.fillStyle = style
    const lineOffset = 2
    ctx.fillRect(
        x * squareSize + lineOffset,
        y * squareSize + lineOffset,
        squareSize - lineOffset,
        squareSize - lineOffset
    )
}

function evaluateNextState() {
    const newMatrix = matrix.map((r) => r.map(() => 0))
    const isWithinBounds = (i, j) => {
        if (i < 0 || i >= matrix.length) {
            return false
        }
        if (j < 0 || j >= matrix[0].length) {
            return false
        }
        return true
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let liveNeighbors = 0
            const addIfAlive = (a, b) => {
                if (isWithinBounds(a, b)) {
                    if (matrix[a][b]) {
                        liveNeighbors++
                    }
                }
            }
            addIfAlive(i - 1, j - 1)
            addIfAlive(i - 1, j)
            addIfAlive(i - 1, j + 1)
            addIfAlive(i, j - 1)
            addIfAlive(i, j + 1)
            addIfAlive(i + 1, j - 1)
            addIfAlive(i + 1, j)
            addIfAlive(i + 1, j + 1)
            let newValue = false
            if (matrix[i][j]) {
                // alive
                newValue = liveNeighbors === 2 || liveNeighbors === 3
            } else {
                newValue = liveNeighbors === 3
            }
            newMatrix[i][j] = newValue
        }
    }
    matrix = newMatrix
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const sizeWidth = 95 * window.innerWidth / 100,
        sizeHeight = 90 * window.innerHeight / 100

    //Setting the canvas site and width to be responsive
    canvas.width = sizeWidth
    canvas.height = sizeHeight
    canvas.style.width = sizeWidth + "px"
    canvas.style.height = sizeHeight + "px"

    // Spare 1 px for end line
    const realHeight = sizeHeight - 2
    const realWidth = sizeWidth - 2

    // We're using 20x20 squares, need to round the boundaries
    const totalHeight = realHeight - (realHeight % squareSize)
    const totalWidth = realWidth - (realWidth % squareSize)

    function clear() {
        matrix = Array(totalHeight / squareSize)
            .fill(0)
            .map(() =>
                Array(totalWidth / squareSize).fill(false)
            )
        drawSquares(ctx)
    }
    clear()

    function randomFill() {
        matrix = Array(totalHeight / squareSize)
            .fill(0)
            .map(() =>
                Array(totalWidth / squareSize)
                    .fill(false)
                    .map(() => Math.random() > 0.40)
            )
        drawSquares(ctx)
    }

    drawGrid(ctx, totalHeight, totalWidth)

    drawSquares(ctx)

    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const clearButton = document.getElementById('clear')
    const fillButton = document.getElementById('random')
    let isPlaying = false

    setInterval(() => {
        if (isPlaying) {
            evaluateNextState()
            drawSquares(ctx)
        }
    }, 200)

    const play = () => {
        isPlaying = true
        playButton.disabled = true
        pauseButton.disabled = false
    }
    const pause = () => {
        isPlaying = false
        playButton.disabled = false
        pauseButton.disabled = true
    }

    playButton.addEventListener('click', play)
    pauseButton.addEventListener('click', pause)
    clearButton.addEventListener('click', clear)
    fillButton.addEventListener('click', randomFill)

    pause()

    canvas.addEventListener('click', (e) => {
        let squareX = Math.min(Math.max(0, Math.floor((e.offsetX - 2) / squareSize)), matrix[0].length);
        let squareY = Math.min(Math.max(0, Math.floor((e.offsetY - 2) / squareSize)), matrix.length);
        matrix[squareY][squareX] = !matrix[squareY][squareX]
        drawSquares(ctx)
    })
})