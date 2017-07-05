import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import SearchBaseForm from './'

const defaultProps = {
  onSubmit: () => {},
}

const mountEl = xtend => (
  mount(<SearchBaseForm {...defaultProps} {...xtend} />)
)

describe('<SearchBaseForm />', function () {
  it('calls `props.onSubmit` when `.SearchBaseForm button` is clicked', function (done) {
    const onSubmit = () => { done() }

    const $el = mountEl({onSubmit})

    $el.find('button').simulate('click', { preventDefault: () => {} })
  })

  it('passes the `input` value to `props.onSubmit`', function (done) {
    const value = 'some input value'

    const onSubmit = v => {
      expect(v).to.equal(value)
      done()
    }

    const $el = mountEl({onSubmit})
    const $input = $el.find('input[type="text"]')

    // see: https://stackoverflow.com/a/40241332
    $input.node.value = value

    $el.find('form').simulate('submit', { preventDefault: () => {}})
  })
})
