import { AssessmentProps } from '@/types/assessment'
import AssessmentCard from './AssessmentCard'

export default function AssessmentList({ assessments }: AssessmentProps) {
    if (!assessments) return <div><p>No Assessment</p></div>

    return (
        <div className='grid grid-cols-3'>
            {assessments.map((assessment) => {
                return (
                    <AssessmentCard key={assessment.assessmentId} assessmentId={assessment.assessmentId} title={assessment.title} description={assessment.description} subject={assessment.subject} status={assessment.status} startAt={assessment.startAt} dueAt={assessment.dueAt} assignedBy={assessment.assignedBy} />
                )
            })}
        </div>
    )
}
