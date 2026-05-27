"use client"
import Image from "next/image";
import {Button} from "@base-ui/react";

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Button clicked');
};

interface AiComponentProps {
    width: number,
    height: number
}

function AiComponent({width, height}: AiComponentProps) {
    return (
        <Button onClick={handleClick}
                style={{width: `${width}px`, height: `${height}px`}}
                className=' bg-accent-linear-purple hover:opacity-88 rounded-full flex items-center justify-center'>
            <Image
                width={width / 1.6}
                height={height / 1.6}
                src={"/images/ai/AI.png"}
                alt="AI Logo"
                unoptimized
                loading="eager"
            />
        </Button>
    )
}

export default AiComponent


