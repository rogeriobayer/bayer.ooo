import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between bg-stone-50/80 backdrop-blur-md p-[2em] font-sans font-normal uppercase text-gray-900 border-b border-gray-100/50 gap-4 md:gap-0">
      <Logo />
      <LanguageSelector />
    </header>
  );
};

export default Header;