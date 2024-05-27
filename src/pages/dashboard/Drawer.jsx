/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { debounce } from "lodash";

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
  Button,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FilterDrawer = ({ open, onClose }) => {
  const theme = useTheme();

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
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [startAdmissionDate, setStartAdmissionDate] = useState(null);
  const [endAdmissionDate, setEndAdmissionDate] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const [filterRequest, setFilterRequest] = useState({
    provinceIds: null,
    divisionIds: null,
    districtIds: null,
    tehsilIds: null,
    hospitalIds: null,
    symptoms: [],
    admissionStartDate: null,
    admissionEndDate: null,
    gender: null,
  });

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

  const handleSymptomsSelect = (event, values) => {
    setSelectedSymptoms(values);
  };

  const patientSymptomsData = [
    { id: 1, name: "Blood", attrName: "blood" },
    { id: 2, name: "Chronic Disease", attrName: "chronicdisease" },
    { id: 3, name: "Diabetes", attrName: "diabetes" },
    { id: 4, name: "High Fever", attrName: "highFever" },
    { id: 5, name: "Fever", attrName: "fever" },
    { id: 6, name: "Hypertension", attrName: "hypertension" },
    { id: 7, name: "Cardiac", attrName: "cardiac" },
    { id: 8, name: "Weakness/Pain", attrName: "weaknessPain" },
    { id: 9, name: "Respiratory", attrName: "respiratory" },
    { id: 10, name: "Cancer", attrName: "cancer" },
    { id: 11, name: "Thyroid", attrName: "thyroid" },
    { id: 12, name: "Prostate", attrName: "prostate" },
    { id: 13, name: "Kidney", attrName: "kidney" },
    { id: 14, name: "Neuro", attrName: "neuro" },
    { id: 15, name: "Nausea", attrName: "nausea" },
    { id: 16, name: "Asymptomatic", attrName: "asymptomatic" },
    { id: 17, name: "Gastrointestinal", attrName: "gastrointestinal" },
    { id: 18, name: "Ortho", attrName: "ortho" },
    {
      id: 19,
      name: "Respiratory (Chronic Disease)",
      attrName: "respiratoryCD",
    },
    { id: 20, name: "Cardiac (Chronic Disease)", attrName: "cardiacsCD" },
    { id: 21, name: "Kidney (Chronic Disease)", attrName: "kidneyCD" },
  ];

  const handleFilterSubmit = () => {
    setFilterRequest({
      provinceIds:
        selectedProvinces.length != 0
          ? selectedProvinces.map((province) => province.id)
          : null,
      divisionIds:
        selectedDivisions.length != 0
          ? selectedDivisions.map((division) => division.id)
          : null,
      districtIds:
        selectedDistricts.length != 0
          ? selectedDistricts.map((district) => district.id)
          : null,
      tehsilIds:
        selectedTehsils.length != 0
          ? selectedTehsils.map((tehsil) => tehsil.id)
          : null,
      hospitalIds:
        selectedHospitals.length != 0
          ? selectedHospitals.map((hospital) => hospital.id)
          : null,
      symptoms:
        selectedSymptoms.length != 0
          ? selectedSymptoms.map((symptom) => symptom.attrName)
          : null,
      admissionStartDate:
        startAdmissionDate != null ? startAdmissionDate : null,
      admissionEndDate: endAdmissionDate,
      gender: null,
    });
  };

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
          width: open ? 300 : 0,
          minWidth: 300,
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
          <IconButton
            onClick={onClose}
            sx={{
              marginLeft: "auto",
              "&:hover": {
                color: "red",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
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
          Admission Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={startAdmissionDate}
                onChange={(newStartAdmissionDate) =>
                  setStartAdmissionDate(newStartAdmissionDate)
                }
              />
              <DatePicker
                label="End Date"
                value={endAdmissionDate}
                onChange={(newEndDate) => setEndAdmissionDate(newEndDate)}
                sx={{ mb: 2 }}
              />
            </Box>
          </DemoContainer>
        </LocalizationProvider>

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
            {
              label: "Both",
              id: 3,
            },
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
          Patient Symptoms
        </Typography>
        <Autocomplete
          gutterBottom
          multiple
          options={patientSymptomsData.filter(
            (sym) =>
              !selectedSymptoms.some(
                (selectedSymptom) => selectedSymptom.id === sym.id
              )
          )}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          value={selectedSymptoms}
          onChange={handleSymptomsSelect}
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            sx={{ width: "120px", minWidth: "120px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "120px", minWidth: "120px" }}
            onclick={handleFilterSubmit}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterDrawer;
