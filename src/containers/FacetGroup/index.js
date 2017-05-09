import React from 'react'
import PropTypes from 'prop-types'
import { FacetList } from '@lafayette-college-libraries/react-blacklight-facet'

const propTypes = {
  blacklist: PropTypes.arrayOf(PropTypes.string),
  components: PropTypes.object,
  defaultComponent: PropTypes.func,
  facets: PropTypes.array,
  onRemoveSelectedItem: PropTypes.func,
  onSelectItem: PropTypes.func,
  selected: PropTypes.object,
  showEmpty: PropTypes.bool,
  whitelist: PropTypes.arrayOf(PropTypes.string),
}

const defaultProps = {
  blacklist: [],
  components: {},
  defaultComponent: FacetList,
  selected: {},
  showEmpty: false,
  whitelist: [],
}

class FacetGroup extends React.PureComponent {
  constructor (props) {
    super(props)

    this.renderFacet = this.renderFacet.bind(this)
  }

  renderFacet (facet, index) {
    if (facet.items === undefined) {
      return null
    }

    if (facet.items.length === 0 && this.props.showEmpty === false) {
      return null
    }

    const {
      blacklist,
      components,
      defaultComponent,
      onRemoveSelectedItem,
      onSelectItem,
      whitelist,
    } = this.props

    if (blacklist.length > 0) {
      if (blacklist.indexOf(facet.name) > -1) {
        return null
      }
    }

    if (whitelist.length > 0) {
      if (whitelist.indexOf(facet.name) === -1) {
        return null
      }
    }

    const selected = this.props.selected[facet.name] || []
    const hasSelectedItems = selected.length > 0
    let { items } = facet

    if (hasSelectedItems === true) {
      const selectedVals = selected.map(s => s.value)
      items = items.filter(i => selectedVals.indexOf(i.value) === -1)
    }

    const props = {
      items,
      key: `${index}-${facet.name}`,
      onRemoveSelectedItem,
      onSelectItem,
      open: hasSelectedItems,
      selectedItems: [].concat(selected),
    }

    const Component = components[facet.name] || defaultComponent

    return (
      <Component
        {...facet}
        {...props}
      />
    )
  }

  render () {
    if (this.props.facets.length === 0) {
      return null
    }

    return (
      <div className="FacetGroup">
        {this.props.facets.map(this.renderFacet)}
      </div>
    )
  }
}

FacetGroup.propTypes = propTypes
FacetGroup.defaultProps = defaultProps

export default FacetGroup
