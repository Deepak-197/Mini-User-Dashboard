import { useEffect, useState } from "react";

export default function LightDarkToggleMode() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.querySelector(".app").classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <div className="toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <span className="slider"></span>
        </label>
       
        <span>{theme === "light" ? "Light" : "Dark"}</span>
      </div>
    </>
  );
}
