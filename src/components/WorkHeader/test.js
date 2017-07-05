import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WorkHeader from './'

const defaultProps = {
  id: 'abc123'
}

const shallowEl = xtend => shallow(<WorkHeader {...defaultProps} {...xtend} />)

describe('<WorkHeader />', function () {
  it('renders the `id` prop by default', function () {
    const id = 'hey I am the id'
    const $el = shallowEl({id})
    expect($el.text()).to.equal(id)
  })

  it('calls the `fetchingMessage` prop when `isFetching` is true', function () {
    const fetchingMessage = () => 'hey I\'m fetchin\' here!'
    const isFetching = true

    const $el = shallowEl({fetchingMessage, isFetching})
    expect($el.text()).to.equal(fetchingMessage())
  })

  it('renders the `title` if present + is a string', function () {
    const id = 'lol'
    const title = 'a cool title'
    const $el = shallowEl({title})
    const txt = $el.text()

    expect(txt).to.not.equal(id)
    expect(title).to.equal(title)
  })

  it('renders the `title` if it is an array (using the first element)', function () {
    const title = ['first title', 'second title']
    const $el = shallowEl({title})
    const txt = $el.text()

    expect(txt).to.equal(title[0])
    expect(txt).to.not.equal(title[1])
  })

  describe('the "Return to Search Results button"', function () {
    it('is not rendered when `onReturnToSearchResults` is empty', function () {
      const $el = shallowEl()
      expect($el.find('TextButton')).to.have.lengthOf(0)
    })

    it('is rendered if `onReturnToSearchResults` is a function', function () {
      const onReturnToSearchResults = () => {}
      const $el = shallowEl({onReturnToSearchResults})

      expect($el.find('TextButton')).to.have.lengthOf(1)
    })

    it('calls `onReturnToSearchResults` when clicked', function (done) {
      const onReturnToSearchResults = () => { done() }
      const $el = shallowEl({onReturnToSearchResults})
      const $button = $el.find('TextButton')

      $button.simulate('click')
    })
  })
})
