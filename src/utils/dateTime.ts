export interface FormatDateTimeOptions {
  includeTime?: boolean
  includeSeconds?: boolean
  useUTC?: boolean
  dateSeparator?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

const toValidDate = (value: Date | string | number): Date | null => {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export const formatDateTime = (
  value: Date | string | number,
  options: FormatDateTimeOptions = {},
) => {
  const {
    includeTime = true,
    includeSeconds = false,
    useUTC = false,
    dateSeparator = '-',
  } = options

  const date = toValidDate(value)

  if (!date) {
    return ''
  }

  const year = useUTC ? date.getUTCFullYear() : date.getFullYear()
  const month = useUTC ? date.getUTCMonth() + 1 : date.getMonth() + 1
  const day = useUTC ? date.getUTCDate() : date.getDate()

  const datePart = [year, pad(month), pad(day)].join(dateSeparator)

  if (!includeTime) {
    return datePart
  }

  const hour = useUTC ? date.getUTCHours() : date.getHours()
  const minute = useUTC ? date.getUTCMinutes() : date.getMinutes()
  const second = useUTC ? date.getUTCSeconds() : date.getSeconds()

  const timeParts = [pad(hour), pad(minute)]

  if (includeSeconds) {
    timeParts.push(pad(second))
  }

  return `${datePart} ${timeParts.join(':')}`
}
