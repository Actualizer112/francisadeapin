
document.addEventListener("DOMContentLoaded", function () {

  // 1. AUTOMATIC FOOTER YEAR
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("open");

      const isOpen = nav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. HEADER SCROLL EFFECT
  const header = document.getElementById("header");

  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // 4. SCROLL REVEAL ANIMATION
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  // 5. ACTIVE NAVIGATION LINK
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    }, {
      rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // 6. OPTIONAL THREE.JS 3D ANIMATION
  function createThreeScene() {
    const container = document.getElementById("three-container");

    if (!container || typeof THREE === "undefined") {
      return;
    }

    if (!window.WebGLRenderingContext) {
      return;
    }

    let renderer;

    try {
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        100
      );

      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(1.35, 2);

      const material = new THREE.MeshStandardMaterial({
        color: 0x287ca8,
        metalness: 0.8,
        roughness: 0.25,
        wireframe: false,
        flatShading: true
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      const wireGeometry = new THREE.IcosahedronGeometry(1.39, 2);

      const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xe8b85b,
        wireframe: true,
        transparent: true,
        opacity: 0.25
      });

      const wireSphere = new THREE.Mesh(wireGeometry, wireMaterial);
      scene.add(wireSphere);

      const ringGeometry = new THREE.TorusGeometry(1.9, 0.008, 8, 120);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x42b9ff,
        transparent: true,
        opacity: 0.7
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2.5;
      scene.add(ring);

      const lightOne = new THREE.PointLight(0x42b9ff, 3, 20);
      lightOne.position.set(3, 3, 4);
      scene.add(lightOne);

      const lightTwo = new THREE.PointLight(0xe8b85b, 2, 20);
      lightTwo.position.set(-3, -2, 3);
      scene.add(lightTwo);

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));

      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 350;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xe8b85b,
        size: 0.018,
        transparent: true,
        opacity: 0.65
      });

      const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
      );

      scene.add(particles);

      function resizeScene() {
        if (!container.clientWidth || !container.clientHeight) return;

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
          container.clientWidth,
          container.clientHeight
        );
      }

      window.addEventListener("resize", resizeScene);

      function animate() {
        requestAnimationFrame(animate);

        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.003;

        wireSphere.rotation.x -= 0.001;
        wireSphere.rotation.y -= 0.002;

        ring.rotation.z += 0.002;
        particles.rotation.y += 0.0004;

        renderer.render(scene, camera);
      }

      animate();

    } catch (error) {
      console.warn("3D animation unavailable. Website will continue.", error);

      if (renderer) {
        renderer.dispose();
      }

      container.innerHTML = '<div class="fallback-orb">FA</div>';
    }
  }

  createThreeScene();

});
