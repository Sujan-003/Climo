import { Link } from "react-router-dom";
import logo from "/logo.png";
import { useTheme } from "./context/use-theme";
import { Moon, Sun } from "lucide-react";
import logo1 from "/logo1.png";
import { CitySearch } from "./city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-1">
        <Link to={"/"}>
          <img className="h-18 w-18" src={isDark ? logo : logo1} alt="Logo" />
        </Link>

        <div className="flex gap-4">
          <CitySearch / >

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
