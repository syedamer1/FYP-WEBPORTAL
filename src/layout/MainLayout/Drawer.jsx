/* eslint-disable no-unused-vars */
import {
  Box,
  Divider,
  Drawer,
  TextField,
  Autocomplete,
  Checkbox,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
const FilterDrawer = ({ open, onClose }) => {
  const [provinces, setProvinces] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedTehsils, setSelectedTehsils] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);

  const theme = useTheme();

  const fetchProvinces = debounce(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/get"
      );
      setProvinces(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDivisions = debounce(async (provinceIds) => {
    console.log(provinceIds);
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/division/getDivisionsByProvinceIds",
        {
          params: { provinceIds: provinceIds.join(",") },
        }
      );
      setDivisions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDistricts = debounce(async (divisionIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/district/getDistrictsByDivisionIds",
        {
          params: { divisionIds: divisionIds.join(",") },
        }
      );
      setDistricts(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchTehsils = debounce(async (districtIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/tehsil/getTehsilsByDistrictIds",
        {
          params: { districtIds: districtIds.join(",") },
        }
      );
      setTehsils(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchHospitals = debounce(async (tehsilIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/hospital/getHospitalsByTehsilIds",
        {
          params: { tehsilIds: tehsilIds.join(",") },
        }
      );
      setHospitals(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleProvinceSelect = (event, values) => {
    setSelectedProvinces(values);
    if (!values || values.length === 0) {
      setSelectedDivisions([]);
      setSelectedDistricts([]);
      setSelectedTehsils([]);
      setHospitals([]);
    } else {
      fetchDivisions(values.map((province) => province.id));
    }
  };

  const handleDivisionSelect = (event, values) => {
    setSelectedDivisions(values);
    if (!values || values.length === 0) {
      setSelectedDistricts([]);
      setSelectedTehsils([]);
      setHospitals([]);
    } else {
      fetchDistricts(values.map((division) => division.id));
    }
  };

  const handleDistrictSelect = (event, values) => {
    setSelectedDistricts(values);
    if (!values || values.length === 0) {
      setSelectedTehsils([]);
      setHospitals([]);
    } else {
      fetchTehsils(values.map((district) => district.id));
    }
  };

  const handleTehsilSelect = (event, values) => {
    setSelectedTehsils(values);
    if (!values || values.length === 0) {
      setHospitals([]);
    } else {
      fetchHospitals(values.map((tehsil) => tehsil.id));
    }
  };

  const handleHospitalSelect = (event, values) => {
    setSelectedHospitals(values);
  };

  const patientSymptomsData = [
    { label: "Headache", id: 1 },
    { label: "Dizziness", id: 2 },
    { label: "Nausea", id: 3 },
  ];

  const diseaseSymptomsData = [
    { label: "Fever", id: 1 },
    { label: "Cough", id: 2 },
    { label: "Fatigue", id: 3 },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      BackdropProps={{ invisible: true }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: open ? 290 : 0,
          minWidth: 290,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundImage: "none",
          boxShadow: "none",
          overflowX: "hidden",
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      <Box sx={{ width: 290, padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <TuneIcon sx={{ marginRight: 1 }} />
          <Typography variant="h3" sx={{ marginTop: 1.5 }} gutterBottom>
            Filters Drawer
          </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
          Province
        </Typography>
        <Autocomplete
          multiple
          options={provinces.filter(
            (province) => !selectedProvinces.includes(province)
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedProvinces}
          onChange={handleProvinceSelect}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 1,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Province"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Division
        </Typography>
        <Autocomplete
          multiple
          options={divisions.filter(
            (division) => !selectedDivisions.includes(division)
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedDivisions}
          onChange={handleDivisionSelect}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Division"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          District
        </Typography>
        <Autocomplete
          multiple
          options={districts.filter(
            (district) => !selectedDistricts.includes(district)
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedDistricts}
          onChange={handleDistrictSelect}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select District"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Tehsil
        </Typography>
        <Autocomplete
          multiple
          options={tehsils.filter(
            (tehsil) => !selectedTehsils.includes(tehsil)
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedTehsils}
          onChange={handleTehsilSelect}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Tehsil"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Hospital
        </Typography>
        <Autocomplete
          multiple
          options={hospitals.filter(
            (hospital) => !selectedHospitals.includes(hospital)
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedHospitals}
          onChange={(event, value) => setSelectedHospitals(value)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Hospital"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Gender
        </Typography>
        <Autocomplete
          fullWidth
          disablePortal
          id="basic-autocomplete"
          options={[
            { label: "Male", id: 1 },
            { label: "Female", id: 2 },
          ]}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Gender"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Disease Symptoms
        </Typography>
        <Autocomplete
          multiple
          options={diseaseSymptomsData}
          disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Disease Symptoms"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Patient Symptoms
        </Typography>
        <Autocomplete
          multiple
          options={patientSymptomsData}
          disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option.name}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{
                  marginRight: 8,
                  transform: "scale(1)",
                  color: theme.palette.secondary[300],
                }}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Patient Symptoms"
              sx={{ width: "235px" }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: 1,
            },
            "& .MuiAutocomplete-tag": {
              bgcolor: "primary.lighter",
              border: "1px solid",
              borderColor: "primary.light",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
                "&:hover": {
                  color: "primary.dark",
                },
              },
            },
            mb: 2,
          }}
        />
      </Box>
    </Drawer>
  );
};

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterDrawer;
