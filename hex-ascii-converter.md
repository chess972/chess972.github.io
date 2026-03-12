# Unicode ↔ HEX Converter

This page lets you convert text between Unicode text and hexadecimal.

Latin-1 characters (including control sequences like 0a for linefeed, ...) are encoded as bytes between 00 and ff.
Unicode characters are encoded as 16-bit words, for example, 🤭 becomes d83e dd2d.

<!-- Raw HTML block inside Markdown -->
<div class="container" style="display:flex; justify-content:space-between; margin-top:1em;">
  <textarea id="ascii" placeholder="Enter text here..." style="width:45%; height:150px; margin:0.5em;"></textarea>
  <textarea id="hex" placeholder="Hex output will appear here..." style="width:45%; height:150px; margin:0.5em;"></textarea>
</div>

<div>
  <button onclick="asciiToHex()" style="margin:0.5em; padding:0.5em 1em;">Convert text → hex</button>
  <button onclick="hexToAscii()" style="margin:0.5em; padding:0.5em 1em;">Convert hex → text</button>
</div>

<script>
function asciiToHex() {
  const asciiText = document.getElementById("ascii").value;
  let hexText = "";
  for (let i = 0; i < asciiText.length; i++) {
    hexText += asciiText.charCodeAt(i).toString(16).padStart(2, "0") + " ";
  }
  document.getElementById("hex").value = hexText.trim();
}

function hexToAscii() {
  const hexText = document.getElementById("hex").value.trim();
  let asciiText = "";
  hexText.split(/\s+/).forEach(h => {
    if (h) asciiText += String.fromCharCode(parseInt(h, 16));
  });
  document.getElementById("ascii").value = asciiText;
}
</script>
