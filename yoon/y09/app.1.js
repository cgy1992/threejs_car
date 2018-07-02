var camera, scene, renderer;
var cube, sphere, torus, material;
var count = 0, cubeCamera1, cubeCamera2;
var lon = 0, lat = 0;
var phi = 0, theta = 0;
var textureLoader = new THREE.TextureLoader();
textureLoader.load( 'texture.jpg', function ( texture ) {
    texture.mapping = THREE.UVMapping;
    init( texture );
    animate();
} );
function init( texture ) {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    scene = new THREE.Scene();
    var mesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 500, 32, 16 ), new THREE.MeshBasicMaterial( { map: texture } ) );
    mesh.geometry.scale( - 1, 1, 1 );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    cubeCamera1 = new THREE.CubeCamera( 1, 1000, 256 );
    cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add( cubeCamera1 );
    cubeCamera2 = new THREE.CubeCamera( 1, 1000, 256 );
    cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add( cubeCamera2 );
    document.body.appendChild( renderer.domElement );
    //
    material = new THREE.MeshBasicMaterial( {
        envMap: cubeCamera2.renderTarget.texture
    } );
    sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 20, 3 ), material );
    scene.add( sphere );
    cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 20, 20, 20 ), material );
    scene.add( cube );
    torus = new THREE.Mesh( new THREE.TorusKnotBufferGeometry( 10, 5, 100, 25 ), material );
    scene.add( torus );
    //
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    window.addEventListener( 'resize', onWindowResized, false );
}
function onWindowResized( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
}
function onDocumentMouseMove( event ) {
    lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
    lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
}
function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
}
function onDocumentMouseWheel( event ) {
    var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp( fov, 10, 75 );
    camera.updateProjectionMatrix();
}
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    var time = Date.now();
    lon += .15;
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    cube.position.x = Math.cos( time * 0.001 ) * 30;
    cube.position.y = Math.sin( time * 0.001 ) * 30;
    cube.position.z = Math.sin( time * 0.001 ) * 30;
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;
    torus.position.x = Math.cos( time * 0.001 + 10 ) * 30;
    torus.position.y = Math.sin( time * 0.001 + 10 ) * 30;
    torus.position.z = Math.sin( time * 0.001 + 10 ) * 30;
    torus.rotation.x += 0.02;
    torus.rotation.y += 0.03;
    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = 100 * Math.cos( phi );
    camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( scene.position );
    sphere.visible = false;
    // pingpong
    if ( count % 2 === 0 ) {
        material.envMap = cubeCamera1.renderTarget.texture;
        cubeCamera2.update( renderer, scene );
    } else {
        material.envMap = cubeCamera2.renderTarget.texture;
        cubeCamera1.update( renderer, scene );
    }
    count ++;
    sphere.visible = true;
    renderer.render( scene, camera );
}