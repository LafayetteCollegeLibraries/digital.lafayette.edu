import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  fields: PropTypes.object,
  onReset: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelectField: PropTypes.func.isRequired,
  onWillClose: PropTypes.func,
  selected: PropTypes.array,
}

const defaultProps = {
  fields: {},
  onWillClose: () => {},
  selected: [],
}

const CLASSNAME = 'FieldSelect'

const Field = props => {
  const { className, selected, ...rest } = props

  let cn = `${CLASSNAME}-field`

  if (selected === true) {
    cn += ' selected'
  }

  if (className !== undefined) {
    cn += ` ${props.className}`
  }

  return (
    <div className={cn} {...rest}>
      {props.children}
    </div>
  )
}

const Divider = () => (
  <div className={`${CLASSNAME}-divider`} />
)

class FieldSelect extends React.PureComponent {
  constructor (props) {
    super(props)

    this.maybeCloseSelect = this.maybeCloseSelect.bind(this)
  }

  componentWillMount () {
    document.addEventListener('click', this.maybeCloseSelect)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.maybeCloseSelect)
  }

  maybeCloseSelect (event) {
    let target = event.target

    do {
      if (target.className.indexOf(CLASSNAME) > -1) {
        return
      }

      target = target.parentElement
    } while (target)

    this.props.onWillClose()
  }

  render () {
    const {
      fields,
      onReset,
      onSelectAll,
      onSelectField,
      selected,
    } = this.props
    const fieldKeys = Object.keys(fields)

    return (
      <div className={CLASSNAME}>
        <Field key="all" onClick={onSelectAll}>
          Select all fields
        </Field>

        <Field key="reset" onClick={onReset}>
          Restore defaults
        </Field>

        <Divider />

        {fieldKeys.map((key, index) => {
          const idx = selected.indexOf(key)
          const isSelected = idx > -1
          return (
            <Field
              key={`${key}-${index}`}
              onClick={() => onSelectField(key, !isSelected, idx)}
              selected={isSelected}
            >
              {fields[key]}
            </Field>
          )
        })}
      </div>
    )
  }
}

FieldSelect.propTypes = propTypes
FieldSelect.defaultProps = defaultProps

export default FieldSelect
