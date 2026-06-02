import { AssessmentType } from '@/types/assessment'
import { Note } from 'iconsax-react'
import React from 'react'

export default function InstructionDetailPage({ assessment }: { assessment: AssessmentType }) {
  console.log(assessment)

  return (
    <div>
      {/* Header */}
      <div className='rounded-[15px] rounded-b-none bg-white px-[30px] py-[15px]'>
        <div className='flex items-center gap-2'>
          <div className="h-fit w-fit bg-light-lavendar p-3.25 rounded-full">
            <Note size={24} color="#5B5EDD" />
          </div>
          <p className='text-[18px] font-medium'>Assessment Description</p>
        </div>
      </div>

      {/* Description */}
            
    </div>
  )
}