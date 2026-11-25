// ส่วนนี้ทำหน้าที่: เลื่อนรายการ Achievement ด้วยเมาส์
// ACHIEVEMENT_DRAG_SCROLL: drag across a badge to move the horizontal list.
    (() => {
      const initAchievementDrag = () => {
        const scrollers = Array.from(document.querySelectorAll<HTMLElement>(".quiz-achievement-list"));
        if (!scrollers.length) return;

        scrollers.forEach((scroller) => {

        let pointerId: number | "mouse" | null = null;
        let startX = 0;
        let startScrollLeft = 0;
        let moved = false;

        scroller.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pointerId = event.pointerId;
          startX = event.clientX;
          startScrollLeft = scroller.scrollLeft;
          moved = false;
          scroller.classList.add("is-dragging");
          if (scroller.setPointerCapture) scroller.setPointerCapture(pointerId);
        });

        scroller.addEventListener("pointermove", (event) => {
          if (event.pointerId !== pointerId) return;
          const deltaX = event.clientX - startX;
          if (Math.abs(deltaX) > 3) moved = true;
          scroller.scrollLeft = startScrollLeft - deltaX;
        });

        const finishDrag = (event: PointerEvent) => {
          if (event.pointerId !== pointerId) return;
          if (scroller.releasePointerCapture) scroller.releasePointerCapture(event.pointerId);
          pointerId = null;
          scroller.classList.remove("is-dragging");
        };

        scroller.addEventListener("pointerup", finishDrag);
        scroller.addEventListener("pointercancel", finishDrag);
        scroller.addEventListener("mousedown", (event) => {
          if (event.button !== 0 || pointerId !== null) return;
          pointerId = "mouse";
          startX = event.clientX;
          startScrollLeft = scroller.scrollLeft;
          moved = false;
          scroller.classList.add("is-dragging");
        });
        window.addEventListener("mousemove", (event) => {
          if (pointerId !== "mouse") return;
          const deltaX = event.clientX - startX;
          if (Math.abs(deltaX) > 3) moved = true;
          scroller.scrollLeft = startScrollLeft - deltaX;
        });
        window.addEventListener("mouseup", () => {
          if (pointerId !== "mouse") return;
          pointerId = null;
          scroller.classList.remove("is-dragging");
        });
        scroller.addEventListener("wheel", (event) => {
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
          event.preventDefault();
          scroller.scrollLeft += event.deltaY;
        }, { passive: false });
        scroller.addEventListener("click", (event) => {
          if (!moved) return;
          event.preventDefault();
          event.stopPropagation();
          moved = false;
        }, true);
        });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAchievementDrag, { once: true });
      } else {
        initAchievementDrag();
      }
    })();

    
