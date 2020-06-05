import React from 'react';
import NumericSearchField from '../numericSearchField';

function Search(props: any) {
    const { 
        suburb, updateSuburb,
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
                    <div className="col-lg-4">
                        <label htmlFor="state">State:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="state" type="text" value="VIC" disabled />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label htmlFor="suburb">Suburb:</label>
                    </div>
                    <div className="col-lg-8">
                        <input id="suburb" type="text" defaultValue={suburb} onChange={updateSuburb} onBlur={updateSuburb} />
                    </div>
                </div>
                <NumericSearchField label="Min. bedrooms" id="minBeds" defaultValue={minBeds} updateHandler={updateMinBeds} interval={1} />
                <NumericSearchField label="Min. bathrooms" id="minBaths" defaultValue={minBaths} updateHandler={updateMinBaths} interval={1} />
                <NumericSearchField label="Min. car spaces" id="minCarSpaces" defaultValue={minCarSpaces} updateHandler={updateMinCarSpaces} interval={1} />
                <NumericSearchField label="Max. price" id="maxPrice" defaultValue={maxPrice} updateHandler={updateMaxPrice} interval={10000} />
                <NumericSearchField label="Max. distance from train" id="maxDistanceFromTrain" defaultValue={maxDistanceFromTrain} updateHandler={updateMaxDistanceFromTrain} interval={0.5} />

                <input type="button" value="Search" onClick={runSearch} />
            </div>
        </>
    );
}

export default Search;