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

    return (
        <>
            <div id="search" className="p-2">
                <div className="row">
                    <div className="col-sm-2">
                        <label htmlFor="state">State:</label>
                    </div>
                    <div className="col-sm-8">
                        <input id="state" type="text" value="VIC" disabled />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-2">
                        <label htmlFor="suburb">Suburb(s):</label>
                    </div>
                    <div className="col-sm-8">
                        <input id="suburb" type="text" placeholder="e.g Kew, Rye" defaultValue={suburbs} onChange={updateSuburbs} onBlur={updateSuburbs} />
                    </div>
                </div>
                <div className="row">
                    <NumericSearchField label="Min. " icon="icon-bed" id="minBeds" defaultValue={minBeds} updateHandler={updateMinBeds} interval={1} />
                    <NumericSearchField label="Min. " icon="icon-bath" id="minBaths" defaultValue={minBaths} updateHandler={updateMinBaths} interval={1} />
                    <NumericSearchField label="Min. " icon="icon-cab" id="minCarSpaces" defaultValue={minCarSpaces} updateHandler={updateMinCarSpaces} interval={1} />
                    <NumericSearchField label="Max. " icon="icon-dollar" id="maxPrice" defaultValue={maxPrice} updateHandler={updateMaxPrice} interval={10000} />
                    <NumericSearchField label="Max. km from " icon="icon-train" id="maxDistanceFromTrain" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.25} />
                </div>
                <div className="row">
                    <div className="col-lg-8 mt-2">
                        <input type="button" value="Search" onClick={runSearch} disabled={!suburbs} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Search;