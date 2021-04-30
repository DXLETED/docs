import React from 'react'
import st from 'styles/Signers.module.sass'

import imgUser from 'assets/img/user.png'

interface ISigner {
  name: string
  position: string
}
const Signer: React.FC<ISigner> = ({ name, position }) => (
  <div className={st.signer}>
    <img className={st.imgUser} src={imgUser} alt="user" />
    <div className={st.d}>
      <div className={st.name}>{name}</div>
      <div>{position}</div>
    </div>
  </div>
)

interface ISigners {
  list: Array<ISigner>
}
export const Signers: React.FC<ISigners> = ({ list, ...props }: ISigners) => (
  <div className={st.signers} {...props}>
    <div className={st.label}>Signers</div>
    <div className={st.list}>
      {list.map(({ name, position }, i) => (
        <Signer name={name} position={position} key={name + position + i} />
      ))}
    </div>
  </div>
)
