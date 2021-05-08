import React, { useMemo, useRef, useState } from 'react'
import st from 'styles/FormDatePicker.module.sass'
import { Label } from 'components/Label'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import clsx from 'clsx'
import { FormInput } from './FormInput'
import { ValidationErrors } from 'components/ValidationErrors'

interface FormDatePickerProps {
  label?: string
  value: number
  set: (value: number) => void
  errors?: string[]
}
export const FormDatePicker: React.FC<FormDatePickerProps> = ({ label, value, set, errors = [] }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const [month, setMonth] = useState(moment(value || Date.now()).month())
  const [year, setYear] = useState(
    moment(value || Date.now())
      .year()
      .toString()
  )
  const weeks = useMemo(() => {
    const days = []
    let mdate = moment().year(parseInt(year)).month(month).startOf('M').day(0)
    const end = moment().year(parseInt(year)).month(month).endOf('M').day(6).toDate().getTime()
    while (mdate.toDate().getTime() < end) {
      days.push([
        mdate.date(),
        mdate.month() === month,
        mdate.hour(0).minute(0).second(0).millisecond(0).toDate().getTime(),
      ])
      mdate = mdate.add(1, 'day')
    }
    return days.reduce((acc: [number, boolean, number][][], day, i) => {
      const chunkIndex = Math.floor(i / 7)
      !acc[chunkIndex] && acc.push([])
      acc[chunkIndex].push(day as [number, boolean, number])
      return acc
    }, [])
  }, [month, year])
  return (
    <div className={clsx(st.datePicker, { [st.hasErrors]: errors.length, [st.open]: isOpen })} onClick={() => setIsOpen(true)} ref={ref}>
      <Label text={label} />
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
              <div
                className={st.monthButton}
                onClick={() => setMonth(moment().month(month).subtract(1, 'month').month())}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              {moment().month(month).format('MMMM')}
              <div className={st.monthButton} onClick={() => setMonth(moment().month(month).add(1, 'month').month())}>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className={st.year}>
              <FormInput value={year} set={setYear} center flex />
            </div>
          </div>
          <div className={st.days}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(dotw => (
              <div className={st.dotw} key={dotw}>{dotw}</div>
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
      <ValidationErrors errors={errors} visible={!!errors?.length} />
    </div>
  )
}
