import React, { useState } from 'react';
import AgencyDetails from '../agencyDetails';
import NewTabLink from '../newTabLink';
import SimpleCarousel from '../simpleCarousel';
import './searchResult.scss';
import { isArchivedInStorage, saveInLocalStorage } from '../../utils/localStorageHelper';
import { getRelativeShortDate, getTwelveHourTime } from '../../utils/dateTimeHelper';
import InspectionTimes from '../inspectionTimes';
import DomainListingWrapper from '../../types/domain';
import AddedTag from '../addedTag';
import ListingProgressBar from '../listingProgressBar';

function SearchResult(props: {closestStops: any, data: DomainListingWrapper, showArchived: boolean}) {
    const {
        closestStops, data, showArchived
    } = props;

    const [isArchived, setIsArchived] = useState(isArchivedInStorage(data.listing.listingSlug));
    const href = `https://domain.com.au/${data.listing.listingSlug}`;
    const streetAddress = data.listing.propertyDetails.unitNumber
        ? `${data.listing.propertyDetails.unitNumber}/${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`
        : `${data.listing.propertyDetails.streetNumber} ${data.listing.propertyDetails.street}`;
    const imageAltText = `Image for ${streetAddress}`;

    const agent = data.listing.advertiser;

    //Select at most the first two closest stops, then add markup for rendering
    const closestStopsMarkup = closestStops
        .filter((_, i: number) => { return i < 2 })
        .map(y => {
            const key = `${data.listing.listingSlug}_${y.stop_name.replace(' ', '')}`;
            const rotation = `${y.bearing - 45}deg`;
            const distance = Math.round(y.distance * 10) / 10;
            const distanceToDisplay = distance < 1 ? distance * 1000 : distance;
            const units = distance < 1 ? 'm' : 'km';

            return <span className="col-12" key={key}>
                <i className="icon-train" />
                {y.stop_name.replace(' Station', '')}: {distanceToDisplay}{units}
                <a target="_blank" className="ms-1 dark-link" href={`https://www.google.com/maps/dir/${data.listing.propertyDetails.latitude},${data.listing.propertyDetails.longitude}/${y.latitude},${y.longitude}/data=!3m1!4b1!4m2!4m1!3e2`}>
                    <i className="icon-direction" style={{rotate: rotation}} />
                </a>
            </span>
        });
    const imageUrls = (data.listing.media ?? [])
        .filter(x => x.category === "Image")
        .map(y => `${y.url}/500x500`);

    const parsePropertyType = (propertyType: string, unitNumber: string, description: string) => {
        switch (propertyType.toLowerCase()) {
            case "NewApartments".toLowerCase():
                return "New Apartment"
            case "ApartmentUnitFlat".toLowerCase():
                // Check the description first, to see if apartment or unit are mentioned
                if (description.toLowerCase().indexOf("apartment") >= 0) {
                    return "Apartment";
                }
                if (description.toLowerCase().indexOf("unit") >= 0) {
                    return "Unit";
                }

                // If it's only numeric, use the value to guess if it's an apartment
                if (new RegExp(/^\d+$/).test(unitNumber)) {
                    const numericUnitNumber = parseInt(unitNumber);

                    // If it's > 99, it's almost definitely an apartment
                    if (numericUnitNumber > 99) {
                        return "Apartment";
                    }

                    // If it's < 20, it's possibly a unit
                    if (numericUnitNumber < 30) {
                        return "Unit";
                    }
                } else {
                    // If it contains a G, it's likely a ground floor apartment
                    if (unitNumber.toLowerCase().indexOf("g") >= 0) {
                        return "Apartment";
                    }

                    // If it contains an A or B, it's potentially a subdivision so likely a unit
                    if (new RegExp(/[ABab]/).test(unitNumber)) {
                        return "Unit";
                    }
                }

                // If nothing matched, return a combined value
                return "Apartment / Unit";
            case "House".toLowerCase():
            case "Townhouse".toLowerCase():
            default:
                return propertyType;
        }
    }

    const propertyType = parsePropertyType(
        data.listing.propertyDetails.propertyType,
        data.listing.propertyDetails.unitNumber,
        data.listing.summaryDescription
    );

    const isAuctionTimeInFuture = data?.listing?.auctionSchedule
        && data.listing.auctionSchedule.time
        && new Date(data.listing.auctionSchedule.time) > new Date()
        ? true : false;

    const openTimes = (data?.listing?.inspectionSchedule?.times ?? []).filter(x => new Date(x.openingTime) > new Date());

    const openTime = openTimes[0]
        ? getRelativeShortDate(openTimes[0].openingTime, true, false)
        : undefined;
    const openTimeToDisplay = openTime?.toLowerCase() === 'today' ? getTwelveHourTime(openTimes[0].openingTime) : openTime;

    const auctionDate = data?.listing?.auctionSchedule?.time
        ? getRelativeShortDate(data.listing.auctionSchedule.time, false, false)
        : undefined;
    const auctionDateToDisplay = auctionDate?.toLowerCase() === 'today' ? getTwelveHourTime(data.listing.auctionSchedule!.time) : auctionDate;

    return !isArchived || (isArchived && showArchived)
    ? (
        <React.Fragment key={data.listing.listingSlug}>
            <div className="my-2 me-sm-3 search-result-wrapper">
                <div className={`search-result h-100 ${isArchived ? 'archived' : ''}`}>
                    <div className="border border-secondary h-100 shadow d-flex flex-column ">
                        <div className="px-0 text-center overflow-hidden carousel">
                            <SimpleCarousel
                                id={data.listing.listingSlug}
                                urls={imageUrls}
                                altText={imageAltText}
                            />
                            <AddedTag id={`addedTag_${data.listing.listingSlug}`} dateListed={data.listing.dateListed} />
                        </div>
                        <AgencyDetails
                            id={`agency_${data.listing.listingSlug}`}
                            name={agent.name}
                            logoUrl={agent.logoUrl}
                            preferredColourHex={agent.preferredColourHex}
                            contacts={agent.contacts}
                            key={`agent_${data.listing.listingSlug}`} />
                        <div className="px-3 pt-1 pb-2 mb-auto">
                            <span className="d-block fw-bold text-truncate">{data.listing.priceDetails.displayPrice}</span>
                            <span className="d-block">{streetAddress}</span>
                            <span className="d-block">
                                {data.listing.propertyDetails.suburb} {data.listing.propertyDetails.state} {data.listing.propertyDetails.postcode}
                                <a target="_blank" className="ms-1 dark-link" href={`https://www.google.com/maps/search/?api=1&query=${data.listing.propertyDetails.latitude},${data.listing.propertyDetails.longitude}`}>
                                    <i className="icon-map-o" />
                                </a>
                            </span>
                            <span className="d-block mt-1">
                                <ListingProgressBar id={`listingProgressBar_${data.listing.listingSlug}`} dateListed={data.listing.dateListed} auctionScheduleTime={data.listing.auctionSchedule?.time} />
                            </span>
                            <span className="d-block my-1">
                                <span className="badge rounded-pill bg-secondary">
                                    {propertyType}
                                </span>
                                {openTime &&
                                    <span className="badge rounded-pill bg-success ms-2">
                                        Open {openTimeToDisplay}
                                    </span>
                                }
                                {!openTime && isAuctionTimeInFuture && auctionDate &&
                                     <span className="badge rounded-pill bg-danger ms-2">
                                        Auction {auctionDateToDisplay === 'Tomorrow' ? 'tomorrow' : auctionDateToDisplay}
                                    </span>
                                }
                                {(openTime || isAuctionTimeInFuture) &&
                                    <InspectionTimes
                                        id={`inspections_${data.listing.listingSlug}`}
                                        inspectionSchedule={data.listing.inspectionSchedule}
                                        auctionSchedule={data.listing.auctionSchedule}
                                    />
                                }
                            </span>
                            <span className="d-block">
                                <span className="icon-wrapper"><i className="icon-bed" />{data.listing.propertyDetails.bedrooms}</span>
                                <span className="icon-wrapper"><i className="icon-bath" />{data.listing.propertyDetails.bathrooms}</span>
                                <span className="icon-wrapper"><i className="icon-cab" />{data.listing.propertyDetails.carspaces}</span>
                                {auctionDate && isAuctionTimeInFuture &&
                                    <span className="icon-wrapper text-danger"><i className="icon-hammer me-1" />
                                        {auctionDateToDisplay === 'tomorrow' ? 'Tomorrow' : auctionDateToDisplay}
                                    </span>
                                }
                            </span>
                            <span className="row mt-1">{closestStopsMarkup}</span>
                        </div>
                        <div className="row text-center mb-2">
                            <span className="col-6"><NewTabLink href={href} label="View" className="text-success text-decoration-none" /></span>
                            <span className="col-6"><a href="javascript:(0);" className={!isArchived ? "text-danger text-decoration-none" : "text-decoration-none"} onClick={() => {
                                setIsArchived(!isArchived)
                                saveInLocalStorage(data.listing.listingSlug, !isArchived);
                            }}>{isArchived ? 'Show' : 'Hide'}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
    : <React.Fragment />;
}

export default SearchResult;