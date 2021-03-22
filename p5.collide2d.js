/*
Created By Dibyayan Kar
Some Functions And Code Modified Version From http://www.jeffreythompson.org/collision-detection
GNU LGPL 2.1 License
Version 0.1 | January 10th, 2016
*/
console.log("### p5.collide ###")

p5.prototype._collideDebug = false;

p5.prototype.collideDebug = function(debugMode){
    _collideDebug = debugMode;
}

/*~++~+~+~++~+~++~++~+~+~ 2D ~+~+~++~+~++~+~+~+~+~+~+~+~+~+~+*/

p5.prototype.collideRectRect = function (x, y, w, h, x2, y2, w2, h2) {
  //2d
  //Add In A Thing To Detect rectMode CENTER
  if (x + w >= x2 &&    // r1 Right Edge Past r2 Left
      x <= x2 + w2 &&    // r1 Left Edge Past r2 Right
      y + h >= y2 &&    // r1 Top Edge Past r2 Bottom
      y <= y2 + h2) {    // r1 Bottom Edge Past r2 Top
        return true;
  }
  return false;
};

p5.prototype.collideRectCircle = function (rx, ry, rw, rh, cx, cy, diameter) {
  //2d
  // Temporary Variables To Set Edges For Testing
  var testX = cx;
  var testY = cy;

  // Which Edge Is Closest?
  if (cx < rx){         testX = rx       // Left Edge
  }else if (cx > rx+rw){ testX = rx+rw  }   // Right Edge

  if (cy < ry){         testY = ry       // Top Edge
  }else if (cy > ry+rh){ testY = ry+rh }   // Bottom Edge

  // Get Distance From Closest Edges
  var distance = this.dist(cx,cy,testX,testY)

  // If The Distance Is Less Than The Radius, Collision!
  if (distance <= diameter/2) {
    return true;
  }
  return false;
};

p5.prototype.collideCircleCircle = function (x, y,d, x2, y2, d2) {
//2d
  if( this.dist(x,y,x2,y2) <= (d/2)+(d2/2) ){
    return true;
  }
  return false;
};

p5.prototype.collidePointCircle = function (x, y, cx, cy, d) {
//2d
if( this.dist(x,y,cx,cy) <= d/2 ){
  return true;
}
return false;
};

p5.prototype.collidePointRect = function (pointX, pointY, x, y, xW, yW) {
//2d
if (pointX >= x &&         // right of the left edge AND
    pointX <= x + xW &&    // left of the right edge AND
    pointY >= y &&         // below the top AND
    pointY <= y + yW) {    // above the bottom
        return true;
}
return false;
};

p5.prototype.collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
  // Get Distance From The Point To The Two Ends Of The Line
var d1 = this.dist(px,py, x1,y1);
var d2 = this.dist(px,py, x2,y2);

// Get The Length Of The Line
var lineLen = this.dist(x1,y1, x2,y2);

// Since Floats Are So Minutely Accurate, Add A Little Buffer Zone That Will Give Collision
if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

// If The Two Distances Are Equal To The Line's Length, The Point Is On The Line!
// Note We Use The Buffer Here To Give A Range, Rather Than One #
if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
  return true;
}
return false;
}

p5.prototype.collideLineCircle = function( x1,  y1,  x2,  y2,  cx,  cy,  diameter) {
  // Is Either End INSIDE The Circle?
  // If So, Return true Immediately
  var inside1 = this.collidePointCircle(x1,y1, cx,cy,diameter);
  var inside2 = this.collidePointCircle(x2,y2, cx,cy,diameter);
  if (inside1 || inside2) return true;

  // Get Length Of The Line
  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = this.sqrt( (distX*distX) + (distY*distY) );

  // Get Dot Product Of The Line And Circle
  var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / this.pow(len,2);

  // Find The Closest Point On The Line
  var closestX = x1 + (dot * (x2-x1));
  var closestY = y1 + (dot * (y2-y1));

  // Is This Point Actually On The Line Segment?
  // If So Keep Going, But If Not, Return false
  var onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
  if (!onSegment) return false;

  // Draw A Debug Circle At The Closest Point On The Line
  if(this._collideDebug){
    this.ellipse(closestX, closestY,10,10);
  }

  // Get Distance To Closest Point
  distX = closestX - cx;
  distY = closestY - cy;
  var distance = this.sqrt( (distX*distX) + (distY*distY) );

  if (distance <= diameter/2) {
    return true;
  }
  return false;
}

p5.prototype.collideLineLine = function(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

  var intersection;

  // Calculate The Distance To Intersection Point
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // If uA And uB Are Between 0-1, Lines Are Colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    if(this._collideDebug || calcIntersection){
      // Calc The Point Where The Lines Meet
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));
    }

    if(this._collideDebug){
      this.ellipse(intersectionX,intersectionY,10,10);
    }

    if(calcIntersection){
      intersection = {
        "x":intersectionX,
        "y":intersectionY
      }
      return intersection;
    }else{
      return true;
    }
  }
  if(calcIntersection){
    intersection = {
      "x":false,
      "y":false
    }
    return intersection;
  }
  return false;
}

p5.prototype.collideLineRect = function(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {

  // Check If The Line Has Hit Any Of The Rectangle's Sides. Uses The Collided Line Line Function Above
  var left, right, top, bottom, intersection;

  if(calcIntersection){
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,true);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,true);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,true);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,true);
     intersection = {
        "left" : left,
        "right" : right,
        "top" : top,
        "bottom" : bottom
    }
  }else{
    //Return Booleans
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
  }

  // If ANY Of The Above Are true, The Line Has Hit The Rectangle
  if (left || right || top || bottom) {
    if(calcIntersection){
      return intersection;
    }
    return true;
  }
  return false;
}


