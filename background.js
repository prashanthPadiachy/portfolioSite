
(function(){

    const canvas = document.getElementById('bg');

    const renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias: false});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent, so the CSS background shows through

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200);
    camera.position.z= 18;

    const COUNT = 1000;
    const SPREAD = {x:40, y:25, z:30};
    const COLOR = [0.15, 0.15, 0.17]

    const positions = new Float32Array(COUNT*3);
    const basePositions = new Float32Array(COUNT*3);
    const speeds = new Float32Array(COUNT);

    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);

    //distribute particles
    for(let i = 0; i<COUNT; i++)
        {
            const j = i*3;

            basePositions[j]= (Math.random() - 0.5)*SPREAD.x;
            basePositions[j+1]= (Math.random() - 0.5)*SPREAD.y;
            basePositions[j+2]= (Math.random() - 0.5)*SPREAD.z;

            speeds[i]= 0.05+Math.random()*0.2;

            sizes[i]  = 1 + Math.random() * 3;
            alphas[i] = 0.05 + Math.random() * 0.25;


        }
    positions.set(basePositions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));//turn positions into geo
    geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aAlpha',   new THREE.BufferAttribute(alphas, 1));

    // const material = new THREE.PointsMaterial({//REPLACE LATER
    //  color: 0x333333,
    //  size: 0.09,
    //  transparent: true,
    //  opacity: 0.5
    // });

    //SHADER
    const mat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.NormalBlending, 
        uniforms:{uPixelRatio: {value: renderer.getPixelRatio()}, uColor: {value: new THREE.Vector3(...COLOR)}
    },
    vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
            vAlpha = aAlpha;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize*uPixelRatio*(40.0/-mv.z);
            gl_Position = projectionMatrix*mv;
        }`,
    fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;   //rounding
            float glow = 1.0 - smoothstep(0.1, 0.5, d);//glow blur
            float soft = pow(glow, 2.5);
            float a = soft*(vAlpha*2.5 + 0.1);
            gl_FragColor = vec4(uColor, a);

        }`

    }, );

    const particles = new THREE.Points(geometry,mat);

    scene.add(particles);

    const mouse = {x:0, y:0, tx:0 , ty:0};

    window.addEventListener('mousemove', e => {
    mouse.tx =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    } );

    //renderer.render(scene, camera);
    const clock = new THREE.Clock();

    function animate(){
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        //lerp mouse follow
        mouse.x += (mouse.tx - mouse.x)*0.05;
        mouse.y += (mouse.ty - mouse.y)*0.05;

        for(let i = 0;i<COUNT;i++){
            const j = i*3;
            const speed = speeds[i];

            positions[j]= basePositions[j]+Math.sin(t*speed+i)*2 + mouse.x*1.2*speed;
            positions[j+1] = basePositions[j+1]+Math.cos(t*speed+i*0.5)*2 + mouse.y*0.8 *speed;
            positions[j+2]= basePositions[j+2]+Math.sin(t*speed*0.5+i*0.3)*1.5;
            }

            geometry.attributes.position.needsUpdate= true;

            camera.position.x = mouse.x *0.5;
            camera.position.y = mouse.y*0.3;
            camera.lookAt(0,0,0);

            renderer.render(scene,camera);
        
    }
    animate();
})();