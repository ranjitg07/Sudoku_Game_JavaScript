document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode);
    // chang mobile status bar color
    document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);

	}
}

var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j]
			}

			else
				arr[i][j].innerText = ''
		}
	}
}
const cells = document.querySelectorAll('.main-grid-cell1');

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')

// add space for each 9 cells
const initGameGrid = () => {
    let index = 0;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++) {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5) cells[index].style.marginBottom = '10px';
        if (col === 2 || col === 5) cells[index].style.marginRight = '10px';

        index++;
    }
}
// --------------

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.board
		FillBoard(board)
	}
	// Add a timestamp to the URL to avoid caching
    var timestamp = new Date().getTime();
    xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy&timestamp=' + timestamp)
    //we can change the difficulty of the puzzle; the allowed values of difficulty are easy, medium, hard, and random
    xhrRequest.send()
}

SolvePuzzle.onclick = () => {
	SudokuSolver(board, 0, 0, 9);
};

function isValid (board, i, j, num, n) {
        // Row and Col Checks
        for (let x = 0; x<n; x++) {
            if (board[i][x] == num || board [x][j] == num) {
            return false;
        }
    }

    // SubMatrix Check
        let rn = Math.sqrt (n);
        let si = i - i % rn;
        let sj = j - j % rn;
        
        for (let x = si; x < si + rn; x++) {
            for (let y = sj; y < sj + rn; y++) {
                if (board [x][y] ==num) {
                    return false;
            }
        }
    }

    return true;
}


function SudokuSolver (board, i, j, n) {
    // Base Case
    if (i == n) {
    // Print (board, n);
    FillBoard (board);
    return true;
    }

    // if we are not inside the box
    if(j==n){
        return SudokuSolver(board, i + 1, 0, n);
    }

    // if cell is already filled -> just move ahead
    if (board[i][j] != 0){
        return SudokuSolver(board, i, j + 1, n);
    }
    // we try to fill the cell with an appropiate number
    for (let num = 1; num <= 9; num++) {
            // Check is num can be filled
        if (isValid (board, i, j, num, n)) {
            board[i][j] = num;
            let subAns = SudokuSolver(board, i, j + 1, n);
            if (subAns) {
                return true;
        }
            // Backtracking -> undo the change
            board[i][j] = 0;
        }
    } 
    return false;
}

const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkmode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkmode ? '#1a1a2e' : '#fff');
    initGameGrid();
}

init();