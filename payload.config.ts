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
import { Pricing } from './src/globals/Pricing'

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
    components: {
      graphics: {
        Logo: '/src/components/Logo',
        Icon: '/src/components/Icon',
      },
    },
  },
  collections: [Users, Media, Programs, Testimonials, TeamMembers, FAQs, BlogPosts],
  globals: [SiteSettings, HomePage, Navigation, WeeklySchedule, Pricing],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 3,
      min: 0,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000,
    },
    // schema push is expensive on every cold start — only run locally
    push: process.env.NODE_ENV !== 'production',
  }),
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'production') return

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

        // Backfill seeded posts that got inserted before the category column existed
        await pool.query(`UPDATE blog_posts SET category = 'maths' WHERE category IS NULL`)

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
      const existingPosts = await payload.find({ collection: 'blog-posts', limit: 1 })
      if (existingPosts.totalDocs === 0) {
        payload.logger.info('Seeding blog posts...')
        const makeContent = (paragraphs: string[]) => ({
          root: {
            type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
            children: paragraphs.map((text) => ({
              type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
              children: [{ type: 'text', version: 1, detail: 0, format: 0, mode: 'normal', style: '', text }],
            })),
          },
        })
        const SEED_POSTS = [
          {
            title: '5 Vedic Maths Tricks Every Student Should Know',
            slug: '5-vedic-maths-tricks-every-student-should-know',
            excerpt: 'Speed up your mental arithmetic with these five ancient Vedic techniques that top students use to solve problems in seconds — no calculator needed.',
            category: 'maths',
            publishedDate: '2025-03-10T00:00:00.000Z',
            featured: true,
            content: makeContent([
              'Mental maths is one of the most underrated skills in school — and Vedic Maths gives students a serious edge. These techniques, rooted in ancient Indian mathematics, let you solve complex arithmetic in your head faster than most people can reach for a calculator.',
              'Trick 1: Multiply any number by 11 instantly. To multiply a two-digit number by 11, simply add the two digits and place the result in the middle. For example, 36 × 11: add 3 + 6 = 9, so the answer is 396. If the sum exceeds 9, carry the 1 — so 75 × 11: 7 + 5 = 12, making the answer 825.',
              'Trick 2: Square numbers ending in 5. To square any number ending in 5, multiply the tens digit by the next number up, then append 25. So 65² = (6 × 7) followed by 25 = 4225. This works every time and can be done in under two seconds.',
              'Trick 3: Subtract from 1000 the easy way. Instead of borrowing across multiple columns, subtract each digit from 9 — except the last, which you subtract from 10. So 1000 − 638: 9−6=3, 9−3=6, 10−8=2. Answer: 362. Instant.',
              'Trick 4: Multiply numbers close to 100. Take 96 × 97. Find how far each is from 100: 4 and 3. The answer\'s last two digits are 4 × 3 = 12. The first two digits are 100 − 4 − 3 = 93. Answer: 9312. Works beautifully for selective entry and scholarship exam papers.',
              'Trick 5: The butterfly method for fractions. To add or compare fractions without finding a common denominator, cross-multiply and add the results for the numerator, then multiply the denominators. It\'s fast, visual, and surprisingly reliable.',
              'These techniques are at the heart of our Speed Maths Program, where students across Grade 3–9 practice them weekly until they become second nature. The goal isn\'t just speed — it\'s building number sense that makes all of maths easier.',
            ]),
          },
          {
            title: 'How to Ace the VIC Selective Entry Maths Test',
            slug: 'how-to-ace-vic-selective-entry-maths-test',
            excerpt: 'The Selective Entry maths section is all about speed and reasoning, not just knowing your times tables. Here\'s what the top-scoring students do differently.',
            category: 'maths',
            publishedDate: '2025-04-02T00:00:00.000Z',
            featured: false,
            content: makeContent([
              'Every year, thousands of Year 6 students across Victoria sit the Selective Entry exam — and the maths section is where the strongest candidates pull ahead. It\'s not a test of the school curriculum alone. It tests how quickly and accurately you can reason with numbers under pressure.',
              'Understand the question types. The VIC Selective maths section includes number operations, fractions and decimals, patterns and algebra, measurement, and word problems. The word problems are the hardest — they require you to read carefully, identify what\'s being asked, and choose the right operation before you even touch your pencil.',
              'Speed is everything. Most students know the maths; the challenge is finishing in time. Students who score in the top band typically answer each question in under 60 seconds. That means you need automatic recall of multiplication facts, fraction rules, and percentage formulas — not slow, step-by-step working.',
              'Practice with timed papers. Doing 10 questions in 15 minutes each Sunday is worth more than two hours of untimed homework. Timed practice builds the habit of moving on when stuck — one of the most important exam skills there is.',
              'Analyse every mistake. When you get a question wrong, don\'t just look at the answer. Ask: did I misread it? Did I use the wrong method? Did I rush? Categorising errors helps you fix the root cause rather than the symptom.',
              'Our Selective Entry VIC program runs weekly sessions targeting exactly these skills — timed problem sets, worked solution reviews, and monthly mock exams that mirror the actual test format. Students who complete the full program consistently outperform their peers on exam day.',
            ]),
          },
          {
            title: 'Why Mental Maths Still Matters in the Age of Calculators',
            slug: 'why-mental-maths-still-matters',
            excerpt: 'With calculators in every pocket, why bother training mental arithmetic? The answer goes deeper than just exam rules — it shapes how students think.',
            category: 'maths',
            publishedDate: '2025-04-20T00:00:00.000Z',
            featured: false,
            content: makeContent([
              'Parents sometimes ask us: if kids will always have access to calculators, why are we spending time on mental maths? It\'s a fair question — and the answer is more important than most people expect.',
              'Mental maths builds number sense. When students can estimate answers and check whether a result is reasonable, they catch errors that calculators never will. A student who blindly types 3.5 × 20 and reads back "700" won\'t notice something\'s wrong unless they have an instinct for what the answer should be.',
              'It trains working memory. Holding intermediate steps in mind while solving a problem is exactly what working memory does — and it\'s the same cognitive muscle used in reading comprehension, science reasoning, and essay writing. Mental maths is essentially a workout for the brain.',
              'Exam conditions demand it. In the VIC and NSW Selective Entry exams, the Scholarship exam, and many NAPLAN sections, calculators are not permitted. Students who haven\'t trained their mental arithmetic arrive at these exams without one of their most important tools.',
              'Speed creates confidence. When basic operations are automatic, students can direct their full attention to the harder reasoning in a problem. Slow arithmetic is a bottleneck — it drains mental energy and increases anxiety.',
              'At The Online Kids, our Speed Maths Program uses techniques from Vedic, Chinese, Arabic, and Japanese traditions to make arithmetic fast and intuitive. Students in the program regularly cut their working time in half within the first term — not by working harder, but by working smarter.',
            ]),
          },
          {
            title: 'Scholarship Exam Maths: What to Expect and How to Prepare',
            slug: 'scholarship-exam-maths-what-to-expect',
            excerpt: 'The scholarship exam maths section is harder than school maths but very learnable. Here\'s a clear breakdown of what\'s tested and how to prepare from Grade 4.',
            category: 'maths',
            publishedDate: '2025-05-05T00:00:00.000Z',
            featured: false,
            content: makeContent([
              'Scholarship exams in Victoria and NSW — including those for independent and Catholic schools — test maths well above the standard school curriculum for the year level. A Grade 5 student sitting a scholarship exam is expected to handle material typically covered in Grade 6 or early Grade 7.',
              'What topics are covered? Scholarship maths typically includes whole number operations, fractions, decimals and percentages, ratio and proportion, basic algebra and patterns, area and perimeter, time and distance problems, and data interpretation. The harder papers also include probability and simple geometry proofs.',
              'The format matters. Questions are usually multiple choice with 30–40 questions in 40 minutes. That\'s less than 90 seconds per question — fast enough that hesitating on two or three problems can cost you a passing score.',
              'Start early. Grade 4 is not too early to begin. Students who start structured preparation 12–18 months before the exam have time to genuinely master the content, not just memorise it. Last-minute cramming rarely works for scholarship maths because the problems require flexible thinking, not recall.',
              'Focus on word problems. The questions that separate scholarship recipients from other strong students are almost always multi-step word problems. Practice reading carefully, underlining key information, and writing a brief plan before calculating.',
              'Our Scholarship Exam Prep program is structured around exactly this — weekly sessions for Grade 4, 5, and 6 students, monthly mock exams, and detailed feedback so parents know exactly where their child needs to focus next.',
            ]),
          },
        ]
        for (const post of SEED_POSTS) {
          await payload.create({ collection: 'blog-posts', data: post })
        }
        payload.logger.info('Blog posts seeded.')
      }
    } catch (err) {
      payload.logger.warn('Blog post seed skipped: ' + (err as Error).message)
    }

    try {
      const existingTeam = await payload.find({ collection: 'team-members', limit: 1 })
      if (existingTeam.totalDocs === 0) {
        payload.logger.info('Seeding team members...')
        const SEED_TEAM = [
          {
            name: 'Mr Nitesh Naveen',
            role: 'Speed Maths & High School Mathematics',
            bio: 'Over 10 years of High School Maths tutoring in Australia. Expert in Speed Maths. MBA from IIM Calcutta, Engineering in Electronics — topper throughout. Currently working as an AI specialist at a leading Melbourne bank building Maths models. Teaching Maths is his passion.',
            subjects: ['maths', 'speed-maths', 'vce', 'selective', 'scholarship'],
            bookingUrls: [
              { subject: 'maths', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'speed-maths', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'vce', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'selective', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'scholarship', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
            ],
            order: 1,
          },
          {
            name: 'Roshni Sinha',
            role: 'English, Science & Junior Mathematics',
            bio: 'Graduate of Haileybury. Provides middle and high school tutoring specialising in English, Science and junior-level Mathematics. Focuses on selective school preparation for writing, reading and verbal reasoning, while supporting students in developing confidence in science and foundational maths.',
            subjects: ['english', 'science', 'maths', 'selective', 'scholarship'],
            bookingUrls: [
              { subject: 'english', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'science', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'maths', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'selective', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'scholarship', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
            ],
            order: 2,
          },
          {
            name: 'Arjun Mehta',
            role: 'VCE Physics & Chemistry',
            bio: 'Bachelor of Science (Honours) in Physics from the University of Melbourne. Specialises in VCE Units 3 & 4 Physics and Chemistry, with a focus on exam technique and deep conceptual understanding.',
            subjects: ['vce', 'science'],
            bookingUrls: [
              { subject: 'vce', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'science', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
            ],
            order: 3,
          },
          {
            name: 'Priya Sharma',
            role: 'Scholarship Exam Prep & Primary Maths',
            bio: 'Former primary school teacher with 7 years of classroom experience. Expert in Scholarship exam preparation for Grade 4–6, including reading comprehension, written expression and numerical reasoning.',
            subjects: ['scholarship', 'maths', 'english'],
            bookingUrls: [
              { subject: 'scholarship', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'maths', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
              { subject: 'english', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
            ],
            order: 4,
          },
          {
            name: 'Daniel Park',
            role: 'Coding & Robotics',
            bio: 'Software engineer with a passion for teaching kids to code. Runs Python, Scratch and robotics sessions for students in Grade 3–8. Believes every child can learn to think computationally.',
            subjects: ['coding'],
            bookingUrls: [
              { subject: 'coding', url: 'https://cal.com/jeyakaran-karnan-93nkgl/free-trial-class' },
            ],
            order: 5,
          },
        ]
        for (const member of SEED_TEAM) {
          await payload.create({ collection: 'team-members', data: member })
        }
        payload.logger.info('Team members seeded.')
      }
    } catch (err) {
      payload.logger.warn('Team seed skipped: ' + (err as Error).message)
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
