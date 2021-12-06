// DADOS INICIAIS
let selectInterval; //roda a função de seleção enquanto o usuário não escolher um símbolo
let playing = false; //variável que verifica se o jogo acabou ou não
let playerTurn = { //informações inerentes a um jogador: turno, símbolo e cor
  turn: "",
  color: "",
  symbol: "",
};
let xWin = 0;
let oWin = 0;
let board = { //as posições do tabuleiro do jogo
  tl:"", tm:"", tr:"",
  ml:"", mm:"", mr:"",
  bl:"", bm:"", br:""
};

// Controle do Jogo
document.querySelector(".symbol-select").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Se o usuário tiver selecionado um símbolo, prepara o jogo
  if(document.getElementById("x-symbol").checked || document.getElementById("o-symbol").checked){
    xWin = 0;
    oWin = 0;
    setInstruction("Iniciando partida...", 400); 
    disableButtons(); 
    setOpponent(); 
    showField(); 
    setTimeout(() => {
      reset(); 
    }, 1200);
  } else {
    setInstruction("Por favor, selecione um símbolo para começar...", 400)
  }
  
});

// EVENTOS
document.querySelector(".reset").addEventListener("click", reset);
document.querySelectorAll(".field").forEach(field => {
  field.addEventListener("click", checkField);
});

// FUNÇÕES
function checkField(event) {
  let field = event.target.getAttribute("class").slice(-2);
  if(playing && board[field] === "") {
    board[field] = playerTurn.symbol;
    renderBoard();
    togglePlayer();
    if(playing)setInstruction(`A vez é do <span style="text-shadow: 1px 1px 3px ${playerTurn.color}">${playerTurn.turn}</span>`, 200);
    
  }
}

function togglePlayer(){
  let selectSymbol = document.querySelector('input[name="symbol"]:checked').value;
  if(playerTurn.symbol === "X") {
    playerTurn.symbol = "O";
    if(selectSymbol == "x-symbol"){
      playerTurn.turn = "jogador 2"
      playerTurn.color = "var(--secondary-shadow)";
    } else {
      playerTurn.turn = "jogador 1"
      playerTurn.color = "var(--primary-shadow)";
    }
  } else {
    playerTurn.symbol = "X";
    if(selectSymbol == "x-symbol"){
      playerTurn.turn = "jogador 1"
      playerTurn.color = "var(--primary-shadow)";
    } else {
      playerTurn.turn = "jogador 2"
      playerTurn.color = "var(--secondary-shadow)";
    }
  }
}

function reset(){
  // Define quem começa o jogo
  document.querySelectorAll(".field").forEach(field => field.style.color = "");
  let selectSymbol = document.querySelector('input[name="symbol"]:checked').value;
  let random = Math.floor(Math.random() * 2);

  if(selectSymbol == "x-symbol"){
    playerTurn.turn = (random === 0) ? "jogador 1" : "jogador 2";
    playerTurn.color = (random === 0) ? "var(--primary-shadow)" : "var(--secondary-shadow)";
    playerTurn.symbol = (random === 0) ? "X" : "O";
  } else {
    playerTurn.turn = (random === 0) ? "jogador 2" : "jogador 1";
    playerTurn.color = (random === 0) ? "var(--secondary-shadow)" : "var(--primary-shadow)";
    playerTurn.symbol = (random === 0) ? "X" : "O";
  }

  for(let i in board) {
    board[i] = "";
  }

  playing = true;

  setInstruction(`A vez é do <span style="text-shadow: 1px 1px 3px ${playerTurn.color}">${playerTurn.turn}</span>`, 200);

  renderBoard();
}

function renderBoard() {
  for(let i in board) {
    document.querySelector(`.game .${i}`).innerHTML = board[i];
  }
  checkGame();
}

