import { dayjs } from "../lib/dayjs"

interface formattedDateProps {
  starts_at: Date
  ends_at: Date
}

export function formattedDate({ends_at, starts_at}: formattedDateProps) {
  const formattedStartDate  = dayjs(starts_at).format('LL')
  const formattedEndDate  = dayjs(ends_at).format('LL')

  return {formattedEndDate, formattedStartDate}
}