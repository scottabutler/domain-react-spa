import React from 'react';
import NumericSearchField from '../numericSearchField';

function Search(props: any) {
    const {
        suburbs, updateSuburbs,
        minBeds, updateMinBeds,
        minBaths, updateMinBaths,
        minCarSpaces, updateMinCarSpaces,
        maxPrice, updateMaxPrice,
        maxDistanceFromTrain, updateMaxDistanceFromTrain,
        runSearch
    } = props;

    const labelClass = 'col-4 col-lg-12 mb-1 mb-lg-0';
    const inputClass = 'col-8 col-lg-12 mb-1 mb-lg-0';

    return (
        <>
            <div id="search" className="p-2">
                <div className="row">
                    <div className="col-5 col-md-4 col-lg-12">
                        <div className="row">
                            <div className={labelClass}>
                                <label htmlFor="state">State:</label>
                            </div>
                            <div className={inputClass}>
                                <input id="state" type="text" value="VIC" disabled />
                            </div>
                            <div className={labelClass}>
                                <label htmlFor="suburb">Suburb(s):</label>
                            </div>
                            <div className={inputClass}>
                                <input id="suburb" type="text" placeholder="Suburb e.g Kew, Rye" defaultValue={suburbs} onChange={updateSuburbs} onBlur={updateSuburbs} />
                            </div>
                        </div>
                    </div>
                    <div className="col-7 col-md-8 col-lg-12">
                        <div className="row">
                            <NumericSearchField label="Min. " icon="icon-bed" id="minBeds" defaultValue={minBeds} updateHandler={updateMinBeds} interval={1} />
                            <NumericSearchField label="Min. " icon="icon-bath" id="minBaths" defaultValue={minBaths} updateHandler={updateMinBaths} interval={1} />
                            <NumericSearchField label="Min. " icon="icon-cab" id="minCarSpaces" defaultValue={minCarSpaces} updateHandler={updateMinCarSpaces} interval={1} />
                            <NumericSearchField label="Max. " icon="icon-dollar" id="maxPrice" defaultValue={maxPrice} updateHandler={updateMaxPrice} interval={10000} />
                            <NumericSearchField label="Max. km from " icon="icon-train" id="maxDistanceFromTrain" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.25} />
                            <div className="col-2 col-lg-6">
                                <input id="searchButton" type="button" value="Search" onClick={runSearch} disabled={!suburbs} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="row"> */}

                {/* </div> */}
            </div>
        </>
    );
}

export default Search;