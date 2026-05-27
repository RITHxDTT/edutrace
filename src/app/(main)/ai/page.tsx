import AiComponent from "@/components/AI/_components/AiComponent";
import CardAI from "@/components/AI/CardAI";

export default function page(){
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <CardAI/>
            <AiComponent width={70} height={70} />
        </div>
    )
}