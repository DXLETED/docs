import React, { useMemo, useRef, useState } from 'react'
import st from 'styles/components/DatePicker.module.sass'
import clsx from 'clsx'
import moment from 'moment'
import { Input } from './Input'
import { Label } from 'components/input/Label'
import { ValidationErrors } from 'components/input/ValidationErrors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'

interface DatePickerProps {
  label?: string
  value: number
  set: (value: number) => void
  errors?: string[]
  required?: boolean
}
export const DatePicker: React.FC<DatePickerProps> = ({ label, value, set, errors = [], required }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const [month, setMonth] = useState(moment(value || Date.now()).month())
  const [year, setYear] = useState(moment(value || Date.now()).year())
  const weeks = useMemo(() => {
    const days = []
    let date = moment().year(year).month(month).startOf('M').day(0)
    const end = moment().year(year).month(month).endOf('M').day(6).toDate().getTime()
    while (date.toDate().getTime() < end) {
      days.push([
        date.date(),
        date.month() === month,
        date.hour(0).minute(0).second(0).millisecond(0).toDate().getTime(),
      ])
      date = date.add(1, 'day')
    }
    return days.reduce((acc: [number, boolean, number][][], day, i) => {
      const chunkIndex = Math.floor(i / 7)
      !acc[chunkIndex] && acc.push([])
      acc[chunkIndex].push(day as [number, boolean, number])
      return acc
    }, [])
  }, [month, year])
  const subMonth = () => {
    const val = moment().month(month).subtract(1, 'month').month()
    setMonth(val)
    val === 11 && setYear(year - 1)
  }
  const addMonth = () => {
    const val = moment().month(month).add(1, 'month').month()
    setMonth(val)
    val === 0 && setYear(year + 1)
  }
  return (
    <div
      className={clsx(st.datePicker, { [st.hasErrors]: value && errors.length, [st.open]: isOpen })}
      onClick={() => setIsOpen(true)}
      ref={ref}>
      <Label text={label} required={required} />
      <div className={st.inner}>
        <div className={st.value}>
          <div className={st.date}>{value ? moment(value).format('DD MMM YYYY') : 'Choose a date'}</div>
          <div className={st.button}>
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
        <div className={st.dropdown}>
          <div className={st.head}>
            <div className={st.month}>
              <div className={st.monthButton} onClick={subMonth}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              {moment().month(month).format('MMMM')}
              <div className={st.monthButton} onClick={addMonth}>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className={st.year}>
              <Input value={year.toString()} set={n => setYear(parseInt(n))} center flex />
            </div>
          </div>
          <div className={st.days}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(dotw => (
              <div className={st.dotw} key={dotw}>
                {dotw}
              </div>
            ))}
          </div>
          <div className={st.weeks}>
            {weeks.map((w, weekI) => (
              <div className={st.week} key={weekI}>
                {w.map(([d, isCurrentMonth, ts], dayI) => (
                  <div
                    className={clsx(st.day, { [st.isCurrentMonth]: isCurrentMonth, [st.selected]: value === ts })}
                    onClick={() => set(ts)}
                    key={dayI}>
                    {d}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ValidationErrors errors={errors} visible={!!value} />
    </div>
  )
}
