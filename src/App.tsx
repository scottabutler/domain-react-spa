import React from 'react';
import './App.scss';
import Search from './components/search';
import Footer from './components/footer';
import axios from 'axios';
import SearchResult from './components/searchResult';
import findClosestStops from './utils/distance'
import { isArchivedInStorage, loadSearchParamsFromLocalStorage, saveSearchParamsToLocalStorage } from './utils/localStorageHelper';
import DomainListingWrapper from './types/domain';

//https://css-tricks.com/snippets/javascript/get-url-variables/
const getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
    }
    return false;
};

interface DomainListingWrapperWithClosestStops extends DomainListingWrapper {
    closestStops: Array<ClosestStop>;
}

interface ClosestStop {
    stop_name: string;
    distance: number;
}

function App() {
  const suburbsFromQueryString = getQueryVariable('suburbs');
  const savedSearchParams = loadSearchParamsFromLocalStorage() ?? {};

  const defaultSuburbs = savedSearchParams.suburbCsv ?? (suburbsFromQueryString ? decodeURI((suburbsFromQueryString)) : '');
  const [suburbs, setSuburbs] = React.useState(defaultSuburbs);
  const [minBeds, setMinBeds] = React.useState(savedSearchParams.minBeds ?? 2);
  const [minBaths, setMinBaths] = React.useState(savedSearchParams.minBaths ?? 1);
  const [minCarSpaces, setMinCarSpaces] = React.useState(savedSearchParams.minCarSpaces ?? 1);
  const [maxPrice, setMaxPrice] = React.useState(savedSearchParams.maxPrice ?? 650000);
  const [maxDistanceFromTrain, setMaxDistanceFromTrain] = React.useState(savedSearchParams.maxDistFromTrain ?? 1.25);

  const [results, setResults] = React.useState(new Array<DomainListingWrapperWithClosestStops>());
  const [searchResultList, setSearchResultList] = React.useState(new Array<JSX.Element>());
  const [isLoading, setIsLoading] = React.useState(false);
  const [showArchived, setShowArchived] = React.useState(false);
  const [requestedSuburbs, setRequestedSuburbs] = React.useState('');
  const [suburbCountsString, setSuburbCountsString] = React.useState('');
  const [resultsCount, setResultsCount] = React.useState(0);

  const setStateFromChangeEvent = function(evt, setFunc) {
      setFunc(evt.currentTarget.value);
  }

  const setResultsWithClosestStops = function(r: DomainListingWrapper[]) {
    const resultsWithClosestStops: DomainListingWrapperWithClosestStops[] = r
        .filter(x => {
            return x?.listing?.propertyDetails
                && x.listing.propertyDetails.latitude
                && x.listing.propertyDetails.longitude;
        })
        .map(x => {
            const closestStops: ClosestStop[] = findClosestStops(x.listing.propertyDetails.latitude, x.listing.propertyDetails.longitude);
            return { ...x, closestStops: closestStops };
        })
        .filter(x => {
            return x.closestStops.length > 0
                && Math.round(x.closestStops[0].distance * 10) / 10 <= maxDistanceFromTrain;
        });
    setResults(resultsWithClosestStops);
  }

  const runSearch = async function() {
    const reqSuburbs = suburbs
        .split(',')
        .map(x => x.trim())
        .sort()
        .join(', ');
    setRequestedSuburbs(reqSuburbs);
    saveSearchParamsToLocalStorage(minBeds, minBaths, minCarSpaces, maxPrice, maxDistanceFromTrain, reqSuburbs);
    const key = getQueryVariable('api_key');
    const url = 'https://api.domain.com.au/v1/listings/residential/_search?api_key=' + key;
    const suburbArray = suburbs.split(',').map((s) => {
        return {
              "state":"VIC",
              "suburb":s.trim()
            };
    });
    const data = {
      "listingType":"Sale",
      "propertyTypes":[
        "House",
        "NewApartments",
        "ApartmentUnitFlat",
        "Townhouse"
      ],
      "listingAttributes": [
        "NotUnderContract"
      ],
      "minBedrooms":minBeds,
      "minBathrooms":minBaths,
      "minCarspaces":minCarSpaces,
      "maxPrice":maxPrice,
      "locations":suburbArray,
      "sort": {
        "sortKey": "DateListed",
        "direction": "Descending"
      },
      "pageSize": 200
    };

    if (key) {
        setIsLoading(true);
        await axios.post(url, data)
            .then(x => {
                setIsLoading(false);
                setResultsWithClosestStops(x.data);
            })
            .catch(err => {
                setIsLoading(false);
                console.error(err);
            });
    } else {
        setResultsWithClosestStops([...getMockResults()]);
    }
  }

  const spinner = isLoading
    ? (
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
    : <></>

  React.useEffect(() => {
    const list = results && results.length > 0
        ? results.map(x =>
            <SearchResult
                key={x.listing.listingSlug}
                closestStops={x.closestStops}
                data={x}
                showArchived={showArchived}
            />)
        : [];
    setSearchResultList(list);

    const suburbCounts = {};
    let hiddenResultCount = 0;
    results.map(x => {
        if (x?.listing?.propertyDetails) {
            const upperCaseSuburb = x.listing.propertyDetails.suburb.toUpperCase();
            if (suburbCounts[upperCaseSuburb]) {
                suburbCounts[upperCaseSuburb]++;
            } else {
                suburbCounts[upperCaseSuburb] = 1;
            }
        }
        if (isArchivedInStorage(x.listing.listingSlug)) {
            hiddenResultCount += 1; // TODO convert this to a map for immutability?
        }
    });
    setResultsCount(showArchived ? list.length : list.length - hiddenResultCount);
    const orderedSuburbCounts = orderObjectPropertiesByCount(suburbCounts);
    let counts: string[] = [];
    for (const s in orderedSuburbCounts) {
        counts.push(`${toTitleCase(s)} (${orderedSuburbCounts[s]})`);
    }

    // Add in any that suburbs from the search that didn't have any search results
    const requestedSuburbsArray = requestedSuburbs.split(', ').filter(r => !!r);
    const keys = Object.keys(orderedSuburbCounts);
    for (const r of requestedSuburbsArray) {
        if (!keys.find(x => x === r.toUpperCase())) {
            counts.push(`${toTitleCase(r)} (0)`);
        }
    }
    setSuburbCountsString(counts.join(', '));
  }, [results, showArchived]);

  function toTitleCase(input) {
    return input.split(' ')
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(' ');
  }

  function orderObjectPropertiesByCount(obj) {
    const keys = Object.keys(obj);
    const sorted = keys.sort(function(a,b){return obj[b]-obj[a]});
    const result = {};
    for (const k in sorted) {
        const sortedKey = sorted[k];
        result[sortedKey] = obj[sortedKey];
    };
    return result;
  }

  return (
    <div className="App py-2 container-fluid">
      <h3 className="py-2 bg-light">Domain Property Search</h3>
      <div className="row no-gutters mt-3">
        <div className="col-12 mb-2 pb-2 pb-sm-0">
            <div className="border border-secondary rounded bg-white p-2">
                <Search
                    suburbs={suburbs} updateSuburbs={(evt) => setStateFromChangeEvent(evt, setSuburbs)}
                    minBeds={minBeds} updateMinBeds={(val) => setMinBeds(val)}
                    minBaths={minBaths} updateMinBaths={(val) => setMinBaths(val)}
                    minCarSpaces={minCarSpaces} updateMinCarSpaces={(val) => setMinCarSpaces(val)}
                    maxPrice={maxPrice} updateMaxPrice={(val) => setMaxPrice(val)}
                    maxDistanceFromTrain={maxDistanceFromTrain} updateMaxDistanceFromTrain={(val) => setMaxDistanceFromTrain(val)}
                    runSearch={runSearch}
                />
            </div>
        </div>
        <div className="col-12">
          <div className="border border-secondary rounded bg-white p-2 px-3" id="output">
            {isLoading
            ? spinner
            : <>
                {results && results.length > 0 && requestedSuburbs
                ?
                    <div className="row">
                        <div className="col">
                            <span>Showing {resultsCount} properties in {suburbCountsString}</span>
                        </div>
                        <div className="col-12">
                            <input id="showArchivedCheckbox" type="checkbox" defaultChecked={showArchived} onChange={() => { setShowArchived(!showArchived) }} />
                            <label htmlFor="showArchivedCheckbox">Show hidden properties</label>
                        </div>
                    </div>
                : <></>
                }
                <div className="row">{
                    searchResultList.length > 0
                        ? searchResultList
                        : <><span className="d-block pl-3">No properties found.</span></>
                }</div>
            </>
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

function getMockResults(): DomainListingWrapper[] {
  return [
    {
        "type": "PropertyListing",
        "listing": {
            "listingType": "Sale",
            "id": 2016241957,
            "advertiser": {
                "type": "Agency",
                "id": 24636,
                "name": "Biggin & Scott Glen Waverley",
                "logoUrl": "https://images.domain.com.au/img/Agencys/24636/logo_24636.GIF",
                "preferredColourHex": "#012b5d",
                "bannerUrl": "https://images.domain.com.au/img/Agencys/24636/banner_24636.GIF",
                "contacts": [
                    {
                        "name": "Lindy Xue",
                        "photoUrl": "https://images.domain.com.au/img/24636/contact_1406069.jpeg?mod=200519-145012"
                    },
                    {
                        "name": "Ming  Xu",
                        "photoUrl": "https://images.domain.com.au/img/24636/contact_1356004.jpeg?mod=200520-164022"
                    }
                ]
            },
            "priceDetails": {
                "displayPrice": "Book for a private Inspection!"
            },
            "media": [
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016241957_1_1_200504_122018-w800-h540"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016092109_12_1_200512_114500-w3071-h2480"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016241957_2_1_200504_122018-w1571-h1062"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016241957_3_1_200504_122018-w1579-h1062"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016241957_4_1_200504_122018-w1580-h1062"
                }
            ],
            "propertyDetails": {
                "state": "VIC",
                "features": [],
                "propertyType": "ApartmentUnitFlat",
                "allPropertyTypes": [
                    "ApartmentUnitFlat"
                ],
                "bathrooms": 2.0,
                "bedrooms": 2.0,
                "carspaces": 1,
                "unitNumber": "110",
                "streetNumber": "2",
                "street": "Elland Avenue",
                "area": "Whitehorse",
                "region": "Eastern Suburbs",
                "suburb": "BOX HILL",
                "postcode": "3128",
                "displayableAddress": "110/2 Elland Avenue, Box Hill",
                "latitude": -37.8166847,
                "longitude": 145.123489
            },
            "headline": "AN OPPORTUNITY NOT TO BE MISSED!",
            "summaryDescription": "<b></b><br />If you're looking for an amazing location, spectacular rental yield and quality living, then this apartment ticks all those boxes. We call out for all investors, first home buyers and downsizers to not miss the opportunity to secure this a...",
            "hasFloorplan": true,
            "hasVideo": false,
            "labels": [
                "Auction Sat 30 May"
            ],
            "auctionSchedule": {
                "time": "2020-05-30T12:00:00",
                "auctionLocation": "On Site"
            },
            "inspectionSchedule": {
                "byAppointment": false,
                "recurring": false,
                "times": [
                    {
                        "openingTime": "2020-05-23T13:00:00",
                        "closingTime": "2020-05-23T13:30:00"
                    }
                ]
            },
            "listingSlug": "110-2-elland-avenue-box-hill-vic-3128-2016241957"
        }
    },
    {
        "type": "PropertyListing",
        "listing": {
            "listingType": "Sale",
            "id": 2016236415,
            "advertiser": {
                "type": "Agency",
                "id": 20157,
                "name": "Jellis Craig Whitehorse",
                "logoUrl": "https://images.domain.com.au/img/Agencys/20157/logo_20157.GIF",
                "preferredColourHex": "#1c252e",
                "bannerUrl": "https://images.domain.com.au/img/Agencys/20157/banner_20157.GIF",
                "contacts": [
                    {
                        "name": "Adrian Nyariri",
                        "photoUrl": "https://images.domain.com.au/img/20157/contact_1404484.jpeg?mod=200522-092310"
                    }
                ]
            },
            "priceDetails": {
                "displayPrice": "$460,000 - $500,000"
            },
            "media": [
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016236415_1_1_200429_112607-w1600-h1065"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016236415_2_1_200429_112607-w1600-h1065"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016236415_3_1_200429_112607-w1600-h1065"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016236415_4_1_200429_112607-w1600-h1065"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016236415_5_1_200429_112607-w1600-h1065"
                }
            ],
            "propertyDetails": {
                "state": "VIC",
                "features": [
                    "AirConditioning",
                    "Ensuite",
                    "NorthFacing",
                    "Intercom",
                    "Heating",
                    "Dishwasher"
                ],
                "propertyType": "ApartmentUnitFlat",
                "allPropertyTypes": [
                    "ApartmentUnitFlat"
                ],
                "bathrooms": 2.0,
                "bedrooms": 2.0,
                "carspaces": 1,
                "unitNumber": "",
                "streetNumber": "105/569",
                "street": "Whitehorse Road",
                "area": "Whitehorse",
                "region": "Eastern Suburbs",
                "suburb": "MITCHAM",
                "postcode": "3132",
                "displayableAddress": "105/569 Whitehorse Road, Mitcham",
                "latitude": -37.81538,
                "longitude": 145.198029
            },
            "headline": "Savour the convenience",
            "summaryDescription": "<b></b><br />Beautifully presented and bathed in light, this modern apartment has been designed to complement a busy modern lifestyle, ideal for buyers seeking secure, low-maintenance living. Comprising of two generous bedrooms with ensuite and walk-in...",
            "hasFloorplan": true,
            "hasVideo": false,
            "labels": [],
            "inspectionSchedule": {
                "byAppointment": false,
                "recurring": false,
                "times": [
                    {
                        "openingTime": "2020-05-23T12:00:00",
                        "closingTime": "2020-05-23T12:30:00"
                    }
                ]
            },
            "listingSlug": "105-569-whitehorse-road-mitcham-vic-3132-2016236415"
        }
    },
    {
        "type": "PropertyListing",
        "listing": {
            "listingType": "Sale",
            "id": 2016223107,
            "advertiser": {
                "type": "Agency",
                "id": 33445,
                "name": "Market Expert Australia",
                "preferredColourHex": "#DDDDDD",
                "contacts": [
                    {
                        "name": "Market Expert Australia"
                    }
                ]
            },
            "priceDetails": {
                "displayPrice": "Contact Agent"
            },
            "media": [
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016223107_3_1_200421_105516-w1600-h1067"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016223107_1_1_200421_105516-w1600-h1067"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016223107_2_1_200421_105516-w1600-h1067"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016223107_4_1_200421_105516-w1600-h1067"
                },
                {
                    "category": "Image",
                    "url": "https://bucket-api.domain.com.au/v1/bucket/image/2016223107_5_1_200421_105516-w1600-h1067"
                }
            ],
            "propertyDetails": {
                "state": "VIC",
                "features": [
                    "AirConditioning",
                    "BuiltInWardrobes",
                    "Ensuite",
                    "Intercom",
                    "Heating",
                    "Dishwasher"
                ],
                "propertyType": "ApartmentUnitFlat",
                "allPropertyTypes": [
                    "ApartmentUnitFlat"
                ],
                "bathrooms": 2.0,
                "bedrooms": 2.0,
                "carspaces": 1,
                "unitNumber": "1",
                "streetNumber": "569",
                "street": "Whitehorse Road",
                "area": "Whitehorse",
                "region": "Eastern Suburbs",
                "suburb": "MITCHAM",
                "postcode": "3132",
                "displayableAddress": "1/569 Whitehorse Road, Mitcham",
                "latitude": -37.81538,
                "longitude": 145.198029
            },
            "headline": "Near New, Ultra-Modern, Walk To All...",
            "summaryDescription": "<b></b><br />INSPECTIONS BY PRIVATE APPOINTMENT ONLY -\r\nPlease contact our listing agent to make an appointment.\r\n\r\nSecurely located on the bottom floor of Britannia Rise, this executive two bedroom apartment offers a premium lock and leave lifestyle m...",
            "hasFloorplan": false,
            "hasVideo": false,
            "labels": [],
            "inspectionSchedule": {
                "byAppointment": false,
                "recurring": false,
                "times": []
            },
            "listingSlug": "1-569-whitehorse-road-mitcham-vic-3132-2016223107"
        }
    }
];
}