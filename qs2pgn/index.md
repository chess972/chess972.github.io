# QueryString ↔ PGN Converter
<script type="module">
  import "https://unpkg.com/lit?module";
  // window.lit = Lit; // expose globally if needed
  import "https://unpkg.com/chessboard-element?module";
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>

This page lets you convert text between a QueryString and PGN.

<!-- Raw HTML block inside Markdown -->
<div class="container" style="display:flex; justify-content:space-between; margin-top:1em;">
  <textarea id="qs" placeholder="QueryString:" style="width:95%; height:50px; margin:0.5em;"></textarea>
  <textarea id="pgn" placeholder="PGN" style="width:60%; height:150px; margin:0.5em;"></textarea>
</div>
<div>
  <button onclick="qs2pgn()" style="margin:0.5em; padding:0.5em 1em;">Convert QueryString → PGN</button>
  <button onclick="pgn2qs()" style="margin:0.5em; padding:0.5em 1em;">Convert PGN → QueryString</button>
</div>
<script>
  const QS = document.getElementById("qs");
  const PGN = document.getElementById("pgn");
function qs2pgn() {
  const asciiText = QS.value;
  let hexText = "";
  for (let i = 0; i < asciiText.length; i++) {
    hexText += asciiText.charCodeAt(i).toString(16).padStart(2, "0") + " ";
  }
  PGN.value = hexText.trim();
}
function pgn2qs() {
  const hexText = PGN.value.trim();
  let asciiText = "";
  hexText.split(/\s+/).forEach(h => {
    if (h) asciiText += String.fromCharCode(parseInt(h, 16));
  });
  QS.value = asciiText;
}
</script>

Here's the board:
<chess-board id="board" position="start"></chess-board>
<script>
    const game = new Chess();
    const board = document.getElementById("board");

    // Listen for piece drops
    board.addEventListener("drop", (event) => {
      const move = game.move({
        from: event.detail.source,
        to: event.detail.target,
        promotion: "q" // always promote to queen for simplicity
      });

      if (move === null) {
        // Illegal move → reset board to current game state
        board.setPosition(game.fen());
      } else {
        // Legal move → update board
        board.setPosition(game.fen());
      }
    });
</script>