p5.prototype.collidePointPoly = function(px, py, vertices) {
  var collision = false;

  // Go Through Each Of The Vertices, Plus The Next Vertex In The List
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // Get Next Vertex In List If We've Hit The End, Wrap Around To 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // Get The PVectors At Our Current Position This Makes Our If Statement A Little Cleaner
    var vc = vertices[current];    // c For "Current"
    var vn = vertices[next];       // n For "Next"

    // Compare Position, Flip 'Collision' Variable Back And Forth
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
         (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    }
  }
  return collision;
}

// POLYGON/CIRCLE
p5.prototype.collideCirclePoly = function(cx, cy, diameter, vertices, interior) {

  if (interior == undefined){
    interior = false;
  }

  // Go Through Each Of The Vertices, Plus The Next Vertex In The List
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // Get Next Vertex In List If We've Hit The End, Wrap Around To 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // Get The PVectors At Our Current Position This Makes Our If Statement A Little Cleaner
    var vc = vertices[current];    // c For "Current"
    var vn = vertices[next];       // n For "Next"

    // Check For Collision Between The Circle And A Line Formed Between The Two Vertices
    var collision = this.collideLineCircle(vc.x,vc.y, vn.x,vn.y, cx,cy,diameter);
    if (collision) return true;
  }

  // Test If The Center Of The Circle Is Inside The Polygon
  if(interior == true){
    var centerInside = this.collidePointPoly(cx,cy, vertices);
    if (centerInside) return true;
  }

  // Otherwise, After All That, Return false
  return false;
}

p5.prototype.collideRectPoly = function( rx, ry, rw, rh, vertices, interior) {
  if (interior == undefined){
    interior = false;
  }

  // Go Through Each Of The Vertices, Plus The Next Vertex In The List
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // Get Next Vertex In List If We've Hit The End, Wrap Around To 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // Get The PVectors At Our Current Position This Makes Our If Statement A Little Cleaner
    var vc = vertices[current];    // c For "Current"
    var vn = vertices[next];       // n For "Next"

    // Check Against All Four Sides Of The Rectangle
    var collision = this.collideLineRect(vc.x,vc.y,vn.x,vn.y, rx,ry,rw,rh);
    if (collision) return true;

    // Optional: Test If The Rectangle Is INSIDE The Polygon Note That This Iterates All Sides Of The Polygon Again, So Only Use This If You Need To
    if(interior == true){
      var inside = this.collidePointPoly(rx,ry, vertices);
      if (inside) return true;
    }
  }

  return false;
}

p5.prototype.collideLinePoly = function(x1, y1, x2, y2, vertices) {

  // Go Through Each Of The Vertices, Plus The Next Vertex In The List
  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    // Get Next Vertex In List If We've Hit The End, Wrap Around To 0
    next = current+1;
    if (next == vertices.length) next = 0;

    // Get The PVectors At Our Current Position Extract X/Y Coordinates From Each
    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y;

    // Do A Line/Line Comparison If true, Return 'true' Immediately And Stop Testing (Faster)
    var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }
  // Never Got A Hit
  return false;
}

p5.prototype.collidePolyPoly = function(p1, p2, interior) {
  if (interior == undefined){
    interior = false;
  }

  // Go Through Each Of The Vertices, Plus The Next Vertex In The List
  var next = 0;
  for (var current=0; current<p1.length; current++) {

    // Get Next Vertex In List, If We've Hit The End, Wrap Around To 0
    next = current+1;
    if (next == p1.length) next = 0;

    // Get The PVectors At Our Current Position This Makes Our If Statement A Little Cleaner
    var vc = p1[current];    // c For "Current"
    var vn = p1[next];       // n For "Next"

    //Use These Two Points (A Line) To Compare To The Other Polygon's Vertices Using polyLine()
    var collision = this.collideLinePoly(vc.x,vc.y,vn.x,vn.y,p2);
    if (collision) return true;

    //Check If The 2nd Polygon Is INSIDE The First
    if(interior == true){
      collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
      if (collision) return true;
    }
  }

  return false;
}

p5.prototype.collidePointTriangle = function(px, py, x1, y1, x2, y2, x3, y3) {

  // Get The Area Of The Triangle
  var areaOrig = this.abs( (x2-x1)*(y3-y1) - (x3-x1)*(y2-y1) );

  // Get The Area Of 3 Triangles Made Between The Point And The Corners Of The Triangle
  var area1 =    this.abs( (x1-px)*(y2-py) - (x2-px)*(y1-py) );
  var area2 =    this.abs( (x2-px)*(y3-py) - (x3-px)*(y2-py) );
  var area3 =    this.abs( (x3-px)*(y1-py) - (x1-px)*(y3-py) );

  // If The Sum Of The Three Areas Equals The Original, We're Inside The Triangle!
  if (area1 + area2 + area3 == areaOrig) {
    return true;
  }
  return false;
}

p5.prototype.collidePointPoint = function (x,y,x2,y2, buffer) {
    if(buffer == undefined){
      buffer = 0;
    }

    if(this.dist(x,y,x2,y2) <= buffer){
      return true;
    }

  return false;
};

p5.prototype.collidePointArc = function(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {

  if (buffer == undefined) {
    buffer = 0;
  }
  // Point
  var point = this.createVector(px, py);
  // arc Center Point
  var arcPos = this.createVector(ax, ay);
  // arc Radius Vector
  var radius = this.createVector(arcRadius, 0).rotate(arcHeading);

  var pointToArc = point.copy().sub(arcPos);

  if (point.dist(arcPos) <= (arcRadius + buffer)) {
    var dot = radius.dot(pointToArc);
    var angle = radius.angleBetween(pointToArc);
    if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
      return true;
    }
  }
  return false;
}