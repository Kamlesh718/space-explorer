import { useEffect, useState } from "react";

function ScreenSizeGuard({ children }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <>
      {!isDesktop && (
        <div className="screen-lock-overlay">
          This game is playable only on laptops or desktops.
        </div>
      )}
      {isDesktop && children}
    </>
  );
}

export default ScreenSizeGuard;
