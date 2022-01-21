   var panorama, viewer, container, infospot;

  panorama = new PANOLENS.ImagePanorama("/images/sunset.jpg");
  container = document.querySelector( '#container' );


//   var lookAtPositions = [
//   new THREE.Vector3(4871.39, 1088.07, -118.41),
//   new THREE.Vector3(-5000.00, -1825.25, 197.56)
// ];


panorama.addEventListener( 'enter', function(){
  viewer.tweenControlCenter( new THREE.Vector3(4871.39, 1088.07, -118.41), 0 );
} );

// infospot0 = new PANOLENS.Infospot( 350);
// infospot0.position.set( 4871.39, 1088.07, -118.41);

// infospot1 = new PANOLENS.Infospot( 350, PANOLENS.DataImage.Info);
// infospot1.position.set( -5000.00, -1825.25, 197.56 );


// panorama.add( infospot0 );
// panorama.add( infospot1 );

var infospotsall = [];



// to get clicked positions
function getPosition() { 
  const a = viewer.raycaster.intersectObject(viewer.panorama, true)[0].point;
  return a;
};

//check each infospot if it is being hovered over
function isHovering() { 
  for (let i = 0; i < infospotsall.length; i++) { 
  if (infospotsall[i].isHovering) {
      return infospotsall[i];
    } else {
      continue;
}
return;
}};


viewer = new PANOLENS.Viewer({ container: container, output: 'console', autoHideInfospot: false });
viewer.add(panorama);

function renewInfospotsAll(){
infospotsall.filter(infospot => infospot.parent != null)
};

var isDelete = false;
var isAdd = false;
var isDone = true;
var isEdit = false;

document.addEventListener("DOMContentLoaded", function() {

var deleteButton = document.getElementById("delete");
var doneButton = document.getElementById("done");
var addButton = document.getElementById("add");
var descriptions = document.getElementById("descriptions");
var modals = document.getElementsByClassName("modal");
var editButtons = document.getElementsByClassName("edit");

//ADD
function addInfospot(){
    if (isHovering()) {
      return;
    } else{
    var myInfospot = new PANOLENS.Infospot( 350, PANOLENS.DataImage.Info, animated=true);
    const clickedPos = getPosition();
    myInfospot.position.set(-(clickedPos.x), clickedPos.y, clickedPos.z);
    myInfospot.addHoverText("Play text");
    infospotsall.push(myInfospot);
    var str = "<div id=\"info" + String(infospotsall.length-1) + "\" class=\"modal\"><div class=\"modal-content\"><span class=\"close\">&times;</span><header id = \"header" + String(infospotsall.length-1) +  "\" class = \"contents\" contenteditable=\"true\">Example Header</header><p id = \"content" + String(infospotsall.length-1) +  "\" class = \"contents\" contenteditable=\"true\">Example Text</p><button class=\"edit button\">Save Changes</button> </div> </div>"
    descriptions.insertAdjacentHTML("beforeend", str);

  myInfospot.addEventListener( 'click', function(){
  this.focus();
  this.onClick({mouseEvent: {clientX: 0, clientY:0}});
  var modal = document.getElementById("info" + String(infospotsall.indexOf(myInfospot)));
  var span = document.getElementsByClassName("close")[infospotsall.indexOf(myInfospot)];
  var editBtn = editButtons[infospotsall.indexOf(myInfospot)];

  if (!isDelete){
  modal.style.display = "block";
}

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
  }
}

  editBtn.addEventListener("click", function(e){
    editInfospot(infospotsall.indexOf(myInfospot));
    e.stopPropagation();
  });
});

    panorama.add( myInfospot );
    panorama.toggleInfospotVisibility(true, 100);

    }
};

function editInfospot(idx) {
var content = document.getElementById("content" + String(idx));
var header = document.getElementById("header" + String(idx));
var editBtn = editButtons[idx];
  if (content.isContentEditable){
    content.setAttribute("contenteditable", false);
    header.setAttribute("contenteditable", false);
    editBtn.innerHTML = "Edit";
  }
  else {
    content.setAttribute("contenteditable", true);
    header.setAttribute("contenteditable", true);
    editBtn.innerHTML = "Save Changes";
  }
}; 

addButton.addEventListener("click", function(){
  isAdd = true;
  addButton.style.color = "green";
  panorama.addEventListener( 'click', addInfospot);
  doneButton.style.display = "block";
  deleteButton.style.display = "none";
});

function isHidden(arr) {
  for (let i = 0; i < arr.length; i++) {
    var style = window.getComputedStyle(arr[i]);
    if (style != 'none'){
      return arr[i];
    }
  }
  return;
};

function deleteInfospot(infospot){
  let text = "Delete this infospot?";
  if (confirm(text) == true) {
    infospot.dispose(); 
  } 
};

deleteButton.addEventListener("click", function(){
  deleteButton.style.color = "red"; 
  isDelete = true;
  doneButton.style.display = "block";
  addButton.style.display = "none";
  for (let i = 0; i < infospotsall.length; i++) {
    infospotsall[i].addEventListener("click", function(){
      deleteInfospot(infospotsall[i]);
    })
  }
});


doneButton.addEventListener("click", function() {
  if (isDelete){
    renewInfospotsAll();
    console.log("after renewInfospotsall");
    console.log(infospotsall);
   for (let i = 0; i < infospotsall.length; i++) {
    infospotsall[i].removeEventListener("click", deleteInfospot);
    }
    deleteButton.style.color = "black"; 
    isDelete = false;
    addButton.style.display = "block";
  } else if (isAdd) {
    addButton.style.color = "black"; 
    panorama.removeEventListener("click", addInfospot);
    isAdd = false;
    deleteButton.style.display = "block";
  }

  doneButton.style.display = "none";
});

});
 

