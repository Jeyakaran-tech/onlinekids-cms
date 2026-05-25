import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'

export const WeeklySchedule: GlobalConfig = {
  slug: 'weekly-schedule',
  access: {
    read: () => true,
    update: ({ req }) => isAuthenticated(req),
  },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    description: 'Weekly class timetable shown on the Calendar page',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Weekly Class Schedule',
    },
    {
      name: 'subheading',
      type: 'text',
      defaultValue: 'Live online classes running throughout the week — pick a session that suits your schedule.',
    },
    {
      name: 'slots',
      type: 'array',
      label: 'Class Slots',
      admin: { description: 'Add one entry per class session' },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          admin: { description: 'e.g. 9:00 AM — leave blank if TBA' },
        },
        {
          name: 'endTime',
          type: 'text',
          admin: { description: 'e.g. 10:00 AM — leave blank if TBA' },
        },
        {
          name: 'subject',
          type: 'text',
          required: true,
          admin: { description: 'e.g. Speed Maths – Level 1' },
        },
        {
          name: 'description',
          type: 'text',
          admin: { description: 'Grade range — e.g. Grade 3–5' },
        },
        {
          name: 'section',
          type: 'select',
          defaultValue: 'term',
          options: [
            { label: 'During School (Weekly)', value: 'term' },
            { label: 'School Holidays Bootcamp', value: 'holidays' },
          ],
          admin: { description: 'Which calendar section this slot belongs to' },
        },
        {
          name: 'colorTheme',
          type: 'select',
          options: [
            { label: 'Purple', value: 'purple' },
            { label: 'Amber', value: 'amber' },
            { label: 'Emerald', value: 'emerald' },
            { label: 'Blue', value: 'blue' },
            { label: 'Rose', value: 'rose' },
            { label: 'Cyan', value: 'cyan' },
          ],
          defaultValue: 'purple',
        },
      ],
    },
  ],
}
