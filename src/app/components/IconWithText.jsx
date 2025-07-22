import Image from "next/image";
import { companiesList } from "@/app/data/companies.server";
import { technologiesList } from "@/app/data/technologies.server";

export const IconWithText = ({ value, type, showText = true }) => {
  let item;

  if (type === "company") {
    item = companiesList.find((company) => company.code === value);
  } else if (type === "technology") {
    item = technologiesList.find((technology) => technology.code === value);
  }

  return (
    <div className="flex gap-2">
      <Image src={item?.logo} width={20} height={20} alt={`${type} logo`} />
      {showText && (
        <p className="font-semibold" style={{ color: `${item.color}` }}>
          {item.name}
        </p>
      )}
    </div>
  );
};

export default IconWithText;