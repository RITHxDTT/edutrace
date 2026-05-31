"use client"
import { AssessmentProps } from '@/types/assessment'
import AssessmentCard from './AssessmentCard'

export default function AssessmentList({ assessments }: AssessmentProps) {
    if (!assessments) return <div><p>No Assessment</p></div>
    return (
        <div className='grid grid-cols-3'>
            {assessments.map((assessment) => (
                <AssessmentCard key={assessment.assessmentId} title={assessment.title} assessmentType={assessment.assessmentType} description={assessment.description} />
            ))}
        </div>
    )
}
