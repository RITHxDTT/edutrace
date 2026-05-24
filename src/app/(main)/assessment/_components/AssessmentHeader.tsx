interface Props {
  title: string;
  description: string;
  buttonText?: string;
  onClick?: () => void;
}

export default function AssessmentHeader({
  title,
  description,
  buttonText,
  onClick,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-[20px] font-bold text-[#111827] mb-1">{title}</h1>

        <p className="text-[13px] text-[#9ca3af]">{description}</p>
      </div>

      {buttonText && (
        <button
          onClick={onClick}
          className="
            bg-[#5b52e8]
            hover:bg-[#4b44d4]
            text-white
            rounded-[10px]
            px-5
            py-[10px]
            text-[13.5px]
            font-semibold
            transition-colors
            duration-150
          "
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
