import { useEffect } from "react";

export const FOOTER_ANIMATION_REFRESH_EVENT = "refreshFooterAnimation";

export const refreshFooterAnimation = () => {
  window.dispatchEvent(new Event(FOOTER_ANIMATION_REFRESH_EVENT));
};

export const useFooterAnimationRefresh = (...deps: unknown[]) => {
  useEffect(() => {
    const timer = setTimeout(refreshFooterAnimation, 150);
    return () => clearTimeout(timer);
  }, deps);
};
