
function d2r(degrees) {
   return degrees * Math.PI / 180;
}

function r2d(radians) {
   return radians * 180 / Math.PI;
}

function midpoint(a, b) {
   // find midpoint between self and point
   let spot = vec2((a.x + b.x) / 2, (a.y + b.y) / 2);
   return spot;
}

function rotatePoint(center, angle, point) {
   //console.log(center, angle, point);
   let newPoint = {};

   let sin = Math.sin(d2r(angle));
   let cos = Math.cos(d2r(angle));

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

export {d2r, r2d, midpoint, rotatePoint}