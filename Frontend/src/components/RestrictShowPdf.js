import { useEffect } from "react";

export const DisableRightClickAndShortcuts = () => {
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    const disablekeyboardShortcuts = (e) => {
      if (e.ctrlKey || e.metakey) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disablekeyboardShortcuts);
    return () => {
      document.addEventListener("contextmenu", disableContextMenu);
      document.addEventListener("keydown", disablekeyboardShortcuts);
    };
  }, []);
  return null;
};
