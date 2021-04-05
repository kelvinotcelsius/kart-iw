import React, { Fragment } from 'react';
// import { Link } from 'react-router-dom';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Index,
  SearchBox,
  Hits,
  Configure,
} from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  'G4BVIGANC0',
  '39f9585173a92d78545412bb14907042'
);

const MAX_LENGTH = 420;

const ProductHit = ({ hit }) => {
  console.log(hit);
  let desc = '';
  try {
    if (hit.description.length < MAX_LENGTH) desc = hit.description;
    else desc = hit.description.substring(0, MAX_LENGTH).concat('...');
  } catch (error) {
    desc = hit.description;
  }
  return (
    <Fragment>
      <div className='search-result-wrapper'>
        <a href={hit.url}>
          <div className='picture-wrapper'>
            <img
              src={hit.picture}
              className='result-picture'
              alt='search result picture'
            ></img>
          </div>
          <div className='results-text-wrapper'>
            <p className='result-name'>{hit.name}</p>
            <p className='result-description'>{desc}</p>
          </div>
        </a>
      </div>
    </Fragment>
  );
};

const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName='users'>
      <SearchBox autoFocus={true} />
      <Index indexName='products'>
        <h2>Products:</h2>
        <Hits hitComponent={ProductHit} />
        <Configure hitsPerPage={3} />
      </Index>
      {/* <Index indexName='users'>
        <Hits hitComponent={Hit} />
        <Configure hitsPerPage={3} />
      </Index>
      <Index indexName='posts'>
        <Hits hitComponent={Hit} />
        <Configure hitsPerPage={3} />
      </Index> */}
    </InstantSearch>
  );
};

export default Search;
