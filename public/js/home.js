   var panorama, viewer, container, infospot;

  panorama = new PANOLENS.ImagePanorama("/images/sunset.jpg");
  container = document.querySelector( '#container' );

panorama.addEventListener( 'enter', function(){
  viewer.tweenControlCenter( new THREE.Vector3(-5000.00, -1825.25, 197.56 ), 0 );
} );

infospot0 = new PANOLENS.Infospot( 350);
infospot0.position.set( 4871.39, 1088.07, -118.41);

infospot1 = new PANOLENS.Infospot( 350, PANOLENS.DataImage.Info);
infospot1.position.set( -5000.00, -1825.25, 197.56 );

panorama.add( infospot0 );
panorama.add( infospot1 );

infospot0.addEventListener( 'click', function(){
  this.focus();
  this.onClick({mouseEvent: {clientX: 0, clientY:0}});
  var modal = document.getElementById("info0");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
  }
}
});


infospot1.addEventListener( 'click', function(){
  this.focus();
  this.onClick({mouseEvent: {clientX: 0, clientY:0}});
  var modal = document.getElementById("info1");
  var span = document.getElementsByClassName("close")[1];
  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
  }
}
});


viewer = new PANOLENS.Viewer({ container: container, output: 'console', autoHideInfospot: false });
viewer.add(panorama);