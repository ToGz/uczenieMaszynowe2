document.addEventListener("DOMContentLoaded", () => {
    let rows = 10;
    let cols = 10;
    let minesCount = 20;
    let board = [];
    let minePositions = new Set();

    function setDifficulty(level) {
        if (level === "easy") {
            rows = 8;
            cols = 8;
            minesCount = 10;
        } else if (level === "medium") {
            rows = 10;
            cols = 10;
            minesCount = 20;
        } else if (level === "hard") {
            rows = 15;
            cols = 15;
            minesCount = 40;
        }
        initializeBoard();
    }

    function initializeBoard() {
        board = Array(rows).fill().map(() => Array(cols).fill({ mine: false, revealed: false, count: 0 }));
        minePositions.clear();
        placeMines();
        calculateNumbers();
        renderBoard();
    }

    function placeMines() {
        while (minePositions.size < minesCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            const key = `${r}-${c}`;
            if (!minePositions.has(key)) {
                minePositions.add(key);
                board[r][c] = { ...board[r][c], mine: true };
            }
        }
    }

    function calculateNumbers() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].mine) continue;
                let count = 0;
                directions.forEach(([dr, dc]) => {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                        count++;
                    }
                });
                board[r][c] = { ...board[r][c], count };
            }
        }
    }

    function renderBoard() {
        const container = document.getElementById("game");
        container.innerHTML = "";
        container.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        container.style.gridTemplateRows = `repeat(${rows}, 30px)`;
        board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const div = document.createElement("div");
                div.classList.add("cell");
                div.dataset.row = r;
                div.dataset.col = c;
                div.addEventListener("click", handleClick);
                container.appendChild(div);
            });
        });
    }

    function handleClick(event) {
        const r = parseInt(event.target.dataset.row);
        const c = parseInt(event.target.dataset.col);
        revealCell(r, c);
        if (board[r][c].mine) {
            setTimeout(function() {
                revealMines();
                alert("Game Over!");
            }, 100);

            return;
        }
    }

    function revealCell(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c].revealed) return;
        const cell = board[r][c];
        cell.revealed = true;
        const div = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
        div.classList.add("revealed");
        if (cell.mine) {
            div.classList.add("mine");
            div.textContent = "*";
            return;
        }
        if (cell.count > 0) {
            div.textContent = cell.count;
            return;
        }
        div.textContent = "";
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        directions.forEach(([dr, dc]) => {
            revealCell(r + dr, c + dc);
        });
    }

    function revealMines() {
        minePositions.forEach(position => {
            const [r, c] = position.split("-").map(Number);
            const div = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
            div.classList.add("mine");
            div.textContent = "*";
        });
    }

    document.getElementById("reset").addEventListener("click", initializeBoard);
    document.getElementById("difficulty").addEventListener("change", (event) => setDifficulty(event.target.value));
    initializeBoard();
});
