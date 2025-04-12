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

const trophy = String.fromCodePoint(0x1F3C6); // 🏆
const fire = String.fromCodePoint(0x1F3C0); // 🏀
const basketball = String.fromCodePoint(0x1F525); // 🔥
const first_place = String.fromCodePoint(0x1f947); // 🥇
const second_place = String.fromCodePoint(0x1f948); // 🥈
const third_place = String.fromCodePoint(0x1f949); // 🥉
const green_circle = String.fromCodePoint(0x1F7E2); // 🟢

const player1 = new Player("Johnson McBard",0,"Black Bulls");
const player2 = new Player("Bron Cain",0,"Black Bulls");
const player3 = new Player("Shaun Lane",0,"Black Bulls");
const player4 = new Player("Lebon Zane",0,"White Whales");
const player5 = new Player("Tom Cory",0,"White Whales");
const player6 = new Player("Kevin Hart",0,"White Whales");
const player7 = new Player("Jame Hard",0,"Black Bulls");
const player8 = new Player("Wussell Westbwook",0,"White Whales");

let players = [player1,player2,player3,player4,player5,player6,player7,player8];
let placing = [];
let tied = [];
let win = [];

function gameShooting(var1){
  var1.forEach(element => {
    element.shoot();
  });
}

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

function tieBreaker(input){
  input.forEach(player => {
    player.score = 0;
  });
  gameShooting(input);
}

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

function scoreSort(input){
  let scores = [];
  input.forEach(player => {
    scores.push(player.score);
  });
  return scores;
}

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

function showPlacing(){
  console.log(`=======================================
${trophy} Rankings:
=======================================`);
  let place_msg = ``;
  let emoji;
  placing.forEach((player,i) => {
    num = i+1;
    place = String(num).slice(-1);
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



gameStart();


const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.style.setProperty("--sizeState","big");
  card.addEventListener("click", () => {
    card.classList.toggle("card-focus");
  });
});