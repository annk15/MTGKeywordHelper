import { styled } from '@mui/material';
import { TextField, Box } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px', // Border radius for the entire TextField
        backgroundColor: 'var(--colorAutoComplete)', // Background color
        transition: '0.3s ease',

        // Styling the input field itself
        '& input': {
            color: 'var(--colorPrimaryText)', // Text color inside the input
            fontFamily: 'Inter, sans-serif',
            fontFeatureSettings: "'liga' 1, 'calt' 1",
        },

        '&:hover': {
            backgroundColor: 'var(--colorHover)', // Background color on hover
            transition: '0.3s ease',
        },

        // Border color when hovered
        '&:hover fieldset': {
            borderColor: 'transparent',
        },

        // Default border color
        '& fieldset': {
            borderColor: 'transparent',
        },

        // Border color when focused
        '&.Mui-focused fieldset': {
            border: '1px solid var(--colorPrimary)',
        },

        // Focused state styling for the entire component
        '&.Mui-focused': {
            backgroundColor: 'var(--colorHover)',
        },
    },
    // Label styles
    '& .MuiFormLabel-root': {
        color: 'var(--colorSecondaryText)', // Label color
        fontFamily: 'Inter, sans-serif',
        fontFeatureSettings: "'liga' 1, 'calt' 1",
        
        '&.Mui-focused': {
            color: 'var(--colorPrimaryText)', // Label color when focused
        },
    },
    // Clear button styles
    '& .MuiSvgIcon-root': {
        color: 'var(--colorSecondaryText)', // Set clear button color
        scale: '1.2',
        '&:hover': {
            color: 'var(--colorPrimaryText)', // Background color on hover
        },
    },
    '& .MuiInputLabel-root': {
        opacity: '0.9',

        '&.Mui-focused': {
            opacity: '0.9',
        }
    },
    '& .MuiAutocomplete-popper': {
        zIndex: '2000',
    },
}));

export const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '40rem',
    marginBottom: '2.75rem',
}));