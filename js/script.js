/* =========================================================
   공통 스크립트
========================================================= */

/* 상단 네비게이션 스크롤 효과 */
const nav = document.querySelector('.navbar');

if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

/* 모바일 메뉴 버튼 */
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');

if (toggle && links) {
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });
}

/* 스크롤 등장 애니메이션 */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document
    .querySelectorAll('.reveal, .card, .entry, .research-item, .research-card, .project-item, .member-link')
    .forEach((el) => observer.observe(el));

/* 메인 페이지 슬라이드 */
if (document.body.classList.contains('home-page')) {
    const wrapper = document.querySelector('.page-wrapper');

    const sections = [
        document.querySelector('.hero'),
        document.querySelector('.intro-section'),
        document.querySelector('.visual-section'),
        document.querySelector('.members-section'),
        document.querySelector('.contact')
    ].filter(Boolean);

    const dots = document.querySelectorAll('.indicator-dot');

    let currentPage = 0;
    let isMoving = false;
    let touchStartY = 0;

    function updateActivePage() {
        sections.forEach((section, index) => {
            section.classList.toggle('page-active', index === currentPage);
        });
    }

    function updateIndicator() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    function moveToPage(nextPage) {
        if (!wrapper) return;
        if (isMoving) return;
        if (nextPage < 0 || nextPage >= sections.length) return;

        currentPage = nextPage;
        isMoving = true;

        wrapper.style.transform = `translateY(-${currentPage * 100}vh)`;

        updateActivePage();
        updateIndicator();

        setTimeout(() => {
            isMoving = false;
        }, 800);
    }

    updateActivePage();
    updateIndicator();

    window.addEventListener(
        'wheel',
        (event) => {
            event.preventDefault();

            if (event.deltaY > 0) {
                moveToPage(currentPage + 1);
            } else if (event.deltaY < 0) {
                moveToPage(currentPage - 1);
            }
        },
        { passive: false }
    );

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
            moveToPage(currentPage + 1);
        }

        if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            moveToPage(currentPage - 1);
        }

        if (event.key === 'Home') {
            moveToPage(0);
        }

        if (event.key === 'End') {
            moveToPage(sections.length - 1);
        }
    });

    window.addEventListener(
        'touchstart',
        (event) => {
            touchStartY = event.touches[0].clientY;
        },
        { passive: true }
    );

    window.addEventListener(
        'touchmove',
        (event) => {
            event.preventDefault();

            const touchEndY = event.touches[0].clientY;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffY) < 45) return;

            if (diffY > 0) {
                moveToPage(currentPage + 1);
            } else {
                moveToPage(currentPage - 1);
            }

            touchStartY = touchEndY;
        },
        { passive: false }
    );

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            moveToPage(Number(dot.dataset.page));
        });
    });

    document.querySelectorAll('a[href$="#contact"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            moveToPage(sections.length - 1);

            if (links) {
                links.classList.remove('open');
            }
        });
    });
}