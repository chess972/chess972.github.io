---
---
# queryString to PGN converter

encode and decode a chess game (PGN) to a compact query string in order to share your games via a short URL of the form http://chess972.github.io/qs2pgn?q=ThatQueryString.

We figured out that the most compact way to encode a game is to encode move after move using just as many bits 
as needed to be able to encode all (pseudo)legal moves in the given position. (It is quite easy to make the list of these moves even "by hand", but we use `chess.js`.)

For example, in the initial position there are 20 moves possible, so 5 bits (allowing indices 0..31) are necessary and sufficient. 
Obviously we must agree on the order of moves, for which we propose different choices: the one created by the JS library `chess.js`, possibly sorted alphabetically, or the one used by `python-chess` (pawns, then Na6, Nc6, Nf6 Nh6). [To do: give more details.]

We prefix this binary move list with a few leading bits specifying the version of the encoding (essentially move ordering, but also anticipating other possible improvements! :-), the result of the game (1-0, 0-1, 1/2-1/2 or * = unfinished) and the total number of moves encoded.

In the end, we convert this binary data to a query string using the base64 encoding, 
which uses one character among [0-9A-Za-Z-_] for every 6 bits.
