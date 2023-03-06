let rs = require("readline-sync");

const validInt = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const validLet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

let gridSize = 10;

const shipLegend = [
   {
      count: 1,
      size: 2,
   },
   {
      count: 2,
      size: 3,
   },
   {
      count: 1,
      size: 4,
   },
   {
      count: 1,
      size: 5,
   },
];

let shipCount = shipLegend.reduce((acc, cv) => cv.count + acc, 0);

let running = true;
while (running) {
   rs.keyIn("Press any key to start the game.");

   let grid = genGrid(gridSize);
   let ships = genList(shipLegend);
   let placedGrid = [];
   for (const ship of ships) {
      placedGrid = genShips(grid, ship.status);
   }

   let destroyed = 0;
   let loc = "";
   while (destroyed !== shipCount) {
      if (destroyed < shipCount) {
         loc = input();
      }
      let hit = hitMiss(placedGrid, loc);
      if (hit[1]) {
         destroyed += shipLife(hit[0], ships);
         console.log(`Hit. ${shipCount - destroyed} ships remaining.`);
      }
      printGrid(placedGrid);
   }

   running = rs.keyInYNStrict(
      "You have destroyed all battleships. Would you like to play again?"
   );
   if (running === false) {
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

function genList(arr) {
   let newArr = [];
   for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].count; j++) {
         newArr.push({
            id: newArr.length,
            status: genStatus(arr[i].size, newArr.length),
         });
      }
   }
   return newArr;
}

function genStatus(length, id) {
   let arr = [];
   for (let i = 0; i < length; i++) {
      arr[i] = {
         id: id,
         hit: false,
      };
   }
   return arr;
}

function genShips(grid, status) {
   let randOrientation = ["vertical", "horizontal"];
   let randRow = Math.floor(Math.random() * gridSize);
   let randColumn = Math.floor(Math.random() * gridSize);
   let orientation =
      randOrientation[Math.floor(Math.random() * randOrientation.length)];
   if (
      (orientation === "horizontal" && randRow + status.length > gridSize) ||
      (orientation === "vertical" && randColumn + status.length > gridSize)
   ) {
      return genShips(grid, status);
   }
   if (orientation === "horizontal") {
      for (let i = 0; i < status.length; i++) {
         if (grid[randRow + i][randColumn] !== 0) {
            return genShips(grid, status);
         }
      }
      for (let i = 0; i < status.length; i++) {
         grid[randRow + i][randColumn] = status[i];
      }
   } else if (orientation === "vertical") {
      for (let i = 0; i < status.length; i++) {
         if (grid[randRow][randColumn + i] !== 0) {
            return genShips(grid, status);
         }
      }
      for (let i = 0; i < status.length; i++) {
         grid[randRow][randColumn + i] = status[i];
      }
   }
   return grid;
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

function hitMiss(arr, loc) {
   let r = loc.charCodeAt(0) - 97;
   let c = Number(loc.substring(1)) - 1;
   if (arr[r][c].hit === false) {
      arr[r][c].hit = true;
    //   console.table(arr);
      return [arr[r][c].id, true];
   } else if (arr[r][c] === 0) {
      console.log("You have missed!");
      arr[r][c] = -1;
   } else {
      console.log("You have already picked this location. Miss!");
   }
//    console.table(arr);
   return false;
}

function printGrid(arr) {
   let header = "  ";
   for (let i = 0; i < validInt.length; i++) {
      header += validInt[i] + " ";
   }
   console.log(header);

   let row = "";
   for (let i = 0; i < validLet.length; i++) {
      row += validLet[i].toUpperCase() + " ";
      for (let j = 0; j < gridSize; j++) {
         if (arr[i][j].hit) {
            row += "X ";
         } else if (arr[i][j] === -1) {
            row += "O ";
         } else {
            row += "* ";
         }
      }
      console.log(row);
      row = "";
   }
}

function shipLife(id, ships) {
   let ship = ships.find((ship) => ship.id === id);
   ({ status: status } = ship);
   for (let point of status) {
      if (point.hit === false) {
         return 0;
      }
   }
   return 1;
}
