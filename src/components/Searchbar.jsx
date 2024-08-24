import React, { useState } from 'react';
import { Autocomplete } from '@mui/material';
import { useData } from '../services/DataHandler.jsx';
import { StyledTextField, StyledBox } from './Searchbar.styles.jsx';

function Searchbar({ onSearch }) {
    const [inputValue, setInputValue] = useState('');
    const { keywords } = useData();

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        onSearch(newInputValue); // Update the search query
    };

    // Filter keywords based on input value
    const filteredKeywords = inputValue ? keywords : [];

    return (
        <StyledBox>
            <Autocomplete
                freeSolo
                options={filteredKeywords}
                disablePortal={false}
                inputValue={inputValue}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                    <StyledTextField
                        {...params}
                        label="Search..."
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
        </StyledBox>
    );
}

export default Searchbar;