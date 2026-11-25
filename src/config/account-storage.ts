// ข้อมูลในเบราว์เซอร์แยกตามบัญชีที่เข้าสู่ระบบ พร้อมตัวช่วยอ่าน/เขียน JSON และเช็คผู้ใช้ปัจจุบัน
namespace LearningHausAccountStorage {
  export const key = (base: string): string => {
    const id = window.LearningHausSocial?.currentUserId?.() || 0;
    return id > 0 ? `learninghaus.user.${id}.${base}` : base;
  };

  export const readJson = <T>(baseKey: string, fallback: T): T => {
    try {
      const raw = window.localStorage.getItem(key(baseKey));
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  export const writeJson = (baseKey: string, value: unknown): void => {
    try {
      window.localStorage.setItem(key(baseKey), JSON.stringify(value));
    } catch {
      // ทำงานต่อในหน่วยความจำหาก localStorage ถูกบล็อก
    }
  };

  export const currentUserName = (): string => {
    return (window.LearningHausProfile?.getProfile()?.name || "TONOAK").trim();
  };

  export const isCurrentUser = (candidate: { userId?: number; name?: string }): boolean => {
    const currentId = window.LearningHausSocial?.currentUserId?.() || 0;
    if (currentId > 0 && candidate.userId && candidate.userId > 0) {
      return candidate.userId === currentId;
    }
    const candidateName = (candidate.name || "").trim().toUpperCase();
    const activeName = currentUserName().toUpperCase();
    return Boolean(candidateName && candidateName === activeName);
  };
}
