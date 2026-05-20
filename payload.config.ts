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
import { BlogPosts } from './src/collections/BlogPosts'

import { SiteSettings } from './src/globals/SiteSettings'
import { HomePage } from './src/globals/HomePage'
import { Navigation } from './src/globals/Navigation'
import { WeeklySchedule } from './src/globals/WeeklySchedule'

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
  collections: [Users, Media, Programs, Testimonials, TeamMembers, FAQs, BlogPosts],
  globals: [SiteSettings, HomePage, Navigation, WeeklySchedule],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  onInit: async (payload) => {
    // Ensure any new collection columns exist in payload_locked_documents_rels
    // (push: true doesn't reliably update this table in serverless environments)
    try {
      const pool = (payload.db as any).pool
      if (pool?.query) {
        // locked_documents_rels column for blog_posts collection
        await pool.query(
          `ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS blog_posts_id integer`
        )

        // WeeklySchedule global tables (push: true doesn't create these reliably)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS weekly_schedule (
            id serial PRIMARY KEY,
            updated_at timestamp with time zone DEFAULT now() NOT NULL,
            created_at timestamp with time zone DEFAULT now() NOT NULL,
            heading varchar,
            subheading varchar
          )
        `)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS weekly_schedule_slots (
            _order integer NOT NULL,
            _parent_id integer NOT NULL REFERENCES weekly_schedule(id) ON DELETE CASCADE,
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            day varchar,
            start_time varchar,
            end_time varchar,
            subject varchar,
            description varchar,
            color_theme varchar
          )
        `)

        // BlogPosts collection table (in case push: true missed it)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id serial PRIMARY KEY,
            updated_at timestamp with time zone DEFAULT now() NOT NULL,
            created_at timestamp with time zone DEFAULT now() NOT NULL,
            title varchar NOT NULL,
            slug varchar UNIQUE,
            excerpt varchar,
            content jsonb,
            published_date timestamp with time zone,
            featured boolean DEFAULT false,
            category varchar,
            cover_image_id integer
          )
        `)
        // Add columns that may be missing from previously created tables
        await pool.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category varchar`)
        await pool.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_id integer`)

        payload.logger.info('[schema] all tables ensured')
      }
    } catch (err) {
      payload.logger.warn('[schema] ' + (err as Error).message)
    }

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

    try {
      const existingSchedule = await payload.findGlobal({ slug: 'weekly-schedule' })
      if (!existingSchedule?.slots?.length) {
        payload.logger.info('Seeding weekly schedule...')
        await payload.updateGlobal({
          slug: 'weekly-schedule',
          data: {
            heading: 'Weekly Class Schedule',
            subheading: 'Live online classes running throughout the week — pick a session that suits your schedule.',
            slots: [
              { day: 'monday',    startTime: '4:00 PM',  endTime: '5:00 PM',  subject: 'Speed Maths – Level 1',            description: 'Grade 3–5 · 1 hour',      colorTheme: 'emerald' },
              { day: 'tuesday',   startTime: '5:00 PM',  endTime: '6:30 PM',  subject: 'Selective Entry VIC',              description: 'Year 6–7 · 1.5 hours',    colorTheme: 'purple'  },
              { day: 'wednesday', startTime: '4:00 PM',  endTime: '5:00 PM',  subject: 'Speed Maths – Level 2',            description: 'Grade 6–8 · 1 hour',      colorTheme: 'emerald' },
              { day: 'thursday',  startTime: '4:30 PM',  endTime: '5:30 PM',  subject: 'English & Science Masterclass',    description: 'Grade 5–7 · 1 hour',      colorTheme: 'blue'    },
              { day: 'thursday',  startTime: '5:30 PM',  endTime: '7:00 PM',  subject: 'VCE Tutoring',                     description: 'Year 10–12 · 1.5 hours',  colorTheme: 'rose'    },
              { day: 'saturday',  startTime: '9:00 AM',  endTime: '10:30 AM', subject: 'Selective Entry VIC – Super 15',   description: 'Year 6–7 · 1.5 hours',    colorTheme: 'purple'  },
              { day: 'saturday',  startTime: '11:00 AM', endTime: '12:00 PM', subject: 'Scholarship Exam Prep',            description: 'Grade 4–6 · 1 hour',      colorTheme: 'amber'   },
              { day: 'sunday',    startTime: '10:00 AM', endTime: '11:30 AM', subject: 'Selective Entry NSW',              description: 'Year 6–7 · 1.5 hours',    colorTheme: 'cyan'    },
            ],
          },
        })
        payload.logger.info('Weekly schedule seeded.')
      }
    } catch (err) {
      payload.logger.warn('Schedule seed skipped: ' + (err as Error).message)
    }
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.SERVER_URL,
  ].filter(Boolean) as string[],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.SERVER_URL,
  ].filter(Boolean) as string[],
})
