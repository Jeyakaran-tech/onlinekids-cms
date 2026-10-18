'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

// Names as they appear on the website, by section ID.
const NAMES: Record<string, string> = {
  subPrograms: 'Choose Your Program',
  schools: 'Participating Schools',
  related: 'You May Like',
  testStructure: 'Test Structure',
  programs: 'The Online Kids Programs (NSW)',
  classRows: 'Plus — Practice Test Series',
  testSeries: 'Test Series Options',
  reasons: 'Why choose The Online Kids Selective School Practice Test Course?',
  testComponents: 'What Is a Selective School Test?',
  instructors: 'Instructors',
  categories: 'All Courses (sidebar list)',
  methods: 'How We Teach',
  objectives: 'What Your Child Gains',
  courseNotes: 'Important Notes',
  courseFaqs: 'Course FAQ',
  courses: 'Courses',
  subjects: 'Subjects',
  requirements: 'Requirements',
  skills: 'Skills',
  backgrounds: 'Backgrounds',
  benefits: 'Benefits',
}

export const SectionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ key?: string; heading?: string }>()
  const name = data?.heading || (data?.key && NAMES[data.key]) || data?.key || `Section ${(rowNumber ?? 0) + 1}`
  return <span>{name}</span>
}

export default SectionRowLabel
