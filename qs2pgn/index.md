# QueryString ↔ PGN Converter
<script type="module">
  import "https://unpkg.com/lit?module";
  // window.lit = Lit; // expose globally if needed
  import "https://unpkg.com/chessboard-element?module";
  import { Chess } from "https://unpkg.com/chess.js/dist/esm/chess.js";
  window.Chess = Chess; // in case we'd want to use it elsewhere
</script>
<!--minified version from cloudflare
script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script-->
<script src="qs2pgn.js" defer></script>

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
<br/>
  <textarea id="qs" placeholder="QueryString:" style="width:95%; height:50px; margin:0.5em;"></textarea>
  <textarea id="pgn" placeholder="PGN" style="width:60%; height:150px; margin:0.5em;"></textarea>
</div>
<div>
  <button onclick="qs2pgn()" style="margin:0.5em; padding:0.5em 1em;">Convert QueryString → PGN</button>
  <button onclick="pgn2qs()" style="margin:0.5em; padding:0.5em 1em;">Convert PGN → QueryString</button>
</div>

Here's the board at move <input id="move_number" value="1." size=8>:
  <button onclick="stepReplay(-99);">[ |<&lt;= ] First</button>
  <button onclick="stepReplay( -1);">[ < ] Previous</button>
  <button onclick="stepReplay(  1);">Next [ > ]</button>
  <button onclick="stepReplay(999);">Last [ =&gt;>| ]</button>
<br/>
<chess-board position="start" draggable-pieces="true" style="width:50%;"></chess-board>
<textarea id=debug></textarea>
