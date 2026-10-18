'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const CardRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ program?: unknown; grade?: string; duration?: string }>()
  const facts = [data?.grade, data?.duration].filter(Boolean).join(' · ')
  return <span>{facts ? `Card ${(rowNumber ?? 0) + 1} — ${facts}` : `Card ${(rowNumber ?? 0) + 1}`}</span>
}

export default CardRowLabel
