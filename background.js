
(function(){

    const canvas = document.getElementById('bg');

    const renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
    camera.position.z= 18;

    const COUNT = 1000;
    const SPREAD = {x:40, y:25, z:30};

    const positions = new Float32Array(COUNT*3);
    const basePositions = new Float32Array(COUNT*3);
    const speeds = new Float32Array(COUNT);

    //distribute particles
    for(let i = 0; i<COUNT; i++)
        {
            const j = i*3;

            basePositions[j]= (Math.random() - 0.5)*SPREAD.x;
            basePositions[j+1]= (Math.random() - 0.5)*SPREAD.y;
            basePositions[j+2]= (Math.random() - 0.5)*SPREAD.z;

            speeds[i]= 0.05+Math.random()*0.2;

        }
    positions.set(basePositions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));//turn positions into geo

    const material = new THREE.PointsMaterial({//REPLACE LATER
     color: 0x333333,
     size: 0.09,
     transparent: true,
     opacity: 0.5
    });

    const particles = new THREE.Points(
    geometry,
    material
    );

    scene.add(particles);

    //renderer.render(scene, camera);
    const clock = new THREE.Clock();

    function animate(){
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        for(let i = 0;i<COUNT;i++){
            const j = i*3;
            const speed = speeds[i];

            positions[j]= basePositions[j]+Math.sin(t*speed+i)*2;
            positions[j+1] = basePositions[j+1]+Math.cos(t*speed+i)*2;
            }

            geometry.attributes.position.needsUpdate= true;

            renderer.render(scene,camera);
        
    }
    animate();
})();