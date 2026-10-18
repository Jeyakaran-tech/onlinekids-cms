'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

export const StatRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string; value?: string }>()
  return <span>{data?.label ? `${data.label}: ${data.value ?? ''}` : `Card ${(rowNumber ?? 0) + 1}`}</span>
}

export default StatRowLabel
