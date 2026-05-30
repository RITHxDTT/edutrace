import { Button } from '@base-ui/react'
import Image from 'next/image';
import React from 'react'

interface AiComponentProps {
    width: number;
    height: number;
    color?: string; 
}

function StarComponent({ width, height }: AiComponentProps) {
    return (
        <Button 
            style={{ width: `${width}px`, height: `${height}px` }}
            className='flex items-center justify-center cursor-default'
        >   
            
            <Image
                src={"/images/ai/Logo.png"}
                alt="Star"
                width={width}
                height={height}
            />
        </Button>
    )
}

export default StarComponent;