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
  let desc = '';
  try {
    if (hit.description.length < MAX_LENGTH) desc = hit.description;
    else desc = hit.description.substring(0, MAX_LENGTH).concat('...');
  } catch (error) {
    desc = hit.description;
  }
  return (
    <Fragment>
      <a href={hit.url}>
        <div className='picture-wrapper'>
          <img
            src={hit.picture}
            className='result-picture'
            alt='search result'
          ></img>
        </div>
        <div className='results-text-wrapper'>
          <p className='result-name'>{hit.name}</p>
          <p className='result-description'>{desc}</p>
        </div>
      </a>
    </Fragment>
  );
};

const UserHit = ({ hit }) => {
  return (
    <a href={hit.url}>
      <div className='picture-wrapper'>
        <img
          src={hit.profile_pic}
          className='result-picture rounded'
          alt='search result'
        ></img>
      </div>
      <div className='results-text-wrapper'>
        <p className='result-name'>@{hit.username}</p>
        <p className='result-description'>
          {hit.first} {hit.last}
        </p>
      </div>
    </a>
  );
};

const PostHit = ({ hit }) => {
  return (
    <a href={hit.url}>
      <div className='picture-wrapper'>
        <img
          src={hit.preview}
          className='result-picture'
          alt='search result'
        ></img>
      </div>
      <div className='results-text-wrapper'>
        {/* <p className='result-name'>@{hit.creator}</p> */}
        <p className='result-description'>{hit.caption}</p>
      </div>
    </a>
  );
};

const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName='users'>
      <SearchBox autoFocus={true} />
      <Index indexName='products'>
        <h3 className='hits-section-title'>Products</h3>
        <Hits hitComponent={ProductHit} />
        <Configure hitsPerPage={3} />
      </Index>
      <Index indexName='users'>
        <h3 className='hits-section-title'>Users</h3>
        <Hits hitComponent={UserHit} />
        <Configure hitsPerPage={3} />
      </Index>
      <Index indexName='posts'>
        <h3 className='hits-section-title'>Posts</h3>
        <Hits hitComponent={PostHit} />
        <Configure hitsPerPage={3} />
      </Index>
    </InstantSearch>
  );
};

export default Search;
