import { Button } from '@base-ui/react'
import { MagicStar } from 'iconsax-react'
import React from 'react'

interface AiComponentProps {
    width: number;
    height: number;
    color?: string; 
}

function StarComponent({ width, height, color = "black" }: AiComponentProps) {
    return (
        <Button 
            style={{ width: `${width}px`, height: `${height}px` }}
            className='flex items-center justify-center cursor-default'
        >
            <MagicStar 
                size={width} 
                variant="Bold" 
                color={color} 
            />
        </Button>
    )
}

export default StarComponent;