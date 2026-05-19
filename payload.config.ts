import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Programs } from './src/collections/Programs'
import { Testimonials } from './src/collections/Testimonials'
import { TeamMembers } from './src/collections/TeamMembers'
import { FAQs } from './src/collections/FAQs'

import { SiteSettings } from './src/globals/SiteSettings'
import { HomePage } from './src/globals/HomePage'
import { Navigation } from './src/globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SEED_PROGRAMS = [
  {
    title: 'Selective Entry Victoria',
    slug: 'selective-entry-victoria',
    tagline: 'Expert coaching for VIC Selective Entry with a 100% success rate. Four tailored programs from Year 7 — group tutoring, crash course, jump start and mock test series.',
    features: [
      { feature: 'Super 15 Batch' },
      { feature: 'Exam Jump Start' },
      { feature: 'Crash Course' },
      { feature: 'Test Series (10 Papers)' },
    ],
    display: { icon: 'graduation-cap', colorTheme: 'purple' as const, tag: '100% Success', href: '/programs/selective-school/vic/selective-entry-high-schools' },
    featured: true,
    order: 1,
  },
  {
    title: 'Scholarship Exam Prep',
    slug: 'scholarship-exam-prep',
    tagline: 'One-year online program for Grade 4–6 students. Structured weekly classes, monthly mock exams with parent-teacher feedback, and intensive practice in the final two months.',
    features: [
      { feature: 'Grade 4, 5 & 6' },
      { feature: '2 Classes / Week' },
      { feature: 'Monthly Mock Exams' },
      { feature: 'Weekly Assignments' },
    ],
    display: { icon: 'trophy', colorTheme: 'amber' as const, tag: 'Grade 4–6', href: '/programs/scholarship' },
    featured: true,
    order: 2,
  },
  {
    title: 'Speed Maths Program',
    slug: 'speed-maths',
    tagline: 'Solve 50 questions in 30 minutes using Indian Vedic Maths, Ancient Chinese, Arabic and Japanese techniques — aligned to the Australian curriculum. Level 1, 2, 3, and 4.',
    features: [
      { feature: 'Vedic Maths' },
      { feature: 'Chinese & Japanese Techniques' },
      { feature: 'Australian Curriculum' },
      { feature: 'Level 1, 2, 3, and 4 — move up after an exam' },
    ],
    display: { icon: 'calculator', colorTheme: 'emerald' as const, tag: 'Grade 3–9', href: '/programs/speed-maths' },
    featured: true,
    order: 3,
  },
  {
    title: 'English & Science Masterclass',
    slug: 'english-masterclass',
    tagline: 'Writing, Reading, Reasoning and Science — taught by 100% Australia-based tutors with excellent ATAR and Selective School results. Aligned to the Australian curriculum.',
    features: [
      { feature: 'Writing & Reading' },
      { feature: 'Verbal Reasoning' },
      { feature: 'Science' },
      { feature: 'Level 1, 2, 3, and 4 — move up after an exam' },
    ],
    display: { icon: 'book-open', colorTheme: 'blue' as const, tag: 'Grade 3–9', href: '/programs/english-masterclass' },
    featured: true,
    order: 4,
  },
  {
    title: 'VCE Tutoring Yr 10–12',
    slug: 'vce-tutoring',
    tagline: 'Achieve a 99.95 ATAR with coaching in Maths, English, Physics, Chemistry and Biology — taught by ex-teachers from Selective Schools and tutors with exceptional ATAR scores.',
    features: [
      { feature: 'VCE Maths & English' },
      { feature: 'Physics & Chemistry' },
      { feature: 'Biology' },
      { feature: 'Exceptional Grade 9 Welcome' },
    ],
    display: { icon: 'flask-conical', colorTheme: 'rose' as const, tag: '99.95 ATAR', href: '/programs/vce-tutoring' },
    featured: true,
    order: 5,
  },
  {
    title: 'Selective Entry NSW',
    slug: 'selective-entry-nsw',
    tagline: 'Comprehensive preparation for NSW Selective High School Entry with practice test series and expert coaching.',
    features: [
      { feature: 'Practice Test Series (5 & 10 Papers)' },
      { feature: 'English, Writing, Maths & GA' },
      { feature: 'Doubt-Clearing Sessions' },
      { feature: 'NSW Curriculum Aligned' },
    ],
    display: { icon: 'graduation-cap', colorTheme: 'cyan' as const, tag: 'NSW', href: '/programs/selective-school/nsw/selective-entry-high-schools' },
    featured: false,
    order: 6,
  },
]

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3001',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Online Kids CMS',
    },
  },
  collections: [Users, Media, Programs, Testimonials, TeamMembers, FAQs],
  globals: [SiteSettings, HomePage, Navigation],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  onInit: async (payload) => {
    try {
      const existing = await payload.find({ collection: 'programs', limit: 1 })
      if (existing.totalDocs === 0) {
        payload.logger.info('Seeding programs...')
        for (const program of SEED_PROGRAMS) {
          await payload.create({ collection: 'programs', data: program })
        }
        payload.logger.info('Programs seeded.')
      }
    } catch (err) {
      payload.logger.warn('onInit seed skipped: ' + (err as Error).message)
    }
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
  csrf: [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
})
