import Image from "next/image";
import { companiesList } from "@/app/data/companies.server";
import { technologiesList } from "@/app/data/technologies.server";

export const IconWithText = ({
  value,
  type,
  showText = true,
  showTooltip = false,
  className = ""
}) => {
  let item;

  if (type === "company") {
    item = companiesList.find((company) => company.code === value);
  } else if (type === "technology") {
    item = technologiesList.find((technology) => technology.code === value);
  }

  if (!item) return null;

  const content = (
    <div className={`flex gap-2 items-center justify-start ${className}`}>
      <Image
        src={item.logo}
        width={20}
        height={20}
        alt={item.name}
        className="flex-shrink-0"
      />
      {showText && (
        <p className="font-semibold" style={{ color: item.color }}>
          {item.name}
        </p>
      )}
    </div>
  );

  // Wrap with DaisyUI tooltip if showTooltip is true and text is hidden
  if (showTooltip && !showText) {
    return (
      <div className="tooltip tooltip-top" data-tip={item.name}>
        {content}
      </div>
    );
  }

  return content;
};

export default IconWithText;