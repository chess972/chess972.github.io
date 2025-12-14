# QueryString ↔ PGN Converter

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js"></script>

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
  QS=document.getElementById("qs");
  PGN=document.getElementById("pgn");
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

<div id="board" style="width:400px;"></div>

<script>
  var board = Chessboard('board', 'start');
</script>