function checkGame() {
  if(checkWinner("X")) {
    setInstruction(`O <span style="text-shadow: 1px 1px 3px ${playerTurn.color}">${playerTurn.turn}</span> venceu!`, 200);
    xWin++;
    if (xWin <= 9) {
      document.querySelector(".small-wrapper").firstElementChild.querySelector(".win-count").innerHTML = `00${xWin}`;
    } else if (xWin <= 99) {
      document.querySelector(".small-wrapper").firstElementChild.querySelector(".win-count").innerHTML = `0${xWin}`;
    } else {
      document.querySelector(".small-wrapper").firstElementChild.querySelector(".win-count").innerHTML = `${xWin}`;
    }
    playing = false;
  } else if(checkWinner("O")) {
    setInstruction(`O <span style="text-shadow: 1px 1px 3px ${playerTurn.color}">${playerTurn.turn}</span> venceu!`, 200);
    oWin++;
    if (oWin <= 9) {
      document.querySelector(".small-wrapper").lastElementChild.querySelector(".win-count").innerHTML = `00${oWin}`;
    } else if (oWin <= 99) {
      document.querySelector(".small-wrapper").lastElementChild.querySelector(".win-count").innerHTML = `0${oWin}`;
    } else {
      document.querySelector(".small-wrapper").lastElementChild.querySelector(".win-count").innerHTML = `${oWin}`;
    }
    playing = false;
  } else if(fullBoard()){
    setInstruction(`Empate!`, 200);
    playing = false;
  }
}

function checkWinner(player) {
  let pos = [
    "tl, tm, tr",
    "ml, mm, mr",
    "bl, bm, br",
    "tl, ml, bl",
    "tm, mm, bm",
    "tr, mr, br",
    "tl, mm, br",
    "tr, mm, bl"
  ];

  for(let i in pos) {
    let pFields = pos[i].split(", ");
    let hasWon = pFields.every((item) => (board[item] === player));
    if(hasWon) {
      for(let j = 0; j < pFields.length; j++) {
        document.querySelector(`.field.${pFields[j]}`).style.color = playerTurn.color;
      }
      return true;
    }
  }

  return false;
}

function fullBoard() {
  for(let i in board){
    if(board[i] === "") return false
  }
  return true;
}

// Seleção do símbolo do jogador
function symbolSelect() {
  if(document.getElementById("x-symbol").checked || document.getElementById("o-symbol").checked){
    let selectSymbol = document.querySelector('input[name="symbol"]:checked').value;
    switch(selectSymbol){
      case "x-symbol":
        document.querySelector("#o-select .select").classList.remove("active");
        document.querySelector(".small-wrapper").lastElementChild.classList.remove("active");
        document.querySelector("#x-select .select").classList.add("active");
        document.querySelector(".small-wrapper").firstElementChild.classList.add("active");
      break
  
      case "o-symbol":
        document.querySelector("#x-select .select").classList.remove("active");
        document.querySelector(".small-wrapper").firstElementChild.classList.remove("active");     
        document.querySelector("#o-select .select").classList.add("active");
        document.querySelector(".small-wrapper").lastElementChild.classList.add("active");
      break
    }
  }
}

// Arruma o oponente
function setOpponent() {
  let selectSymbol = document.querySelector('input[name="symbol"]:checked').value;
  switch(selectSymbol){
    case "x-symbol":
      document.querySelector("#x-select .select").classList.remove("opponent");
      document.querySelector(".small-wrapper").firstElementChild.classList.remove("opponent");
      document.querySelector("#o-select .select").classList.add("opponent");
      document.querySelector(".small-wrapper").lastElementChild.classList.add("opponent");
      document.querySelector(".cross").style.textShadow = "0 0 5px var(--primary-shadow)";
      document.querySelector(".circle").style.textShadow = "0 0 5px var(--secondary-shadow)";
    break

    case "o-symbol":
      document.querySelector("#o-select .select").classList.remove("opponent");
      document.querySelector(".small-wrapper").lastElementChild.classList.remove("opponent");  
      document.querySelector("#x-select .select").classList.add("opponent");
      document.querySelector(".small-wrapper").firstElementChild.classList.add("opponent");      
      document.querySelector(".circle").style.textShadow = "0 0 5px var(--primary-shadow)";
      document.querySelector(".cross").style.textShadow = "0 0 5px var(--secondary-shadow)";
    break
  }
}

// Desabilita os botões
function disableButtons() {
  // Para a chamada do intervalo e lebera o id da variável
  clearInterval(selectInterval);
  selectInterval = null;

  // Desabilita os input:radios e o botão
  document.getElementById("x-symbol").disabled = true;
  document.getElementById("o-symbol").disabled = true;
  document.querySelector(".symbol-select button").style.display = "none";

  // Desabilida o efeito de hover e normaliza os ponteiros
  let inputs = document.querySelectorAll(".symbols input");
  let selectors = document.querySelectorAll(".select");

  for(let i = 0; i < selectors.length; i++){
    selectors[i].classList.remove("hover");
    selectors[i].style.cursor = "unset"
    inputs[i].style.cursor = "unset";
  }
}

