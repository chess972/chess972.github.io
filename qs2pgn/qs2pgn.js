/*** QueryString ↔ PGN Converter JavaScript (c) 2025-2026 by MFH

In the main file, 
we have a <script type="module"> which imports lit & chess:

  import "https://unpkg.com/lit?module";
  // window.lit = Lit; // expose globally if needed
  import "https://unpkg.com/chessboard-element?module";
  import { Chess } from "https://unpkg.com/chess.js/dist/esm/chess.js";
  window.Chess = Chess; // in case we'd want to use it elsewhere
***/
  const game = new Chess();
  const replay = new Chess();

  // NOTE : use var not const to make these globally available (esp. in onClick=...)
  var prefixCheckbox = document.getElementById("prefixCheckbox");
  var baseUrlInput = document.getElementById("baseUrl");
  // const resetBtn = document.getElementById("resetBtn");
  // const chessQRBtn = document.getElementById("chessQRBtn");
  // const URL = window.location.href; // full URL with QS
  var BaseUrl = window.location.origin + window.location.pathname;
  // Initialize input with current base URL
  baseUrlInput.value = BaseUrl;

function checkboxChanged() { // uses global var QS only defined later
  if (prefixCheckbox.checked && ! QS.value.startsWith("http"))
    QS.value = baseUrlInput.value + QS.value; 
  if (! prefixCheckbox.checked && QS.value.startsWith("http"))
    QS.value = QS.value.includes("?") ? QS.value.substring(QS.value.indexOf("?")) : "?q=" ; 
}
/*****
    // Reset button → restore current page's base URL
    resetBtn.addEventListener("click", () => {
      baseUrlInput.value = BaseUrl;
    });   // chessQR button → set to http://chessqr.com/
******/
  var QS = document.getElementById("qs");
  var PGN = document.getElementById("pgn");
  var queryString = window.location.search;// e.g.: "?foo=1&bar=2"
  var params = new URLSearchParams(queryString);
  if (queryString) { QS.value = queryString; checkboxChanged(); }
  var Encoding = document.getElementById('encoding');
QS.addEventListener("change", () => {
    const qs = new URLSearchParams(QS.value), q = qs.get('q');
    if ( q ) Encoding.value = q.slice(0,2);
});

