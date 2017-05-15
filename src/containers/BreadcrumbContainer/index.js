import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumb from '../../components/Breadcrumb'

const propTypes = {
  // key/val store of facet names => facet values
  //  (either Label string or label/name objects)
  dictionary: PropTypes.object,

  // the search-state object of selected facets
  facets: PropTypes.object,

  // the string query
  query: PropTypes.string,

  // the search-state object of selected ranges
  range: PropTypes.object,
}

const defaultProps = {
  dictionary: {},
  facets: {},
  query: '',
  range: {},
}

class BreadcrumbContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.renderBreadcrumbs = this.renderBreadcrumbs.bind(this)
  }

  renderBreadcrumbs (keys, pool) {
    const { dictionary, onRemoveBreadcrumb } = this.props

    return keys.reduce((out, key) => {
      const label = dictionary[key] && dictionary[key].label
        ? dictionary[key].label
        : dictionary[key]
          ? dictionary[key]
          : key

      const facet = {label, name: key}

      let next

      if (!Array.isArray(pool[key])) {
        next = (
          <Breadcrumb
            facet={facet}
            item={pool[key]}
            key={`bc-${key}-0`}
            onRemove={onRemoveBreadcrumb}
          />
        )
      }

      else {
        next = pool[key].map((item, idx) => (
          <Breadcrumb
            facet={facet}
            item={item}
            key={`bc-${key}-${idx}`}
            onRemove={onRemoveBreadcrumb}
          />
        ))
      }

      return out.concat(next)
    }, [])
  }

  render () {
    const {
      dictionary,
      facets,
      onRemoveBreadcrumb,
      query,
      range,
    } = this.props

    let fkeys
    let rkeys

    return (
      <div className="BreadcrumbContainer">
        {
          query !== ''
          ? <Breadcrumb key="bc-query" item={{value: query}} />
          : null
        }

        {
          (fkeys = Object.keys(facets)).length > 0
          ? this.renderBreadcrumbs(fkeys, facets)
          : null
        }

        {
          (rkeys = Object.keys(range)).length > 0
          ? this.renderBreadcrumbs(rkeys, range)
          : null
        }
      </div>
    )
  }
}

BreadcrumbContainer.propTypes = propTypes
BreadcrumbContainer.defaultProps = defaultProps

export default BreadcrumbContainer