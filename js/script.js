// =====================================================
// NOVA — BRANDBOOK DIGITAL JAVASCRIPT
// Lógica de navegación asimétrica, scrollspy dinámico, color & tipo
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 01. SCROLLSPY NUMÉRICO DINÁMICO & ADAPTACIÓN DE NAV
    // =====================================================
    const progressBar = document.getElementById("read-progress");
    const mainNav = document.getElementById("mainNav");
    const navCounter = document.getElementById("navCounter");
    const backToTopBtn = document.getElementById("backToTop");
    const chapters = document.querySelectorAll("section[data-chapter]");

    function handleEditorialScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Barra de progreso de lectura superior
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Mostrar u ocultar botón volver arriba
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }

        // Detección de capítulo visible y estilo de barra de navegación
        const scanLine = scrollTop + 100;
        let currentChapter = "01 / 09";
        let currentNavStyle = "light";

        chapters.forEach((chapter) => {
            const top = chapter.offsetTop;
            const height = chapter.offsetHeight;

            if (scanLine >= top && scanLine < top + height) {
                currentChapter = chapter.getAttribute("data-chapter") || currentChapter;
                currentNavStyle = chapter.getAttribute("data-nav-style") || "light";
            }
        });

        // Actualizar indicador numérico
        if (navCounter) {
            navCounter.textContent = currentChapter;
        }

        // Adaptar contraste de la navegación fija
        if (mainNav) {
            if (currentNavStyle === "dark") {
                mainNav.classList.add("nav-dark");
            } else {
                mainNav.classList.remove("nav-dark");
            }
        }
    }

    window.addEventListener("scroll", handleEditorialScroll, { passive: true });
    handleEditorialScroll(); // Ejecución inicial al cargar

    // Acción para volver arriba
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // =====================================================
    // 02. ANIMACIONES EDITORIALES AL SCROLL (REVEAL)
    // =====================================================
    const revealTargets = document.querySelectorAll(".reveal-fade");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealTargets.forEach((target) => {
        revealObserver.observe(target);
    });


    // =====================================================
    // 03. PLANOS DE COLOR: COPIADO AL PORTAPAPELES
    // =====================================================
    const colorPlanes = document.querySelectorAll("[data-copy-hex]");
    const toastNotice = document.getElementById("toast-notice");
    const toastMsg = document.getElementById("toast-msg");
    let toastTimeout;

    function triggerToast(message) {
        if (!toastNotice) return;
        if (toastMsg) toastMsg.textContent = message;
        toastNotice.classList.add("visible");

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastNotice.classList.remove("visible");
        }, 2200);
    }

    colorPlanes.forEach((plane) => {
        plane.addEventListener("click", () => {
            const hexVal = plane.dataset.copyHex || "#000000";

            navigator.clipboard.writeText(hexVal).then(() => {
                triggerToast(`COLOR ${hexVal} COPIADO AL PORTAPAPELES`);
            }).catch(() => {
                triggerToast(`CÓDIGO: ${hexVal}`);
            });
        });
    });


    // =====================================================
    // 04. LABORATORIO TIPOGRÁFICO INTERACTIVO
    // =====================================================
    const labInput = document.getElementById("labTextInput");
    const labSlider = document.getElementById("labSizeSlider");
    const labSliderVal = document.getElementById("labSliderVal");
    const labOutput = document.getElementById("labTextOutput");

    if (labInput && labOutput) {
        labInput.addEventListener("input", (e) => {
            const txt = e.target.value.trim();
            labOutput.textContent = txt || "NOVA";
        });
    }

    if (labSlider && labSliderVal && labOutput) {
        labSlider.addEventListener("input", (e) => {
            const size = `${e.target.value}px`;
            labSliderVal.textContent = size;
            labOutput.style.fontSize = size;
        });
    }


    // =====================================================
    // 05. DESPLAZAMIENTO SUAVE PARA ENLACES INTERNOS
    // =====================================================
    const internalLinks = document.querySelectorAll("a[href^='#']");

    internalLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

});