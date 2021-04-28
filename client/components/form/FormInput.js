import React, { useRef, useState } from 'react'
import st from './FormInput.sass'
import { Component } from '../Component'

const Error = ({msg}) => <div className={st.el} key={key}>{msg}</div>

export const FormInput = ({value = '', set, type, placeholder, onInput, validate, ...props}) => {
  const [errors, setErrors] = useState([])
  const ref = useRef()
  return <Component className={st.input} {...props}>
    <input onInput={e => {
      setErrors((validate || []).map(([key, msg, check]) => check(e.target.value) && [key, msg]).filter(Boolean))
      set(e.target.value)
    }} {...{value, placeholder, ref, type}} />
    <div className={st.border} />
    <div className={st.errors}>
      {errors.map(([key, msg]) => <Error msg={msg} key={key} />)}
    </div>
  </Component>
}