// Mostrar Tabuleiro e arruma as tags
function showField() {

  // Expande as tags de jogadores
  document.querySelector(".wrapper .extend").style.flex = "auto";

  // Expande os textos da tela
  let selectSymbol = document.querySelector('input[name="symbol"]:checked').value;
  setTimeout(() => {
    switch(selectSymbol){
      case "x-symbol":
        document.querySelector("#x-select .tag").innerHTML = 
        `<div>J</div>
        <div>O</div>
        <div>G</div>
        <div>A</div>
        <div>D</div>
        <div>O</div>
        <div>R</div>
        <div>-</div>
        <div>1</div>`
        document.querySelector("#x-select .tag").style.padding = "5px 4px 15px";
        document.querySelector("#x-select .tag").style.height = "180px";
        document.querySelector("#x-select .tag").style.border = "4px double var(--primary-color)";
        document.querySelector("#x-select .tag").style.borderTop = "none";
  
        document.querySelector("#o-select .tag").innerHTML = 
        `<div>J</div>
        <div>O</div>
        <div>G</div>
        <div>A</div>
        <div>D</div>
        <div>O</div>
        <div>R</div>
        <div>-</div>
        <div>2</div>`
        document.querySelector("#o-select .tag").style.padding = "5px 4px 15px";
        document.querySelector("#o-select .tag").style.height = "180px";
        document.querySelector("#o-select .tag").style.border = "4px double var(--secondary-color)";
        document.querySelector("#o-select .tag").style.borderTop = "none";
      break
  
      case "o-symbol":
        document.querySelector("#o-select .tag").innerHTML = 
        `<div>J</div>
        <div>O</div>
        <div>G</div>
        <div>A</div>
        <div>D</div>
        <div>O</div>
        <div>R</div>
        <div>-</div>
        <div>1</div>`
        document.querySelector("#o-select .tag").style.padding = "5px 4px 15px";
        document.querySelector("#o-select .tag").style.height = "180px";
        document.querySelector("#o-select .tag").style.border = "4px double var(--primary-color)";
        document.querySelector("#o-select .tag").style.borderTop = "none";
  
        document.querySelector("#x-select .tag").innerHTML = 
        `<div>J</div>
        <div>O</div>
        <div>G</div>
        <div>A</div>
        <div>D</div>
        <div>O</div>
        <div>R</div>
        <div>-</div>
        <div>2</div>`
        document.querySelector("#x-select .tag").style.padding = "5px 4px 15px";
        document.querySelector("#x-select .tag").style.height = "180px";
        document.querySelector("#x-select .tag").style.border = "4px double var(--secondary-color)";
        document.querySelector("#x-select .tag").style.borderTop = "none";
      break
    }
    document.querySelector(".instructions").style.marginBottom = "55px";
    document.querySelector(".small-wrapper").style.zIndex = "0";
    document.querySelector(".small-wrapper").style.visibility = "visible";
    document.querySelector(".small-wrapper").style.opacity = "1";
    document.querySelector(".small-wrapper").style.marginTop = "375px";
    document.querySelector(".reset").style.visibility = "visible";
    document.querySelector(".reset").style.opacity = "1";
    document.querySelectorAll(".win-tracker").forEach(winTracker => {
      winTracker.style.visibility = "visible";
      winTracker.style.opacity = "1";
    });
    document.querySelector(".small-wrapper").firstElementChild.querySelector(".win-count").innerHTML = `000`;
    document.querySelector(".small-wrapper").lastElementChild.querySelector(".win-count").innerHTML = `000`;
    document.querySelector("footer").style.marginTop = "115px";
  
    // Mostra o tabuleiro
    let game = document.querySelector(".game");
    game.style.visibility = "visible";
    game.style.opacity = "1";
    game.style.zIndex = "0";
  }, 630);
}

// Atualiza a mensagem de instrução
function setInstruction(msg, time) {
  document.querySelector(".instructions").style.opacity = 0;
  setTimeout(() => {
    document.querySelector(".instructions").innerHTML = msg;
    document.querySelector(".instructions").style.opacity = 1;
  }, time);
}

selectInterval = setInterval(symbolSelect, 10);