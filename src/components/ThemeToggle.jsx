import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} className="ml-4 text-sm text-blue-600 dark:text-blue-400">
      {dark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
