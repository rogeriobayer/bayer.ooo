import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-base-100/90 backdrop-blur-md px-6 md:px-12 py-4 font-sans font-normal uppercase text-base-content border-b border-base-300/30">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;