function base64ToBitstream(s) {// translate base64 string to binary string
  let bits = "";
  for (const c of s) bits += alphabet.indexOf(c).toString(2).padStart(6, "0");
  return bits;
}
const PIECES = "pnbrqk"; // for sorting of moves
function moveList(game){// return SAN move list sorted according to the chosen encoding
  const turn = game.turn()=='w' ? 1 : -1; // flips order of some sorting
  switch ( Encoding.value ) {
    case "02": // case insensitive alphabetic sort (according to SAN value)
      return game.moves().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));  
    case "02": // experimental
      return game.moves({verbose: true}).sort((a, b) =>
        a.piece != b.piece ? PIECES.indexOf(a.piece) - PIECES.indexOf(b.piece) :
        // NOTE: chess.js uses SQUARES=[a8...h8, ..., a1...h1] !
        (a.from != b.from ? Chess.SQUARES.indexOf(b.from) - Chess.SQUARES.indexOf(a.from) : 
          Chess.SQUARES.indexOf(b.to) - Chess.SQUARES.indexOf(a.to) 
         )*turn 
        ).map( move => move.san );
    case "01": // ChessQR '01' encoding // not implemented yet 
    case "00": // Python-chess ordering // to be double-checked
      return game.moves({verbose: true}).sort((a, b) =>
        a.piece != b.piece ? PIECES.indexOf(a.piece) - PIECES.indexOf(b.piece) :
        // we want:              v-- g6-g7 comes after h4-h6
        // if turn = BLACK: ... f5, h6, h5, g5, Nc6, Na6, Nh6, Nf6, Bg7, Bh6 ...
        a.from != b.from ? Chess.SQUARES.indexOf(b.from) - Chess.SQUARES.indexOf(a.from) : 
        // otherwise sort first according to FROM, then TO square; ranks come before files, and reversed for BLACK.
        (a.lan[1] != b.lan[1] ? a.lan[1] - b.lan[1] :
         a.lan[0] != b.lan[0] ? a.lan[0] - b.lan[0] :
         a.lan[3] != b.lan[3] ? a.lan[3] - b.lan[3] : a.lan[2] - b.lan[2] )*turn 
        ).map( move => move.san );     
  }// default: no sorting; use chess.js default order
  return game.moves();
}
function qs2pgn() {
  const params = new URLSearchParams(QS.value);
  const whiteName = params.get("w");
  const blackName = params.get("b");
  encoding = params.get("q").slice(0,2);
  const bitstream = base64ToBitstream(params.get("q").slice(2));  // skip "?q=01"
  const result = parseInt( bitstream.slice( 0, 2 ), 2 );
  const half_moves = parseInt( bitstream.slice(2, 2+10 ), 2 );
  game.reset();
  for ( let pos = 12; pos < bitstream.length && !game.isGameOver(); ) {
    const legalMoves = moveList(game);
    if (legalMoves.length == 0) { 
      debug("No more legal moves before end of game"); break;//SHOULD NOT HAPPEN
    }
    const bits = Math.ceil(Math.log2( legalMoves.length ));
    if ( pos + bits > bitstream.length ) {  // incomplete final chunk 
      debug("Exhausted bitstream before end: needed "+bits
            +" bits, but left is only "+bitstream.slice(pos)); break;
    }
    const index = parseInt( bitstream.slice(pos, pos + bits), 2);
    debug( "move index "+index+" in "+legalMoves )
    if (index >= legalMoves.length) {  // incomplete final chunk 
      debug( "stopping at pos="+pos+"/"+bitstream.length+", index="+index+" not valid!" ); break;
    }
    pos += bits;
    const move = legalMoves[ index ];
    if (!move) break; // corrupted or truncated stream
    game.move(move);
  }
  debug( "Done: read "+game.history().length+" out of "+half_moves+" expected half moves");
  PGN.value = game.pgn();
  stepReplay(-99);
  if ( result && extractResultFromPGN(PGN.value) == "*" ) {
    const result_text = result==1 ? "1-0" : result==2 ? "0-1" : "1/2-1/2";
    //now insert this in [Result: "..."]
    PGN.value = PGN.value.replace( /\[Result\s+"[^"]*"\]/, `[Result "${result_text}"]` );
  }
  if (whiteName) PGN.value = PGN.value.replace( /\[White\s+"[^"]*"\]/, `[White "${whiteName}"]` );
  if (blackName) PGN.value = PGN.value.replace( /\[Black\s+"[^"]*"\]/, `[Black "${blackName}"]` );
}

// our custom Base64 encoding
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";  
function pgn2qs() {
  let qs = "?q=01", bitQueue = ""; //result
  const moveList = movesToIndices(); // the first two "indices" give the result and # moves
  for (const encoded of moveList) {
    bitQueue += encoded.toString(2).slice(1); // remove leading bit
    while (bitQueue.length >= 6) {
       qs += alphabet[ parseInt( bitQueue.slice(0, 6), 2) ];
       bitQueue = bitQueue.slice(6);
    }
  }
  if (bitQueue.length > 0) {
     qs += alphabet[ parseInt( bitQueue.padEnd(6, "0"), 2) ];
  }
  QS.value = qs;
}
function extractResultFromPGN(pgn) {
  const match = pgn.match(/\[Result\s+"([^"]+)"\]/);
  return match ? match[1] : "*";
}
/* Convert the `game` to a list of numbers which represent
 * (the index of each move within the move list) + min { 2^N > number of possible moves }.
 * The two first items of the list code the result and the total number of half-moves.
 * result = 4 + (0 if unfinished else 1 if 1-0 else 2 if 0-1 else 3 [if 1/2-1/2]).
 */
function movesToIndices() {
  //const game = new Chess();// already there as global variable
  //game.load_pgn(pgn);
  const moves = game.history();  // SAN moves
  let result = !game.isGameOver() ? 0 : !game.in_checkmate() ? 3
             : game.turn()=="b" ? 1 : 2; // 0-1 / 1-0
  if (!result) switch ( extractResultFromPGN(PGN.value) ) {
    case "1-0": result = 1; break;
    case "0-1": result = 2; break;
    case "1/2-1/2": result = 3; break;
  }
  const indices = [ 4 + result, 2**10 + moves.length ];
  replay.reset(); // const replay = new Chess();    // fresh game to replay
  for (const move of moves) {
    const legalMoves = moveList(replay); // can be just SAN, or Move objects
    const index = legalMoves.indexOf(move);
    if (index === -1) {
      throw new Error("Move not found in legal move list: " + move);
    }
    indices.push( 2**Math.ceil(Math.log2(legalMoves.length)) + index );
    replay.move(move);
  }
  return indices;
}


var board = document.querySelector("chess-board"); // id="board" only needed if more than one
var debugArea = document.getElementById("debug");

function debug(str) { debugArea.value += str+"\n"; }

// Listen for piece drops
board.addEventListener("drop", (event) => {
      let move;
      try { move = replay.move({ from: event.detail.source, to: event.detail.target,
                promotion: "q" // always promote to queen for simplicity
            });
      } catch(err) { return"snapback"; }
      
      board.setPosition(replay.fen());
      if (!move) return; // move was illegal: nothing happens
      const currentIndex = replay.history().length-1;
      debug("currentIndex = "+currentIndex);
      const moves = game.history();
      if (moves.length > currentIndex && move.san != moves[currentIndex])
        /* a different move was played: rewind */
        while (game.history().length > currentIndex) game.undo();
      if (game.history().length <= currentIndex) {
        if (game.history().length < currentIndex) 
          debug("game < current shouldn't happen");
        game.move(move);
        PGN.value = game.pgn();
      }
      highlightMove(currentIndex+1);
    });
  
// Helper: set board to position at index
function stepReplay(step) { /* step = -1 : back ; step > 0 : forward ; else (0 and < -1): reset */
      let current = replay.history().length;
      const moves = game.history({ verbose: true });
      if (step == -1) {
        if (current) { replay.undo(); current -= 1; }
      } else if (step < 1) { replay.reset(); current = 0; }
      else while (step > 0 && current < moves.length) {
        step -= 1; replay.move(moves[current]); current += 1;
      } 
      debug("current = "+current);
      board.setPosition(replay.fen());
      if (current) highlightMove(current);
    }
// Highlight current move in PGN textarea
function highlightMove(index) { /* note: index starts at 1 */
      const moves = game.history();
      if (index === 0) {
        PGN.setSelectionRange(0, 0);
        return;
      }
      // Find substring of PGN up to that move
      // TODO/FIXME: the game could have "the same move" multiple times
      const pgnText = game.pgn();
      const moveStr = moves[index - 1]; // last played move
      const pos = pgnText.indexOf(moveStr);
      if (pos !== -1) {
        PGN.focus();
        PGN.setSelectionRange(pos, pos + moveStr.length);
      }
}
