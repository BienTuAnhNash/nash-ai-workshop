import { describe, expect, it } from 'vitest'

import { formatDateTime } from '../../src/utils/dateTime'

describe('formatDateTime', () => {
  const isoDate = '2026-10-02T03:04:05.000Z'

  it('formats datetime with default pattern (no seconds)', () => {
    expect(formatDateTime(isoDate, { useUTC: true })).toBe('2026-10-02 03:04')
  })

  it('includes seconds when includeSeconds is true', () => {
    expect(
      formatDateTime(isoDate, { useUTC: true, includeSeconds: true }),
    ).toBe('2026-10-02 03:04:05')
  })

  it('returns date only when includeTime is false', () => {
    expect(formatDateTime(isoDate, { useUTC: true, includeTime: false })).toBe(
      '2026-10-02',
    )
  })

  it('supports custom date separator', () => {
    expect(formatDateTime(isoDate, { useUTC: true, dateSeparator: '/' })).toBe(
      '2026/10/02 03:04',
    )
  })

  it('returns empty string for invalid date input', () => {
    expect(formatDateTime('not-a-date')).toBe('')
  })
})
