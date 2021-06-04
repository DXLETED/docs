import React, { FormEventHandler, useMemo, useRef, useState } from 'react'
import st from 'styles/components/input/DatePicker.module.sass'
import clsx from 'clsx'
import moment from 'moment'
import { Label } from 'components/input/Label'
import { ValidationErrors } from 'components/input/ValidationErrors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCalendar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import { capitalize } from 'lodash'

import 'moment/locale/ru'

interface DatePickerProps {
  label?: string
  value: number
  set: (value: number) => void
  errors?: string[]
  required?: boolean
  showErrors?: boolean
}
export const DatePicker: React.FC<DatePickerProps> = ({ label, value, set, errors = [], required, showErrors }) => {
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const [month, setMonth] = useState(moment(value || Date.now()).month())
  const [year, setYear] = useState(moment(value || Date.now()).year())
  const weeks = useMemo(() => {
    const days = []
    let date = moment().year(year).month(month).startOf('M').day(1)
    const end = moment().year(year).month(month).endOf('M').day(7).toDate().getTime()
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
  const addYear = () => setYear(year + 1)
  const subYear = () => setYear(year - 1)
  const onYearInput: FormEventHandler = e => setYear(parseInt((e.target as HTMLInputElement).value))
  const select = (e: React.MouseEvent, ts: number) => {
    e.stopPropagation()
    set(ts)
    setIsOpen(false)
  }
  return (
    <div
      className={clsx(st.datePicker, { [st.hasErrors]: (value || showErrors) && errors.length, [st.open]: isOpen })}
      onClick={() => setIsOpen(true)}
      ref={ref}>
      <Label text={label} required={required} />
      <div className={st.inner}>
        <div className={st.value}>
          <div className={st.date}>{value ? moment(value).format('DD MMMM YYYY') : 'Выбрать дату'}</div>
          <div className={st.button}>
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
        <div className={st.dropdown}>
          <div className={st.head}>
            <div className={st.month}>
              <div className={st.yearButton} onClick={subYear}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <div className={st.monthButton} onClick={subMonth}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <div className={st.m}>{capitalize(moment().month(month).format('MMMM'))}</div>
              <div className={st.monthButton} onClick={addMonth}>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
              <div className={st.yearButton} onClick={addYear}>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className={st.year}>
              <input value={year.toString()} onInput={onYearInput} />
            </div>
          </div>
          <div className={st.days}>
            {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(dotw => (
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
                    onClick={e => select(e, ts)}
                    key={dayI}>
                    {d}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ValidationErrors errors={errors} visible={!!value || !!showErrors} />
    </div>
  )
}
