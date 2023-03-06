let rs = require("readline-sync");

const validInt = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const validLet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

let gridSize = 10;

const shipCount = 2;

let replay = true;

while (replay) {
   rs.keyIn("Press any key to start the game.");

   let grid = genGrid(gridSize);
   let placedGrid = genShips(grid);

   let hit = 0;
   let loc = "";
   while (hit < shipCount) {
      if (hit < shipCount) {
         loc = input();
      }
      hit += hitMiss(placedGrid, loc, `${shipCount - hit - 1} remaining.`);
   }

   replay = rs.keyInYNStrict("You have destroyed all battleships. Would you like to play again?");
   if (replay === false) {
      console.log("Thanks for playing!");
   }
}

function genGrid(num) {
   let arr = [];
   for (let i = 0; i < num; i++) {
      arr[i] = [];
      for (let j = 0; j < num; j++) {
         arr[i][j] = 0;
      }
   }
   return arr;
}

function genShips(arr) {
   for (let i = 0; i < 2; i++) {
      let randRow = Math.floor(Math.random() * gridSize);
      let randColumn = Math.floor(Math.random() * gridSize);
      if (arr[randRow][randColumn] === 1) {
         i--;
      } else {
         arr[randRow][randColumn] = 1;
      }
   }
   return arr;
}

function input() {
   let str = rs.question("Enter a location to strike ie 'A2' [A-J][1-10] ");
   if (
      str !== "" &&
      validLet.includes(str[0].toLowerCase()) &&
      validInt.includes(str.substring(1))
   ) {
      return str;
   }
   console.log("Invalid input- try again.");
   return input();
}

function hitMiss(arr, loc, str) {
   let r = loc.charCodeAt(0) - 97;
   let c = Number(loc.substring(1)) - 1;
   if (arr[r][c] === 1) {
      console.log(`Hit. You have sunk a battleship. ${str}`);
      arr[r][c] = 2;
      // console.log(arr);
      return 1;
   } else if (arr[r][c] === 0) {
      console.log("You have missed!");
      arr[r][c] = -1;
   } else {
      console.log("You have already picked this location. Miss!");
   }
   // console.log(arr);
   return 0;
}
