/* ----------------------------- Player Object START */ 
class Player{
  constructor(var1, var2, var3){
    this.name = var1;
    this.score = var2;
    this.team = var3;
  };

  shoot(){
    for (let i = 0; i < 3; i++) {
      let chance = Math.random() * 100;
      if(chance >= 60){
        this.score++;
      }
    }
    return;
  }
}
/* Player Object END ----------------------------- */ 

/* ----------------------------- Game Function Variables START */ 
const interval = 1000/60;
let lastTimerCheck = 0;
let millisLastElapsed = 0;
let millisElapsed = 0;
lastTimerCheck = Date.now();
setInterval(()=>{
  millisElapsed = Date.now() - lastTimerCheck + millisLastElapsed;
},millisLastElapsed);


const trophy = String.fromCodePoint(0x1F3C6); // 🏆
const fire = String.fromCodePoint(0x1F3C0); // 🏀
const basketball = String.fromCodePoint(0x1F525); // 🔥
const first_place = String.fromCodePoint(0x1f947); // 🥇
const second_place = String.fromCodePoint(0x1f948); // 🥈
const third_place = String.fromCodePoint(0x1f949); // 🥉
const green_circle = String.fromCodePoint(0x1F7E2); // 🟢

let players = [];
let placing = [];
let tied = [];
let win = [];
/* Game Function Variables END ----------------------------- */

/* ----------------------------- Event Listeners START */ 
const player_list = document.querySelector("#player_list");
const player_table = player_list.querySelector("table");
const add_player = document.querySelector("#add_player");
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.style.setProperty("--sizeState","big");
  card.addEventListener("click", () => {
    card.classList.toggle("card-focus");
  });
});

const add_player_btn = add_player.querySelector("#add_player button");
add_player_btn.addEventListener("click", () => {
  takePlayers();
});
const start_btn = document.querySelector(".start-button button");
start_btn.addEventListener("click", () => {
  if(players.length > 1){
    gameStart();
    buttonDisapper();
  } else if (players.length == 1){
    alert("Need more players.");
  } else {
    alert("No players. Can't start. 2 should be enough.");
  }
});
/* Event Listeners END ----------------------------- */ 

/* =================================== Game Backend START */ 
/* ----------------------------- Shoot START */
function gameShooting(var1){
  var1.forEach(element => {
    element.shoot();
  });
}
/* Shoot END ----------------------------- */

/* ----------------------------- Player Sort START */
function playerSort(input,output){
  let scores = scoreSort(input);
  let highest_score = Math.max(...scores);
  scores.forEach((score, i) => {
    if(score == highest_score){
      let e = new Player();
      Object.assign(e,input[i]);
      output.push(e);
    }
  });
  if(output.length > 1){
    console.log(`Tied Players:`);
    output.forEach(e => {
      console.log(e.name);
    });
    console.log("");
  }
}
/* Player Sort END ----------------------------- */

/* ----------------------------- Player Tiebreaker START */
function tieBreaker(input){
  input.forEach(player => {
    player.score = 0;
  });
  gameShooting(input);
}
/* Player Tiebreaker END ----------------------------- */

/* ----------------------------- Player Placing START */
function placePlayer(input){
  if(input.length == 1){
    console.log(`Round winner is ${input[0].name}.`);
  }
  placing.push(input[0]);
  players.forEach((player,i) => {
    if(input[0].name == player.name){
      players.splice(i,1);
    }
  });
  input.splice(0,1);
}
/* Player Placing END ----------------------------- */

/* ----------------------------- Player Score Sorting START */
function scoreSort(input){
  let scores = [];
  input.forEach(player => {
    scores.push(player.score);
  });
  return scores;
}
/* Player Score Sorting END ----------------------------- */

