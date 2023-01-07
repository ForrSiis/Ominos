/*
Omino class

- class for tetrominos

hosted @ https://replit.com/@Amuseum/TetraShmup#code/main.js
played @ https://TetraShmup.amuseum.repl.co
//*/

Math.d2r = function (degrees) {
   return degrees * Math.PI / 180;
}

function rotatePoint(center, angle, point) {
   //console.log(center, angle, point);
   let newPoint = {};

   let sin = Math.sin(Math.d2r(angle));
   let cos = Math.cos(Math.d2r(angle));

   // translate point back to origin
   newPoint.x = point.x - center.x;
   newPoint.y = point.y - center.y;

   // rotate point
   let newX = newPoint.x * cos - newPoint.y * sin;
   let newY = newPoint.x * sin + newPoint.y * cos;

   // translate point back
   newPoint.x = newX + center.x;
   newPoint.y = newY + center.y;
   //console.log(newPoint);

   return newPoint;
}

export default class Omino {
   static Shapes = {
      // I
      "i": {
         rows: 4,
         cols: 1,
         grid: '1111'
      },

      // S
      "s": {
         rows: 2,
         cols: 3,
         grid: '011110'
      },

      // Z
      "z": {
         rows: 2,
         cols: 3,
         grid: '110011'
      },

      // L
      "l": {
         rows: 3,
         cols: 2,
         grid: '101011'
      },

      // J
      "j": {
         rows: 3,
         cols: 2,
         grid: '010111'
      },

      // T
      "t": {
         rows: 3,
         cols: 2,
         grid: '101110'
      },

      // O
      "o": {
         rows: 2,
         cols: 2,
         grid: '1111'
      },
   };

   static getCellPos = function (shape, angle, radius) {
      // get every cell's (x, y)
      // consider angle of rotation and size (radius)
      let cells = [];
      let grid = shape.grid;
      let rows = shape.rows;
      let cols = shape.cols;
      let midpoint = {
         x: radius * cols / 2,
         y: radius * rows / 2
      };
      let id = 0;
      for (let r = 0; r < rows; r++) {
         for (let c = 0; c < cols; c++) {
            let on = grid.substring(id, id + 1);
            if (on == '1') {
               let point = rotatePoint({
                     x: 0,
                     y: 0
                  }, angle, {
                     x: radius * (c + 0.5) - midpoint.x,
                     y: radius * (r + 0.5) - midpoint.y
                  });
               cells.push(point);
            }
            id++;
         }
      }

      return cells;
   };

}