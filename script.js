let a = gsap.timeline()

ScrollTrigger.create({
    animation: a.from(".logo", {
        y: "50vh",
        scale: 6,
        yPercent: -50,
    }),
    scrub: true,
    trigger: ".content",
    start: "top bottom",
    endTrigger: ".content",
    end: "top center",
});


const cubeContainers = document.querySelectorAll(".cube-container");
const items = document.querySelectorAll(".item");
const projectNames = ['clark', 'bingo', 'vertex', 'linear'];

function updateCubes(scrollY) {
  const yRotation = (scrollY / 2) % 360;
  const scrollOffset = scrollY * 0.25;
  cubeContainers.forEach((container, containerIndex) => {
    const cubes = container.querySelectorAll(".cube");
  
    cubes.forEach((cube, cubeIndex) => {
      let rotationDirection = cubeIndex % 2 === 0 ? 1 : -1;
      cube.style.transform = `translateZ(100px) rotateX(${yRotation * rotationDirection}deg)`;
    });
  
    const frontBackTextPosition = 50 + scrollOffset;
    const topBottomTextPosition = 50 - scrollOffset;
  
    container.querySelectorAll(".front p, .back p").forEach(p => {
      p.style.left = `${frontBackTextPosition}%`;
    });
  
    container.querySelectorAll(".top p, .bottom p").forEach(p => {
      p.style.left = `${topBottomTextPosition}%`;
    });
  });
}
function populateText() {
    items.forEach((item, itemIndex) => {
        const projectName = projectNames[itemIndex % projectNames.length];
        const sides = item.querySelectorAll(".side p");
        const textContent = Array(50).fill(projectName).join("&nbsp;&nbsp;&nbsp;&nbsp;");

        sides.forEach(side => {
            side.innerHTML = textContent;
        });
    });
}
window.onload = function (){
    populateText();
    updateCubes(window.scrollY);
}
    let ticking = false;
    
    document.addEventListener("scroll", function (e) {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                updateCubes(window.scrollY);
                ticking = false;
            });
            ticking = true;
        }
    });

    gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", function () {
  const slides = gsap.utils.toArray(".slide");
  const activeSlideImages = gsap.utils.toArray(".active-slide img");

  function getInitialTranslateZ(slide) {
    const style = window.getComputedStyle(slide);
    const matrix = style.transform.match(/matrix3d\((.+)\)/);
    if (matrix) {
      const values = matrix[1].split(", ");
      return parseFloat(values[14] || 0);
    }
    return 0;
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    value = Math.min(Math.max(value, inMin), inMax);
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  slides.forEach((slide, index) => {
    const initialZ = getInitialTranslateZ(slide);

    ScrollTrigger.create({
      trigger: ".img-scroll",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const zIncrement = progress * 23350;
        const currentZ = initialZ + zIncrement;

        let opacity = 0;

        if (currentZ > -2500) {
          opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
        } else {
          opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
        }

        slide.style.opacity = opacity;
        slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;

        if (currentZ < 100) {
          gsap.set(activeSlideImages[index], { opacity: 1 });
        } else {
          gsap.set(activeSlideImages[index], { opacity: 0 });
        }
      },
    });
  });
});

    
document.addEventListener("DOMContentLoaded", function () {
  const lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const services = gsap.utils.toArray(".service");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const service = entry.target;
        const imgContainer = service.querySelector(".img");

        ScrollTrigger.create({
          trigger: service,
          start: "bottom bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let progress = self.progress;
            let newWidth = 30 + 70 * progress;
            gsap.to(imgContainer, {
              width: newWidth + "%",
              duration: 0.1,
              ease: "none",
            });
          },
        });

        ScrollTrigger.create({
          trigger: service,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            let progress = self.progress;
            let newHeight = 150 + 300 * progress;
            gsap.to(service, {
              height: newHeight + "px",
              duration: 0.1,
              ease: "none",
            });
          },
        });

        observer.unobserver(service);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  services.forEach((service) => {
    observer.observe(service);
  });
});

