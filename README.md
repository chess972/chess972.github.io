# chess972.github.io
my web site

check it out at https://chess972.github.io/ :
* [ASCII to Hex converter](https://chess972.github.io/hex-ascii-converter.html): Convert ASCII (or actually, UTF-8) to hex and back. (That was just a test of using JavaScript in a github.io page.)

* [queryString to PGN converter](https://chess972.github.io/qs2pgn/): encode and decode a [chess game (PGN)](https://en.wikipedia.org/wiki/Portable_Game_Notation) to a compact query string in order to share your games via a short URL.\
  We figured out that the most compact way to encode a game is to encode move after move using just as many bits as needed to be able to encode all (pseudo)legal moves in the given position. (It is quite easy to make the list of these moves.)
  For example, in the initial position there are 20 moves possible, so 5 bits (allowing indices 0..31) are necessary and sufficient. Obviously we must agree on the order of moves. We use the same order as the python library `chess`.
  
*  ...
