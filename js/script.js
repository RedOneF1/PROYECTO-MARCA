// =====================================================
// NOVA — BRANDBOOK EDITORIAL & LANDING DE ALTA CONVERSIÓN
// Lógica de interactividad, validación accesible de formulario,
// acordeón FAQ y navegación asimétrica
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 01. SCROLLSPY NUMÉRICO & BARRA DE AVANCE EDITORIAL
    // =====================================================
    const progressBar = document.getElementById("read-progress");
    const mainNav = document.getElementById("mainNav");
    const navCounter = document.getElementById("navCounter");
    const backToTopBtn = document.getElementById("backToTop");
    const chapters = document.querySelectorAll("section[data-chapter], footer[data-chapter]");

    function handleEditorialScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Barra de progreso de lectura superior
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Mostrar / ocultar botón flotante volver arriba
        if (backToTopBtn) {
            if (scrollTop > 450) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }

        // Estilo compacto para la barra de navegación fija
        if (mainNav) {
            if (scrollTop > 60) {
                mainNav.classList.add("nav-scrolled");
            } else {
                mainNav.classList.remove("nav-scrolled");
            }
        }

        // Detección de capítulo visible para el badge editorial
        const scanLine = scrollTop + 140;
        let currentChapter = "01 / 08";

        chapters.forEach((chapter) => {
            const top = chapter.offsetTop;
            const height = chapter.offsetHeight;

            if (scanLine >= top && scanLine < top + height) {
                currentChapter = chapter.getAttribute("data-chapter") || currentChapter;
            }
        });

        if (navCounter) {
            navCounter.textContent = currentChapter;
        }
    }

    window.addEventListener("scroll", handleEditorialScroll, { passive: true });
    handleEditorialScroll(); // Ejecución inicial

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
    // 02. ANIMACIONES EDITORIALES AL SCROLL (REVEAL FADE)
    // =====================================================
    const revealTargets = document.querySelectorAll(".reveal-fade");

    if ("IntersectionObserver" in window) {
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
    } else {
        // Fallback para navegadores antiguos
        revealTargets.forEach((target) => target.classList.add("active"));
    }


    // =====================================================
    // 03. ACORDEÓN FAQ ACCESIBLE (ARIA & TECLADO)
    // =====================================================
    const faqTriggers = document.querySelectorAll(".faq-trigger");

    faqTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            toggleFaqItem(trigger);
        });

        // Soporte de accesibilidad para teclado (Enter / Barra Espaciadora)
        trigger.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleFaqItem(trigger);
            }
        });
    });

    function toggleFaqItem(activeTrigger) {
        const isExpanded = activeTrigger.getAttribute("aria-expanded") === "true";
        const contentId = activeTrigger.getAttribute("aria-controls");
        const contentEl = document.getElementById(contentId);

        if (!contentEl) return;

        // Opcional: Cerrar otros elementos para mantener lectura limpia
        faqTriggers.forEach((otherTrigger) => {
            if (otherTrigger !== activeTrigger) {
                otherTrigger.setAttribute("aria-expanded", "false");
                const otherContentId = otherTrigger.getAttribute("aria-controls");
                const otherContent = document.getElementById(otherContentId);
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                }
            }
        });

        // Alternar el elemento seleccionado
        if (isExpanded) {
            activeTrigger.setAttribute("aria-expanded", "false");
            contentEl.style.maxHeight = null;
        } else {
            activeTrigger.setAttribute("aria-expanded", "true");
            contentEl.style.maxHeight = `${contentEl.scrollHeight}px`;
        }
    }


    // =====================================================
    // 04. FORMULARIO HERO: VALIDACIÓN CLIENT-SIDE & CONVERSIÓN
    // =====================================================
    const heroForm = document.getElementById("hero-form");
    const heroFormContainer = document.getElementById("heroFormContainer");
    const formSuccessState = document.getElementById("formSuccessState");
    const btnResetForm = document.getElementById("btnResetForm");

    const inputNombre = document.getElementById("form-nombre");
    const inputEmail = document.getElementById("form-email");
    const inputTelefono = document.getElementById("form-telefono");
    const checkConsent = document.getElementById("form-consent");

    const groupNombre = document.getElementById("group-nombre");
    const groupEmail = document.getElementById("group-email");
    const groupTelefono = document.getElementById("group-telefono");
    const groupConsent = document.getElementById("group-consent");
    const errorConsent = document.getElementById("error-consent");
    const submitBtn = document.getElementById("form-submit-btn");

    // Expresión regular para validación de correo estándar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(input, group, condition) {
        if (!condition) {
            group.classList.add("has-error");
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            return false;
        } else {
            group.classList.remove("has-error");
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            return true;
        }
    }

    // Limpieza de estados de error al escribir
    if (inputNombre) {
        inputNombre.addEventListener("input", () => {
            validateField(inputNombre, groupNombre, inputNombre.value.trim().length >= 3);
        });
    }

    if (inputEmail) {
        inputEmail.addEventListener("input", () => {
            validateField(inputEmail, groupEmail, emailRegex.test(inputEmail.value.trim()));
        });
    }

    if (inputTelefono) {
        inputTelefono.addEventListener("input", () => {
            const cleanTel = inputTelefono.value.replace(/\D/g, "");
            validateField(inputTelefono, groupTelefono, cleanTel.length >= 7);
        });
    }

    if (checkConsent) {
        checkConsent.addEventListener("change", () => {
            if (checkConsent.checked) {
                if (errorConsent) errorConsent.style.display = "none";
            }
        });
    }

    if (heroForm) {
        heroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validar todos los campos antes de enviar
            const isNameValid = validateField(inputNombre, groupNombre, inputNombre.value.trim().length >= 3);
            const isEmailValid = validateField(inputEmail, groupEmail, emailRegex.test(inputEmail.value.trim()));
            const cleanTel = inputTelefono.value.replace(/\D/g, "");
            const isTelValid = validateField(inputTelefono, groupTelefono, cleanTel.length >= 7);
            const isConsentValid = checkConsent.checked;

            if (!isConsentValid) {
                if (errorConsent) errorConsent.style.display = "block";
            } else {
                if (errorConsent) errorConsent.style.display = "none";
            }

            if (!isNameValid || !isEmailValid || !isTelValid || !isConsentValid) {
                // Enfocar el primer campo inválido
                if (!isNameValid) inputNombre.focus();
                else if (!isEmailValid) inputEmail.focus();
                else if (!isTelValid) inputTelefono.focus();
                return;
            }

            // Simulación de envío con estado de carga accesible
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>PROCESANDO SOLICITUD...</span> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

            setTimeout(() => {
                // Transición al estado de éxito
                heroForm.style.display = "none";
                if (formSuccessState) {
                    formSuccessState.classList.add("active");
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Scroll suave hacia el contenedor para asegurar visibilidad en móviles
                heroFormContainer.scrollIntoView({ behavior: "smooth", block: "center" });

                // Logging de desarrollo para conexión de backend
                console.info("[NOVA LEAD CAPTURED // DEMO STATE]", {
                    nombre: inputNombre.value.trim(),
                    email: inputEmail.value.trim(),
                    telefono: inputTelefono.value.trim(),
                    interes: document.getElementById("form-interes") ? document.getElementById("form-interes").value : "general",
                    timestamp: new Date().toISOString()
                });
            }, 600);
        });
    }

    // Botón para reiniciar formulario y enviar otra consulta
    if (btnResetForm) {
        btnResetForm.addEventListener("click", () => {
            if (heroForm) {
                heroForm.reset();
                heroForm.style.display = "block";
                [inputNombre, inputEmail, inputTelefono].forEach((inp) => {
                    inp.classList.remove("is-valid", "is-invalid");
                });
                [groupNombre, groupEmail, groupTelefono].forEach((grp) => {
                    grp.classList.remove("has-error");
                });
            }
            if (formSuccessState) {
                formSuccessState.classList.remove("active");
            }
            if (inputNombre) inputNombre.focus();
        });
    }


    // =====================================================
    // 05. ENRUTAMIENTO FLUIDO DE CTAs DIRECTO AL FORMULARIO
    // =====================================================
    const ctaTargets = document.querySelectorAll("a[href='#hero-form'], a[href='#hero']");

    ctaTargets.forEach((cta) => {
        cta.addEventListener("click", (e) => {
            const href = cta.getAttribute("href");
            if (href === "#hero-form" || href === "#hero") {
                e.preventDefault();

                if (heroFormContainer) {
                    heroFormContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    // Resaltar visualmente el formulario con pulso de atención
                    heroFormContainer.classList.add("form-highlight");
                    setTimeout(() => {
                        heroFormContainer.classList.remove("form-highlight");
                    }, 1800);

                    // Enfocar el primer input
                    if (inputNombre && heroForm.style.display !== "none") {
                        setTimeout(() => inputNombre.focus(), 600);
                    }
                }
            }
        });
    });

    // Enlaces internos generales
    const internalLinks = document.querySelectorAll("a[href^='#']:not([href='#hero-form']):not([href='#hero'])");
    internalLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

});