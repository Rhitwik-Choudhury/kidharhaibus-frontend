import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 transition"
      title="Toggle Theme"
    >
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-black" />}
    </button>
  );
};

export default ThemeToggle;