/* ----------------------------- Main Game Function START */
function gameStart(){
  let start = true;
  let round = 0;
  let tiebreaker_round = 0;
  let tiebreaker_msg = ``;
  let reshoot = false
  let nxt_round = false;
  do {
    if(tied.length > 1){
      tiebreaker_round++;
    }
    if(tiebreaker_round > 0){
      tiebreaker_msg = `${fire} Tie Breaker ${tiebreaker_round}`
    }
    console.log(`=======================================
${basketball} Round ${round + 1} ${tiebreaker_msg}
=======================================`);
    if(start == true){
      gameShooting(players);
      start = false;
    }
    console.log("Remaining Players:");
    showRemaining(players);
    if(tied.length < 2) {
      playerSort(players, tied);
    } else {
      tieBreaker(tied);
      console.log("Tie Breaker Scores:");
      showRemaining(tied)
      playerSort(tied, win);
      reshoot = true;
      tied = win;
      win = [];
    }
    if(win.length == 1){
      placePlayer(win);
      tiebreaker_round = 0;
      tiebreaker_msg = ``;
      nxt_round = true;
    } else if (tied.length == 1) {
      placePlayer(tied);
      tiebreaker_round = 0;
      tiebreaker_msg = ``;
      nxt_round = true;
    }
    console.log("\n\n\n");
    if(nxt_round == true && reshoot == true && tied.length == 0){
      round++;
      nxt_round = false;
      reshoot = false; 
    }
  } while (players.length > 0);
  showPlacing();
}
/* Main Game Function END ----------------------------- */
/* Game Backend END =================================== */ 

/* =================================== Game Frontend START */ 
/* ----------------------------- Show Winners START */
function showPlacing(){
  console.log(`=======================================
${trophy} Rankings:
=======================================`);
  let place_msg = ``;
  let emoji;
  placing.forEach((player,i) => {
    let num = i+1;
    let place = String(num).slice(-1);
    switch (place) {
      case "1":
        place_msg = `${place}st`;
        emoji = first_place;
        break;
      case "2":
        place_msg = `${place}nd`;
        emoji = second_place;
        break;
      case "3":
        place_msg = `${place}rd`;
        emoji = third_place;
        break;
      default:
        place_msg = `${place}th`;
        emoji = "  ";
        break;
    }
    console.log(`${emoji} ${player.name}: ${place_msg} place.`);
  });
}
/* Show Winners END ----------------------------- */

/* ----------------------------- Player Round Show START */
function showRemaining(input){
  let emoji;
  let scores = scoreSort(input);
  let highest_score = Math.max(...scores);
  input.forEach(player => {
    if(player.score == highest_score){
      emoji = green_circle;
    } else {
      emoji = "  ";
    }
    console.log(`${emoji} ${player.name} has a score of: ${player.score}`);
  });
  console.log("");
}

/* Player Round Show END ----------------------------- */
function createPlayerNode(player_name){
  let player_row = document.createElement("tr");
  let name_td = document.createElement("td");
  name_td.innerHTML = player_name;
  let score_td = document.createElement("td");
  score_td.classList.toggle("score_hide");
  let delete_td = document.createElement("td");
  delete_td.classList.toggle("delete_hide");

  player_table.querySelector("tbody").append(player_row);
  player_row.append(name_td);
  player_row.append(score_td);
  player_row.append(delete_td);
}

/* ----------------------------- Take Players START */
function takePlayers(){
  let add_input = document.querySelector("#add_player input");
  let input_val = add_input.value;
  if (!input_val.split(" ").join("") == ""){
    let new_player = new Player(input_val, 0, "Blue Team");
    players.push(new_player);
    createPlayerNode(input_val);
    add_input.value = "";
  } else {
    alert("Please input a proper name.");
  }
}
/* Take Players END ----------------------------- */

/* ----------------------------- Hide Player Add and Buttons START */
function gameStartHide(){
  add_player.classList.toggle("wipe-hide");
  start_btn.classList.toggle("hide");
}
setTimeout(() => {
  gameStartHide();
}, 1000);
/* Hide Player Add and Buttons END ----------------------------- */

/* ----------------------------- Restart Game START */
function restartGame(){

}
/* Restart Game END ----------------------------- */
/* Game Frontend END =================================== */ 