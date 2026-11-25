// ส่วนนี้ทำหน้าที่: ปรับขนาดแผงเมนูและแผงข้อมูลด้านข้าง

    // Keep both side panels visible in shorter desktop windows.
    document.addEventListener('DOMContentLoaded', () => {
      const quiz = document.querySelector<HTMLElement>('#quiz-view');
      const home = document.querySelector<HTMLElement>('#home-view');
      const roots = [quiz, home].filter((root): root is HTMLElement => root !== null);
      if (!roots.length) return;
      roots.forEach(root => {
        root.querySelectorAll('.quiz-sidebar, .quiz-info, .home-sidebar, .home-info').forEach(panel => {
          const content = document.createElement('div');
          content.className = 'quiz-panel__content';
          while (panel.firstChild) content.appendChild(panel.firstChild);
          panel.appendChild(content);
        });
      });
      const fitPanels = () => {
        roots.forEach(root => {
          root.style.setProperty('--quiz-nav-fit', String(Math.min(1, window.innerHeight / 570)));
          root.style.setProperty('--quiz-info-fit', String(Math.min(1, window.innerHeight / 880)));
        });
      };
      fitPanels();
      window.addEventListener('resize', fitPanels);
    });
    (() => {
      const toggle = document.querySelector<HTMLElement>(".site-header__toggle");
      const navigation = document.querySelector<HTMLElement>(".site-header__nav");
      if (!toggle || !navigation) return;

      const setMenuState = (isOpen: boolean) => {
        toggle.setAttribute("aria-expanded", String(isOpen));
        navigation.classList.toggle("is-open", isOpen);
      };

      toggle.addEventListener("click", () => {
        setMenuState(toggle.getAttribute("aria-expanded") !== "true");
      });

      navigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a") && window.innerWidth <= 1024) setMenuState(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenuState(false);
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 1024) setMenuState(false);
      });
    })();
  
    
