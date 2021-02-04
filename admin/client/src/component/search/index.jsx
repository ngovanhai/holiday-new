import React, { useCallback, useState } from "react";
import {

    TextField,
    ChoiceList,
    Filters,

    ResourceList,
    Avatar,

} from "@shopify/polaris";
import "./search.scss"
const items = [

];
function Search(props) {
    const { setQueryString, setQueryStatus, filter, setSort } = props;
    const [eventStatus, seteventStatus] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
    const [selected, setSelected] = useState([]);
    const handleeventStatusChange = useCallback(
        (value) => {
            seteventStatus(value);
            setQueryStatus(value)
        },
        [],
    );
    const handleFiltersQueryChange = useCallback(
        (value) => {
            setQueryValue(value)
            setQueryString(value)
        },
        [],
    );
    const handleFilterSortChange = useCallback((value) => {
        setSelected(value)
        setSort(value)
    }, [])
    const handleeventStatusRemove = useCallback(
        () => seteventStatus(null),
        [],
    );
    const handleeventSortRemove = useCallback(
        () => setSelected([]),
        [],
    );
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleeventStatusRemove();
        handleQueryValueRemove();
        handleeventSortRemove()
    }, [
        handleeventStatusRemove,
        handleQueryValueRemove,
        handleeventSortRemove
    ]);
    let filters = []

    filter === "sample" ?
        filters = [

            {
                key: "Sort",
                label: "Sort",
                filter: (
                    <ChoiceList
                        title="Sort by"
                        choices={[
                            { label: "Event name A-Z", value: "NameA-z" },
                            { label: "Event name Z-A", value: "NameZ-a" },
                        ]}
                        selected={selected}
                        onChange={handleFilterSortChange}
                    />
                ),
                shortcut: true
            },


        ] : filters = [
            {
                key: 'eventStatus',
                label: 'Events status',
                filter: (
                    <ChoiceList
                        title="Events status"
                        titleHidden
                        choices={[
                            { label: 'Active', value: '1' },
                            { label: 'Disable', value: '0' },
                        ]}
                        selected={eventStatus || []}
                        onChange={handleeventStatusChange}
                        allowMultiple
                    />
                ),
                shortcut: true,
            },
            {
                key: "Sort",
                label: "Sort",
                filter: (
                    <ChoiceList
                        title="Sort by"
                        choices={[
                            { label: "Event name A-Z", value: "NameA-z" },
                            { label: "Event name Z-A", value: "NameZ-a" },
                            { label: "Time start ", value: "Time-Start" },
                            { label: "Time end ", value: "Time-End" }
                        ]}
                        selected={selected}
                        onChange={handleFilterSortChange}
                    />
                ),
                shortcut: true
            },


        ];
    const appliedFilters = [];
    if (!isEmpty(eventStatus)) {
        const key = 'eventStatus';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, eventStatus),
            onRemove: handleeventStatusRemove,
        });
    }

    if (!isEmpty(selected)) {
        const key = 'Sort';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, selected),
            onRemove: handleeventSortRemove,
        });
    }

    return (
        <div >
            <ResourceList
                resourceName={{ singular: 'customer', plural: 'customers' }}
                filterControl={
                    <Filters
                        queryValue={queryValue}
                        filters={filters}
                        appliedFilters={appliedFilters}
                        onQueryChange={handleFiltersQueryChange}
                        onQueryClear={handleQueryValueRemove}
                        onClearAll={handleFiltersClearAll}
                    />
                }
                items={items}
                renderItem={(item) => {
                    return (
                        <ResourceList.Item
                        >
                        </ResourceList.Item>
                    );
                }}
            />
        </div>
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'eventStatus':
                return value.map((val) => `Status ${val === "0" ? "Disable" : "Active"}`).join(', ');
            case 'Sort':
                return `Sort by  ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
}

export default Search;
