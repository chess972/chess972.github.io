# QueryString ↔ PGN Converter
<script type="module">
  import "https://unpkg.com/lit?module";
  // window.lit = Lit; // expose globally if needed
  import "https://unpkg.com/chessboard-element?module";
  import { Chess } from "https://unpkg.com/chess.js/dist/esm/chess.js";
  var game = new Chess(), replay = new Chess();
</script>
<!--minified version from cloudflare
script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script-->

This page lets you convert between a QueryString and PGN.

<!--div class="container" style="display:flex; justify-content:space-between; margin-top:1em;"-->
<div>
  <!-- Checkbox -->
  <label>
    <input type="checkbox" id="prefixCheckbox" onchange='checkboxChanged();'/>
    Prefix QS with
  </label>
  <!-- Input for base URL -->
  <label for="baseUrl">Base URL</label>
  <input type="text" id="baseUrl" size="50" />
  <button onclick="baseUrlInput.value = BaseUrl;">Reset</button>
  <button onclick="baseUrlInput.value = 'http://chessqr.com/';">chessQR</button>
<script>
  // NOTE : use var not const to make them globally available (esp. in onClick=...)
  var prefixCheckbox = document.getElementById("prefixCheckbox");
  var baseUrlInput = document.getElementById("baseUrl");
  //  const resetBtn = document.getElementById("resetBtn");
  //  const chessQRBtn = document.getElementById("chessQRBtn");
  // const URL = window.location.href; // full URL with QS
  var BaseUrl = window.location.origin + window.location.pathname;
  // Initialize input with current base URL
  baseUrlInput.value = BaseUrl;

function checkboxChanged() { // uses global var QS only defined later
  if (prefixCheckbox.checked && ! QS.value.startsWith("http"))
    QS.value = BaseUrlInput.value + QS.value; 
  if (! prefixCheckbox.checked && QS.value.startsWith("http"))
    QS.value = QS.value.includes("?") ? QS.value.substring(QS.value.indexOf("?")) : "?q=" ; 
}
/*
    // Reset button → restore current page's base URL
    resetBtn.addEventListener("click", () => {
      baseUrlInput.value = BaseUrl;
    });
    // chessQR button → set to http://chessqr.com/
    chessQRBtn.addEventListener("click", () => {
      baseUrlInput.value = "...";
    });
************/
</script>
<br/>
  <textarea id="qs" placeholder="QueryString:" style="width:95%; height:50px; margin:0.5em;"></textarea>
  <textarea id="pgn" placeholder="PGN" style="width:60%; height:150px; margin:0.5em;"></textarea>
</div>
<script>
  var QS = document.getElementById("qs");
  var PGN = document.getElementById("pgn");
  var queryString = window.location.search;// e.g.: "?foo=1&bar=2"
  var params = new URLSearchParams(queryString);
if (queryString) { QS.value = queryString; checkboxChanged(); }
</script>
<div>
  <button onclick="qs2pgn()" style="margin:0.5em; padding:0.5em 1em;">Convert QueryString → PGN</button>
  <button onclick="pgn2qs()" style="margin:0.5em; padding:0.5em 1em;">Convert PGN → QueryString</button>
</div>
<script>
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
  <button id="firstBtn" onclick="stepReplay(-99);">[ |<<= ] First</button>
  <button id="prevBtn"  onclick="stepReplay( -1);">[ < ] Previous</button>
  <button id="nextBtn"  onclick="stepReplay(  1);">[ > ]Next</button>
  <button id="lastBtn"  onclick="stepReplay(999);">[ =>>| ]Last</button>
<br/>
<chess-board position="start" draggable-pieces="true" style="width:50%;"></chess-board>
<script>
    var game = new Chess();
    var board = document.querySelector("chess-board"); // id="board" only needed if more than one

    // Listen for piece drops
    board.addEventListener("drop", (event) => {
      const move = game.move({ from: event.detail.source, to: event.detail.target,
        promotion: "q" // always promote to queen for simplicity
      });
      board.setPosition(game.fen());

      if (move === null) {
        // Illegal move → reset board to current game state
      } else {
        // Legal move → update board
        PGN.value = game.pgn();
      }
    });
    // Helper: set board to position at index
    function stepReplay(step) { /* step = -1 : back ; step > 0 : forward ; else (0 and < -1): reset */
      let current = replay.history().length;
      const moves = game.history({ verbose: true });
      if (step == -1) {
        if (current) replay.undo();
      } else if (step < 1) replay.reset();
      else while (step > 0 && current < moves.length) {
        step -= 1; replay.move(moves[current]); current += 1;
      } 
      board.setPosition(replay.fen());
      highlightMove(replay.history().length);
    }
    // Highlight current move in PGN textarea
    function highlightMove(index) {
      const moves = game.history();
      if (index === 0) {
        PGN.setSelectionRange(0, 0);
        return;
      }
      // Find substring of PGN up to that move
      const pgnText = game.pgn();
      const moveStr = moves[index - 1]; // last played move
      const pos = pgnText.indexOf(moveStr);
      if (pos !== -1) {
        PGN.focus();
        PGN.setSelectionRange(pos, pos + moveStr.length);
      }
    }
  </script>
