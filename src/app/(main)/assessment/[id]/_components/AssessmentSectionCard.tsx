import { Icon } from "iconsax-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  icon: Icon;
  iconColor?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AssessmentSectionCard({
  title,
  icon: IconComponent,
  iconColor = "#5B5EDD",
  headerAction,
  children,
  className = "",
}: Props) {
  return (
    <div className={`flex h-fit flex-col ${className}`}>
      <div className="rounded-[15px] border-1 border-[lab(90.952% -.0000596046 0)] rounded-b-none bg-white px-[30px] py-[15px]">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="h-fit w-fit bg-light-lavendar p-3.25 rounded-full">
              <IconComponent size={24} color={iconColor} />
            </div>
            <p className="truncate text-[18px] font-medium">{title}</p>
          </div>

          {headerAction}
        </div>
      </div>

      <div className="flex flex-col">{children}</div>
    </div>
  );
}
