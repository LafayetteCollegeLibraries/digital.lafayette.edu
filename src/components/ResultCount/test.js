import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ResultCount from './'

const defaultProps = {
  count: 10,
}

const shallowEl = xtend => (
  shallow(<ResultCount {...defaultProps} {...xtend} />)
)

describe('<ResultCount />', function () {
  it('uses output from `props.message`', function () {
    const message = () => 'some items'

    const $el = shallowEl({message})

    expect($el.text()).to.equal(message())
  })

  it('passes (commafied, rawCount) signature to `props.message`', function (done) {
    const count = 10000
    const str = '10,000'
    const message = (commafied, rawCount) => {
      expect(commafied).to.equal(str)
      expect(rawCount).to.equal(count)
      done()
    }

    shallowEl({count, message})
  })

  it('renders the commafied number if `props.message` is null', function () {
    const count = 10000
    const str = '10,000'
    const message = null

    const $el = shallowEl({count, message})
    expect($el.text()).to.equal(str)
  })
})
