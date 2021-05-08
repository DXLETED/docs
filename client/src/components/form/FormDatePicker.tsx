import React, { useRef, useState } from 'react'
import st from 'styles/FormDatePicker.module.sass'
import { Label } from 'components/Label'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { useOnClickOutside } from 'hooks/onClickOutside.hook'
import clsx from 'clsx'

interface FormDatePickerProps {
  label?: string
  value: number
  set: (value: number) => void
}
export const FormDatePicker: React.FC<FormDatePickerProps> = ({ label, value, set }) => {
  const date = moment(value || Date.now())
  const ref = useRef<HTMLDivElement | any>(null)
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside<HTMLDivElement>(ref, () => setIsOpen(false))
  const [selectedMonth, setSelectedMonth] = useState(date.month())
  const days = []
  let mdate = date.month(selectedMonth).startOf('M')
  while (mdate.month() === selectedMonth) {
    days.push(mdate.date())
    mdate = mdate.add(1, 'day')
  }
  return (
    <div className={clsx(st.datePicker, { [st.open]: isOpen })} onClick={() => setIsOpen(true)} ref={ref}>
      <Label text={label} />
      <div className={st.inner}>
        <div className={st.selected}>
          <div className={st.date}>{date.format('DD MMM YYYY')}</div>
          <div className={st.button}>
            <FontAwesomeIcon icon={faCalendar} />
          </div>
        </div>
        <div className={st.dropdown}>
          <div className={st.month}>
            <div className={st.monthButton} onClick={() => setSelectedMonth(moment().month(selectedMonth - 1).month())}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            {moment().month(selectedMonth).format('MMMM')}
            <div className={st.monthButton} onClick={() => setSelectedMonth(moment().month(selectedMonth + 1).month())}>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div>
          <div className={st.week}></div>
        </div>
      </div>
    </div>
  )
}
