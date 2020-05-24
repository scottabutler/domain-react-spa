import React from 'react';

function SearchResult(props: any) {
    const { 
        data
    } = props;

    const href = `https://domain.com.au/${data.listing.listingSlug}`;
    const streetAddress = data.listing.propertyDetails.unitNumber
        ? `${data.listing.propertyDetails.unitNumber}/${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`
        : `${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`;

    return (
        <>
            <div className="row py-2">
                <div className="col-4 col-lg-2">
                    <img src={data.listing.media[0].url} width="100%" /><br />
                </div>
                <div className="col-8 col-lg-10 pl-0">
                    <span className="d-block font-weight-bold">{data.listing.priceDetails.displayPrice}</span>
                    <span className="d-block">{streetAddress}</span>
                    <span className="d-block">{data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}</span>
                    <a className="d-block" href={href} target="_blank">View</a>
                </div>
            </div>
        </>
    );
}

export default SearchResult;