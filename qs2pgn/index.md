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
  <!-- Checkbox -->
  <label>
    <input type="checkbox" id="prefixCheckbox" onchange='checkboxChanged();'/>
    Prefix URL to QS
  </label>
  <!-- Input for base URL -->
  <label for="baseUrl">Base URL:</label>
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
/*
    // Reset button → restore current page's base URL
    resetBtn.addEventListener("click", () => {
      baseUrlInput.value = BaseUrl;
    });
    // chessQR button → set to http://chessqr.com/
    chessQRBtn.addEventListener("click", () => {
      baseUrlInput.value = ";
************/
</script>
  <br/>
  <textarea id="qs" placeholder="QueryString:" style="width:95%; height:50px; margin:0.5em;"></textarea>
  <textarea id="pgn" placeholder="PGN" style="width:60%; height:150px; margin:0.5em;"></textarea>
</div>
<script>
  var queryString = window.location.search;// e.g.: "?foo=1&bar=2"
  var params = new URLSearchParams(window.location.search);
  const QS = document.getElementById("qs");
  const PGN = document.getElementById("pgn");
if (queryString) { QS.value = queryString; checkboxChanged(); }
function checkboxChanged() {
  if (prefixCheckbox.checked && ! QS.value.startsWith("http"))
    QS.value = BaseUrlInput + QS.value; 
  if (! prefixCheckbox.checked && QS.value.startsWith("http"))
    QS.value = QS.value.includes("?") ? QS.value.substring(QS.value.indexOf("?")) : "?q=" ; 
}
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
<chess-board position="start" draggable-pieces="true"></chess-board>
<script>
    var game = new Chess();
    var board = querySelector("chess-board"); # id="board" only needed if more than one

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
</script>

