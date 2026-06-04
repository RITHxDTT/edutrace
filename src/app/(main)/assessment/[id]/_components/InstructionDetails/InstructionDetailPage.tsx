import { AssessmentType } from '@/types/assessment'
import { Note } from 'iconsax-react'
import DescriptionRender from './_components/DescriptionRender'
import AssessmentSectionCard from '../AssessmentSectionCard'
import AssessmentTime from '../AssessmentTime/AssessmentTime'
import GradingRubric from '../GradingRubric/GradingRubric'
import AttachmentDetailPage from '../AttachmentDetails/AttachmentDetailPage'
import NavbarTitle from '@/components/Topbar/NavbarTitle'

export default function InstructionDetailPage({ assessment }: { assessment: AssessmentType }) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-5">
      <NavbarTitle title='Assessment' override/>
      <AssessmentSectionCard title="Assessment Description" icon={Note}>
        <DescriptionRender description={assessment.description} />
      </AssessmentSectionCard>
      <AttachmentDetailPage resources={assessment.resources ?? []} />
      <GradingRubric assessment={assessment} />
      <AssessmentTime assessment={assessment} />
    </div>
  )
}
