// ระบบภาษาแบบส่วนกลาง (ค่าเริ่มต้นภาษาอังกฤษ EN 100% — เปลี่ยนเป็นภาษาไทย TH เฉพาะเมื่อเลือกใน Settings)
namespace LearningHausI18n {
  export type Lang = "en" | "th";

  export const getLang = (): Lang => {
    if (document.documentElement.lang === "th") return "th";
    if (document.documentElement.lang === "en") return "en";
    try {
      return window.localStorage.getItem("learninghaus.lang") === "th" ? "th" : "en";
    } catch {
      return "en";
    }
  };

  export const isThai = (): boolean => getLang() === "th";

  export const t = (en: string, th: string): string => (getLang() === "th" ? th : en);

  export const applyDom = (lang?: Lang): void => {
    const active: Lang = lang || getLang();
    const isTh = active === "th";

    document.querySelectorAll<HTMLElement>("[data-i18n-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nTh : el.dataset.i18nEn;
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll<HTMLElement>("[data-i18n-html-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nHtmlTh : el.dataset.i18nHtmlEn;
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-i18n-placeholder-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nPlaceholderTh : el.dataset.i18nPlaceholderEn;
      if (value !== undefined) el.placeholder = value;
    });

    document.querySelectorAll<HTMLElement>("[data-i18n-title-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nTitleTh : el.dataset.i18nTitleEn;
      if (value !== undefined) el.title = value;
    });

    document.querySelectorAll<HTMLElement>("[data-i18n-aria-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nAriaTh : el.dataset.i18nAriaEn;
      if (value !== undefined) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll<HTMLElement>("[data-i18n-label-en]").forEach((el) => {
      const value = isTh ? el.dataset.i18nLabelTh : el.dataset.i18nLabelEn;
      if (value !== undefined) el.setAttribute("label", value);
    });
  };
}
Object.assign(window, { LearningHausI18n });
