import React from 'react'

// simple wrapper for uniform svg lines
const Bar = ({x, y}) => {
  return (
    <rect
      width="250"
      height="40"
      fill="#1e1e1e"
      {...{x,y}}
    />
  )
}

export default function HamburgerButton (props) {
  let cn = 'HamburgerButton'

  const { active, className, ...otherProps } = props

  if (active) {
    cn += ' active'
  }

  if (className) {
    cn += ` ${className}`
  }

  return (
    <button
      type="button"

      {...otherProps}

      className={cn}
    >
      <svg viewBox="0 0 300 300">
        <Bar x="25" y="80" />
        <Bar x="25" y="170" />
        <Bar x="25" y="260" />
      </svg>
    </button>
  )
}
