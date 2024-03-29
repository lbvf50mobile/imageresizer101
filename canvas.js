var width = 700;
var height = 700;
var cropperImg = {}
var cropperGroup = {}
var redSquare = {}


var dragInfo = {
  drag_start: [0,0],
  drag_start_cropper: [0,0],
  sq: [0,0],
  clip: [0,0],
  reset: function(){
    this.sq = [0,0]
    this.clip = [0,0]
    this.drag_start = [0,0]; 
    this.drag_start_cropper = [0,0];
  }
}


function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
      case 'topLeft':
        topRight.y(anchorY);
        bottomLeft.x(anchorX);
        break;
      case 'topRight':
        topLeft.y(anchorY);
        bottomRight.x(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.y(anchorY);
        topRight.x(anchorX);
        break;
      case 'bottomLeft':
        bottomRight.y(anchorY);
        topLeft.x(anchorX);
        break;
    }

    image.position(topLeft.position());
    cropperImg.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
      image.width(width);
      image.height(height);
      cropperImg.width(width);
      cropperImg.height(height);
    }
  }

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
      x: x,
      y: y,
      stroke: '#555',
      fill: '#ddd',
      strokeWidth: 2,
      radius: 8,
      name: name,
      draggable: true,
      dragOnTop: false
    });

    anchor.on('dragmove', function() {
      update(this);
      layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
      group.draggable(false);
      this.moveToTop();
    });
    anchor.on('dragend', function() {
      group.draggable(true);
      layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.strokeWidth(4);
      layer.draw();
    });
    anchor.on('mouseout', function() {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.strokeWidth(2);
      layer.draw();
    });

    group.add(anchor);
  }

var stage = new Konva.Stage({
    container: 'containter-for-canvas',
    width: width,
    height: height
  });

var layer = new Konva.Layer();
 stage.add(layer);

 // House
 var houseImg = new Konva.Image({
    width: 635,
    height: 397
  });
  houseImg.opacity(0.3)

  var houseGroup = new Konva.Group({
    x: 20,
    y: 110,
    draggable: true,
  });
  layer.add(houseGroup);
  houseGroup.add(houseImg);

  houseGroup.on("dragstart",function(){
    dragInfo.reset()
    dragInfo.start = [this.x(), this.y()]
    dragInfo.drag_start_cropper = [cropperGroup.x(), cropperGroup.y()]
    dragInfo.sq = [redSquare.x(), redSquare.y()]
    dragInfo.clip = [cropperGroup.clipX(), cropperGroup.clipY()];
    console.log(dragInfo)
  })

  houseGroup.on("dragmove",function(){
    let [nx,ny] = [this.x(),this.y()];
    let [dx,dy] = [nx - dragInfo.start[0], ny - dragInfo.start[1]];
    let [x,y] = [dragInfo.drag_start_cropper[0] + dx, dragInfo.drag_start_cropper[1] + dy];
    let [sx,sy] = [dragInfo.sq[0] - dx, dragInfo.sq[1] - dy]
    let [cx,cy] = [dragInfo.clip[0] - dx, dragInfo.clip[1] - dy]
    

    console.log([nx,ny,dx,dy,x,y])
    cropperGroup.x(x);
    cropperGroup.y(y);
    redSquare.x(sx);
    redSquare.y(sy);
    cropperGroup.clipX(cx);
    cropperGroup.clipY(cy);
  })


  redSquare = new Konva.Rect({
    x: 150,
    y: 40,
    width: 250,
    height: 300,
    stroke: 'red',
    strokeWidth: 1
  });
  houseGroup.add(redSquare)

  addAnchor(houseGroup, 0, 0, 'topLeft');
  addAnchor(houseGroup, 635, 0, 'topRight');
  addAnchor(houseGroup, 635, 397, 'bottomRight');
  addAnchor(houseGroup, 0, 397, 'bottomLeft');

  var imageObj1 = new Image();
  imageObj1.onload = function() {
    houseImg.image(imageObj1);
    layer.draw();
  };
  imageObj1.src = '1.png';


  // Add cropping part.
  // cropperImage
  cropperImg = new Konva.Image({
  width: 635,
  height: 397
});

cropperGroup = new Konva.Group({
  x: 20,
  y: 110,
  draggable: false,
  clip: {
    x: 150,
    y: 40,
    width: 250,
    height: 300,
  }
});
layer.add(cropperGroup);
cropperGroup.add(cropperImg);

var imageObj2 = new Image();
  imageObj2.onload = function() {
    cropperImg.image(imageObj1);
    layer.draw();
  };
  imageObj2.src = '1.png';



 