
(function(){

    const canvas = document.getElementById('bg');

    const renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    const scene = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
    camera.position.z= 18;

})();