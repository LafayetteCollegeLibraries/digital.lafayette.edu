import { createAction } from 'redux-actions'
import isEqual from 'lodash.isequal'
import Debug from 'debug'

import { search as _search } from './endpoints'
import { parseQs } from '../api'

const debug = Debug('digital:store:search/actions')

const hasProperty = (obj, prop) => (
  Object.prototype.hasOwnProperty.call(obj, prop)
)

export const clearSearch = createAction('clear search')
export const receivedSearchError = createAction('[error] search')
export const receivedSearchResults = createAction('received search results')
export const setSearch = createAction('set search')

export const searchCatalog = (dispatch, props) => {
  dispatch(setSearch(props))

  return _search(props)
    .then(results => dispatch(receivedSearchResults(results)))
    .catch(error => dispatch(receivedSearchError(error)))
}

export const searchAtPage = page => (dispatch, getState) => {
  const { meta, ...state } = getState().search
  const updated = {
    ...state,
    meta: {
      ...meta,
      page,
    }
  }

  debug('fetching page %d', page)
  return searchCatalog(dispatch, updated)
}

// this makes the assumption that a query search does not
// inherit facets / page positions
export const searchWithQuery = query => dispatch => {
  debug('searching with query: %s', query)

  return searchCatalog(dispatch, {query})
}

export const searchWithQueryString = qs => dispatch => {
  const parsed = parseQs(qs)

  debug('searching with queryString: %o', parsed)

  const { q, f, range, ...meta } = parseQs(qs)
  const searchObj = {
    facets: f,
    meta,
    query: q,
    range,
  }

  return searchCatalog(dispatch, searchObj)
}

export const toggleFacetItem = (facet, item, toggle) => (dispatch, getState) => {
  debug('toggling `%s:%s` %s', facet.name, item.label, toggle ? 'on' : 'off')

  const { name } = facet
  const isRange = item.type && item.type === 'range'

  const searchObj = {
    // defaults
    query: '',
    facets: {},
    range: {},
    meta: {},

    // current
    ...getState().search,
  }

  if (isRange) {
    if (toggle === true) {
      searchObj.range[name] = [item]
    }

    else {
      delete searchObj.range[name]
    }
  }

  else {
    let dirty = false
    let target

    // selecting facet
    if (toggle === true) {
      const { facets } = searchObj
      let shouldUpdate = true

      // is the facet already being used?
      // check for duplicate values + don't update if it's already there
      if (hasProperty(facets, name)) {
        for (let i = 0; i < facets[name].length; i++) {
          const current = facets[name][i]

          // this is probably a bit overkill but acts as a failsafe if, for
          // some reason, the facet-items in state differ from the ones
          // returned from the api
          if (hasProperty(current, 'value') && hasProperty(item, 'value')) {
            if (isEqual(current.value, item.value)) {
              shouldUpdate = false
              break
            }
          } else {
            if (isEqual(current, item)) {
              shouldUpdate = false
              break
            }
          }
        }
      }

      if (shouldUpdate === true) {
        target = [].concat(facets[name], item).filter(Boolean)
        dirty = true
      }
    }

    // removing facet
    // (we'll skip a catch-all `else` case and let
    // `dirty === false` result in a no-op)
    else if (searchObj.facets[name] && toggle === false) {
      target = searchObj.facets[name].filter(i => {

        // see above for comment
        if (hasProperty(i, 'value') && hasProperty(item, 'value')) {
          return !isEqual(i.value, item.value)
        }

        else {
          return !isEqual(i, item)
        }
      })

      if (searchObj.facets[name].length > target.length) {
        dirty = true
      }
    }

    if (dirty === false) {
      return Promise.resolve()
    }

    searchObj.facets = {
      ...searchObj.facets,
      [name]: target,
    }

    if (target.length === 0) {
      delete searchObj.facets[name]
    }
  } // end `if (item.type === 'range') / else` block

  // reset the page count
  searchObj.meta = {
    ...searchObj.meta,
    page: 1,
  }

  return searchCatalog(dispatch, searchObj)
}
