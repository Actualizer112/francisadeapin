
/* =========================================
   FRANCIS ADEAPIN PORTFOLIO
   Interactive JavaScript
========================================= */

// PAGE LOADER
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 900);
});

// FALLBACK: Hide loader even if an external resource loads slowly
setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
}, 4000);


// AUTOMATIC FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();


// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});


// NAVBAR SCROLL EFFECT
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
});


// BACK TO TOP
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// REVEAL ELEMENTS WHEN SCROLLING
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});


// CURSOR GLOW
const cursorGlow = document.getElementById("cursorGlow");

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = event.clientX + "px";
        cursorGlow.style.top = event.clientY + "px";
    });
} else {
    cursorGlow.style.display = "none";
}


// ACTIVE NAVIGATION LINK
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(item => {
                item.classList.remove("active");

                if (item.getAttribute("href") === "#" + entry.target.id) {
                    item.classList.add("active");
                }
            });
        }
    });
}, {
    rootMargin: "-35% 0px -55% 0px"
});

sections.forEach(section => {
    sectionObserver.observe(section);
});


// =========================================
// INTERACTIVE 3D HERO OBJECT USING THREE.JS
// =========================================

function createThreeScene() {

    const container = document.getElementById("three-container");

    // If Three.js did not load, the rest of the site still works.
    if (!container || typeof THREE === "undefined") {
        console.warn("Three.js could not load. Check your internet connection.");
        return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd6b36a, 2.5, 20);
    goldLight.position.set(3, 3, 4);
    scene.add(goldLight);

    const blueLight = new THREE.PointLight(0x55b9ff, 2.8, 20);
    blueLight.position.set(-3, -2, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x9b7bff, 1.8, 20);
    purpleLight.position.set(0, 4, -3);
    scene.add(purpleLight);


    // MAIN 3D OBJECT
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeometry = new THREE.IcosahedronGeometry(1.45, 5);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1d4770,
        metalness: 0.78,
        roughness: 0.19,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: 0x07192f,
        emissiveIntensity: 0.35
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(core);


    // INNER GLOWING SPHERE
    const innerGeometry = new THREE.SphereGeometry(1.12, 48, 48);

    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x55b9ff,
        transparent: true,
        opacity: 0.08,
        wireframe: true
    });

    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerSphere);


    // OUTER GOLD WIREFRAME
    const wireGeometry = new THREE.IcosahedronGeometry(1.58, 2);

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xd6b36a,
        wireframe: true,
        transparent: true,
        opacity: 0.32
    });

    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    coreGroup.add(wireframe);


    // ORBITAL RINGS
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    function createRing(radius, color, rotationX, rotationY) {

        const geometry = new THREE.TorusGeometry(
            radius,
            0.008,
            8,
            180
        );

        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.65
        });

        const ring = new THREE.Mesh(geometry, material);

        ring.rotation.x = rotationX;
        ring.rotation.y = rotationY;

        ringGroup.add(ring);

        return ring;
    }

    const ring1 = createRing(2.05, 0xd6b36a, 1.1, 0.3);
    const ring2 = createRing(2.25, 0x55b9ff, 0.5, 1.2);
    const ring3 = createRing(1.85, 0xa78bfa, 1.5, 0.9);


    // ORBITING SPHERES
    const orbitObjects = [];

    const orbitColors = [
        0xd6b36a,
        0x55b9ff,
        0xa78bfa,
        0xffffff
    ];

    for (let i = 0; i < 4; i++) {

        const geometry = new THREE.SphereGeometry(
            0.075 + (i * 0.012),
            24,
            24
        );

        const material = new THREE.MeshStandardMaterial({
            color: orbitColors[i],
            metalness: 0.8,
            roughness: 0.2,
            emissive: orbitColors[i],
            emissiveIntensity: 0.5
        });

        const sphere = new THREE.Mesh(geometry, material);

        orbitObjects.push(sphere);
        scene.add(sphere);
    }


    // PARTICLE FIELD
    const particleCount = 900;

    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {

        particlePositions[i * 3] = (Math.random() - 0.5) * 11;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x80bfff,
        size: 0.018,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    scene.add(particles);


    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    container.addEventListener("mousemove", (event) => {

        const rect = container.getBoundingClientRect();

        targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;

        targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.8;

    });

    container.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;
    });


    // ANIMATION
    const clock = new THREE.Clock();

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrame;

    function animate() {

        animationFrame = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.035;
        mouseY += (targetY - mouseY) * 0.035;

        if (!reducedMotion) {

            coreGroup.rotation.y = elapsed * 0.18 + mouseX;
            coreGroup.rotation.x = Math.sin(elapsed * 0.35) * 0.15 + mouseY;

            wireframe.rotation.y = -elapsed * 0.12;
            wireframe.rotation.x = elapsed * 0.08;

            ring1.rotation.z = elapsed * 0.22;
            ring2.rotation.x = elapsed * 0.16;
            ring3.rotation.y = -elapsed * 0.2;

            particles.rotation.y = elapsed * 0.015;

            orbitObjects.forEach((object, index) => {

                const angle = elapsed * (0.5 + index * 0.12)
                    + (index * Math.PI / 2);

                const radius = 2.1 + (index % 2) * 0.3;

                object.position.x = Math.cos(angle) * radius;
                object.position.y = Math.sin(angle * 1.2) * 1.1;
                object.position.z = Math.sin(angle) * radius * 0.55;

            });
        }

        renderer.render(scene, camera);
    }

    animate();


    // RESPONSIVE 3D RESIZING
    function resizeScene() {

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener("resize", resizeScene);


    // PAUSE RENDERING WHEN THE TAB IS HIDDEN
    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else {
            clock.start();
            animate();
        }
    });

}


// START THE 3D EXPERIENCE
createThreeScene();
