import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import '../styles/RouteList.scss';

import gogocarData from '../services/gogocarData';
import getRouteModeIcon from '../utils/getRouteModeIcon';

function RouteList(props) {
  const [filterName, setFilterName] = useState('');

  const [transportModes, setTransportModes] = useState([
    {
      icon: 'fas fa-bus fa-2x',
      name: 'BUS',
      selected: false
    },
    {
      icon: 'fas fa-ship fa-2x',
      name: 'FERRY',
      selected: false
    },
    {
      icon: 'fas fa-subway fa-2x',
      name: 'SUBWAY',
      selected: false
    },
    {
      icon: 'fas fa-train fa-2x',
      name: 'RAIL',
      selected: false
    },
    {
      icon: 'fas fa-tram fa-2x',
      name: 'TRAM',
      selected: false
    }
  ]);

  const [noRoute, setNoRoute] = useState(true);

  const [query, setQuery] = useState(gql`
    {
      routes(transportModes: []) {
        gtfsId
      }
    }
  `);

  const [getRoutes, { loading, error, data }] = useLazyQuery(query);

  const [showGogocarData, setShowGogocarData] = useState(false);

  useEffect(() => {
    getRoutes();
  }, [query, getRoutes]);

  // TODO: Find a way to query using enum
  const onButtonSearchClick = () => {
    setShowGogocarData(false);
    setNoRoute(true);
    var modes = '';
    transportModes.forEach(mode => {
      if (mode.selected) modes += `${mode.name}, `;
    });

    if (modes.length > 0) {
      setNoRoute(false);
      setQuery(gql`
      {
        routes(name: "${filterName}", transportModes: [${modes}]) {
          gtfsId
          shortName
          longName
          mode
          stops {
            id
            lat
            lon
          }
        }
      }
    `);
    } else if (filterName.length > 0) {
      setNoRoute(false);
      setQuery(gql`
      {
        routes(name: "${filterName}") {
          gtfsId
          shortName
          longName
          mode
          stops {
            id
            lat
            lon
          }
        }
      }
    `);
    } else {
      setNoRoute(true);
    }
  };

  const chooseTranportMode = name => {
    setTransportModes(
      transportModes.map(mode => {
        if (mode.name === name) mode.selected = !mode.selected;
        return mode;
      })
    );
  };

  const { selectedRoutes, pickRoute } = props;

  const routeList = list => {
    return list.map(route => {
      return (
        <div
          key={route.gtfsId}
          className={classnames('route', `route--${route.mode}`, {
            'route--selected': selectedRoutes.includes(route)
          })}
          onClick={() => pickRoute(route)}
        >
          <i className={getRouteModeIcon(route)}></i> {route.shortName}
          <p>{route.longName}</p>
        </div>
      );
    });
  };

  return (
    <div className='RouteList'>
      <div className='filter'>
        <div className='transport-modes'>
          {transportModes.map(mode => (
            <div
              key={mode.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <i
                key={mode.name}
                className={classnames(mode.icon, {
                  [`${mode.name}-selected`]: mode.selected
                })}
                onClick={() => chooseTranportMode(mode.name)}
              ></i>
              <span>{mode.name}</span>
            </div>
          ))}
        </div>
        <div className='name'>
          <input
            placeholder='Name'
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          ></input>
          <button id='button-search' onClick={onButtonSearchClick}>
            Search from HSL
          </button>
        </div>
        <button
          className={showGogocarData ? 'gogocar-selected' : null}
          style={{ marginTop: '15px' }}
          onClick={() => {
            setNoRoute(false);
            setShowGogocarData(true);
          }}
        >
          Get Data from Gogocar
        </button>
      </div>

      {error}

      {loading && <div className='loader'></div>}

      {showGogocarData && routeList(gogocarData.data.routes)}

      {data &&
        data.routes.length > 0 &&
        !noRoute &&
        !showGogocarData &&
        routeList(data.routes)}

      {noRoute && (
        <div style={{ textAlign: 'center', paddingTop: '20%' }}>
          No Route Found
        </div>
      )}
    </div>
  );
}

export default RouteList;
