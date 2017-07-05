import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import FieldSelect from './'

const defaultProps = {
  onReset: () => {},
  onSelectAll: () => {},
  onSelectField: () => {},
}

const shallowEl = xtend => (
  shallow(<FieldSelect {...defaultProps} {...xtend} />)
)

describe('<FieldSelect />', function () {
  it('renders a `<Field />` for each item in `props.field`', function () {
    const fields = {
      one: 'One',
      two: 'Two',
      three: 'Three',
      four: 'Four',
    }

    const fieldKeys = Object.keys(fields)
    const $el = shallowEl({fields})

    // remove key="all" + key="restore"
    const $fields = $el.find('Field')
    const $filtered = $fields.filterWhere($f => {
      const key = $f.key().replace(/\-\d+$/, '')
      return fieldKeys.indexOf(key) > -1
    })

    expect($filtered).to.have.lengthOf(fieldKeys.length)
  })

  it('sets `selected={true}` on selected fields', function () {
    const fields = {
      one: 'One',
      two: 'Two',
      three: 'Three',
    }

    const selected = ['two']
    const $el = shallowEl({fields, selected})
    const $selected = $el.find('Field')
      .findWhere(f => f.prop('selected') === true)

    expect($selected).to.have.lengthOf(selected.length)
    expect($selected.key()).to.contain(selected[0])
  })

  it('calls `onReset` when "Restore defaults" field is clicked', function (done) {
    const onReset = () => { done() }
    const $el = shallowEl({onReset})

    const $restore = $el.find('Field').findWhere(f => f.key() === 'reset')
    expect($restore).to.have.lengthOf(1)

    $restore.simulate('click')
  })

  it('calls `onSelectAll` when "Select all fields" field is clicked', function (done) {
    const onSelectAll = () => { done() }
    const $el = shallowEl({onSelectAll})

    const $selectAll = $el.find('Field').findWhere(f => f.key() === 'all')
    expect($selectAll).to.have.lengthOf(1)

    $selectAll.simulate('click')
  })

  // tough to do this one w/ a simulated dom; maybe with enzyme.render?
  it('calls `onWillClose` when click occurs outside of component')
})
