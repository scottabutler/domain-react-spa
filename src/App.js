import React from 'react';
import './App.css';
import Search from './components/search';
import Footer from './components/footer';
import axios from 'axios';
import SearchResult from './components/searchResult';
import findClosestStops from './utils/distance'

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

function App() {
  const suburbsFromQueryString = getQueryVariable('suburbs');

  const [suburbs, setSuburbs] = React.useState(suburbsFromQueryString ? decodeURI((suburbsFromQueryString)) : '');
  const [minBeds, setMinBeds] = React.useState(2);
  const [minBaths, setMinBaths] = React.useState(1);
  const [minCarSpaces, setMinCarSpaces] = React.useState(1);
  const [maxPrice, setMaxPrice] = React.useState(650000);
  const [maxDistanceFromTrain, setMaxDistanceFromTrain] = React.useState(1.25);

  const [results, setResults] = React.useState([]);
  const [searchResultList, setSearchResultList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchResultSuburbs, setSearchResultSuburbs] = React.useState('');

  const setStateFromChangeEvent = function(evt, setFunc) {
      setFunc(evt.currentTarget.value);
  }

  const setResultsWithClosestStops = function(r) {
    const resultsWithClosestStops = r
        .map(x => {
            x.closestStops = findClosestStops(x.listing.propertyDetails.latitude, x.listing.propertyDetails.longitude);
            return x;
        })
        .filter(x => {
            return x.closestStops.length > 0
                && Math.round(x.closestStops[0].distance * 10) / 10 <= maxDistanceFromTrain;
        });
    setResults(resultsWithClosestStops);
  }

  const runSearch = async function() {
    setSearchResultSuburbs(
        suburbs
            .split(',')
            .map(x => x.trim())
            .sort()
            .join(', ')
    );
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
      "pageSize": 100
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
        setResultsWithClosestStops([...getMockResults(), ...getMockResults()]);
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
        ? results.map(x => <SearchResult key={x.listing.listingSlug} closestStops={x.closestStops} data={x} />)
        : <><span className="d-block pl-3">No properties found.</span></>;
    setSearchResultList(list);
  }, [results]);

  return (
    <div className="App pb-2 pt-0 container-fluid">
      <div className="bg-light sticky-top py-1">
          <h2>Domain Property Search</h2>
      </div>

      <div className="row no-gutters mt-2">
        <div className="col-lg-3 pb-2 pb-2">
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
        <div className="col-lg-9">
          <div className="border border-secondary rounded bg-white p-2 px-3 ml-lg-3" id="output">
            {isLoading
            ? spinner
            : <>
                {searchResultSuburbs
                ?
                    <div className="row">
                        <div className="col">
                            <span>Showing {searchResultList.length} properties in {searchResultSuburbs}</span>
                        </div>
                    </div>
                : <></>
                }
                <div className="row">{searchResultList}</div>
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

function getMockResults() {
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