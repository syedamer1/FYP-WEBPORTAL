import { Autocomplete, TextField, Checkbox, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

export default function CustomAutocomplete({ data, placeholder }) {
    const theme = useTheme();
    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={data}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox style={{
                        marginRight: 8, transform: 'scale(1)', color: theme.palette.secondary[300]
                    }} checked={selected} />
                    {option.label}
                </li>
            )}
            renderInput={(params) => <TextField {...params} placeholder={placeholder} sx={{ width: '235px' }} />}
            sx={{
                '& .MuiOutlinedInput-root': {
                    p: 1
                },
                '& .MuiAutocomplete-tag': {
                    bgcolor: 'primary.lighter',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    '& .MuiSvgIcon-root': {
                        color: 'primary.main',
                        '&:hover': {
                            color: 'primary.dark'
                        }
                    }
                },
                mb: 2
            }}
        />
    );
}

CustomAutocomplete.propTypes = {
    data: PropTypes.array.isRequired,
    placeholder: PropTypes.string.isRequired
};
