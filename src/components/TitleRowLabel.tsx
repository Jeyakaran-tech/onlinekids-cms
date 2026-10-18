'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const TitleRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{data?.title || `Page ${(rowNumber ?? 0) + 1}`}</span>
}

export default TitleRowLabel
