const PAGE_PATHS: Record<string, string> = {
  'vic-selective-entry': '/programs/selective-school/vic/selective-entry-high-schools',
  'vic-super-15-batch': '/programs/selective-school/vic/super-15-batch',
  'vic-exam-jump-start': '/programs/selective-school/vic/exam-jump-start',
  'vic-crash-course': '/programs/selective-school/vic/crash-course',
  'vic-practice-test-series': '/programs/selective-school/vic/practice-test-series',
  'nsw-selective-entry': '/programs/selective-school/nsw/selective-entry-high-schools',
  'nsw-practice-test-series': '/programs/selective-school/nsw/practice-test-series',
  'vedic-maths': '/programs/maths/vedic-maths',
  contact: '/contact',
  courses: '/courses',
  'become-a-teacher': '/become-a-teacher',
  'become-a-business-associate': '/become-a-business-associate',
}

const frontend = () => process.env.FRONTEND_URL || 'http://localhost:3000'

export const pagePreviewUrl = ({ data }: { data: { slug?: string } }) => {
  const path = data?.slug && PAGE_PATHS[data.slug]
  return path ? `${frontend()}${path}` : frontend()
}

export const programPreviewUrl = ({ data }: { data: { display?: { href?: string } } }) =>
  `${frontend()}${data?.display?.href || ''}`
