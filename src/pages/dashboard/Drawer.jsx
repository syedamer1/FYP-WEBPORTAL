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
import { useUser } from "@context/UserContext";
import DrawerAutoComplete from "@components/DrawerAutoComplete";
import dayjs from "dayjs";

const FilterDrawer = ({ open, onClose }) => {
  const theme = useTheme();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [startAdmissionDate, setStartAdmissionDate] = useState(null);
  const [endAdmissionDate, setEndAdmissionDate] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedTehsils, setSelectedTehsils] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);

  const [filterRequest, setFilterRequest] = useState({
    hospitalIds: null,
    symptoms: [],
    admissionStartDate: null,
    admissionEndDate: null,
    gender: null,
  });

  const { user } = useUser();

  const fetchProvinces = debounce(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/getIdAndName"
      );
      setProvinceOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDivisions = debounce(async (provinceIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/division/getDivisionsByProvinceIds",
        {
          params: { provinceIds: provinceIds.join(",") },
        }
      );
      setDivisionOptions(response.data);
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
      setDistrictOptions(response.data);
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
      setTehsilOptions(response.data);
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
      setHospitalOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  useEffect(() => {
    if (user.usertype === userType.superAdmin) {
      fetchProvinces();
    } else if (user.usertype === userType.provinceAdmin) {
      fetchDivisions([user.province.id]);
    } else if (user.usertype === userType.divisionAdmin) {
      fetchDistricts([user.division.id]);
    } else if (user.usertype === userType.districtAdmin) {
      fetchTehsils([user.district.id]);
    } else if (user.usertype === userType.tehsilAdmin) {
      fetchHospitals([user.tehsil.id]);
    }
  }, [user]);

  const handleProvinceSelect = (event, newValue) => {
    setSelectedProvinces(newValue);
    setSelectedDivisions([]);
    setSelectedDistricts([]);
    setSelectedTehsils([]);
    setSelectedHospitals([]);
    if (newValue.length) {
      setDivisionOptions([]);
      fetchDivisions(newValue.map((province) => province.id));
    } else {
      setDivisionOptions([]);
    }
  };

  const handleDivisionSelect = (event, newValue) => {
    setSelectedDivisions(newValue);
    setSelectedDistricts([]);
    setSelectedTehsils([]);
    setSelectedHospitals([]);
    if (newValue.length) {
      setDistrictOptions([]);
      fetchDistricts(newValue.map((division) => division.id));
    } else {
      setDistrictOptions([]);
    }
  };

  const handleDistrictSelect = (event, newValue) => {
    setSelectedDistricts(newValue);
    setSelectedTehsils([]);
    setSelectedHospitals([]);
    if (newValue.length) {
      setTehsilOptions([]);
      fetchTehsils(newValue.map((district) => district.id));
    } else {
      setTehsilOptions([]);
    }
  };

  const handleTehsilSelect = (event, newValue) => {
    setSelectedTehsils(newValue);
    setSelectedHospitals([]);
    if (newValue.length) {
      setHospitalOptions([]);
      fetchHospitals(newValue.map((tehsil) => tehsil.id));
    } else {
      setHospitalOptions([]);
    }
  };

  const handleHospitalSelect = (event, newValue) => {
    setSelectedHospitals(newValue);
  };

  const handleClose = () => {
    setProvinceOptions([]);
    setDivisionOptions([]);
    setDistrictOptions([]);
    setTehsilOptions([]);
    setHospitalOptions([]);
    setSelectedDivisions([]);
    setSelectedDistricts([]);
    setSelectedTehsils([]);
    setSelectedProvinces([]);
    setSelectedHospitals([]);
    setStartAdmissionDate(null);
    setEndAdmissionDate(null);
    setSelectedSymptoms([]);
    setSelectedGender(null);
    onClose();
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
  ];

  const userType = {
    superAdmin: "Super Administrator",
    provinceAdmin: "Province Administrator",
    divisionAdmin: "Division Administrator",
    districtAdmin: "District Administrator",
    tehsilAdmin: "Tehsil Administrator",
    hospitalAdmin: "Hospital Administrator",
  };

  const handleSymptomsSelect = (event, values) => {
    setSelectedSymptoms(values);
  };

  const handleFilterSubmit = () => {
    let hospitalIds =
      selectedHospitals.length !== 0
        ? selectedHospitals.map((hospital) => hospital.id)
        : null;
    if (hospitalIds == null && user.usertype === userType.hospitalAdmin) {
      hospitalIds = [user.hospital.id];
    }
    setFilterRequest({
      hospitalIds: hospitalIds,
      symptoms:
        selectedSymptoms.length !== 0
          ? selectedSymptoms.map((symptom) => symptom.attrName)
          : null,
      admissionStartDate:
        startAdmissionDate !== null ? startAdmissionDate : null,
      admissionEndDate: endAdmissionDate,
      gender: null,
    });
    handleClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
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
        {user.usertype === userType.superAdmin && (
          <>
            <DrawerAutoComplete
              options={provinceOptions}
              value={selectedProvinces}
              onChange={handleProvinceSelect}
              title="Province"
            />
          </>
        )}
        {(user.usertype === userType.superAdmin ||
          user.usertype === userType.provinceAdmin) && (
          <>
            <DrawerAutoComplete
              options={divisionOptions}
              value={selectedDivisions}
              onChange={handleDivisionSelect}
              title="Division"
              disabled={
                selectedProvinces.length === 0 &&
                user.usertype === userType.superAdmin
              }
            />
          </>
        )}
        {(user.usertype === userType.superAdmin ||
          user.usertype === userType.provinceAdmin ||
          user.usertype === userType.divisionAdmin) && (
          <>
            <DrawerAutoComplete
              options={districtOptions}
              value={selectedDistricts}
              onChange={handleDistrictSelect}
              title="District"
              disabled={
                selectedDivisions.length === 0 &&
                (user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin)
              }
            />
          </>
        )}
        {(user.usertype === userType.superAdmin ||
          user.usertype === userType.provinceAdmin ||
          user.usertype === userType.divisionAdmin ||
          user.usertype === userType.districtAdmin) && (
          <>
            <DrawerAutoComplete
              options={tehsilOptions}
              value={selectedTehsils}
              onChange={handleTehsilSelect}
              title="Tehsil"
              disabled={
                selectedDistricts.length === 0 &&
                (user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin)
              }
            />
          </>
        )}
        {(user.usertype === userType.superAdmin ||
          user.usertype === userType.provinceAdmin ||
          user.usertype === userType.divisionAdmin ||
          user.usertype === userType.districtAdmin ||
          user.usertype === userType.tehsilAdmin) && (
          <>
            <DrawerAutoComplete
              options={hospitalOptions}
              value={selectedHospitals}
              onChange={handleHospitalSelect}
              title="Hospital"
              disabled={
                selectedTehsils.length === 0 &&
                (user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin ||
                  user.usertype === userType.districtAdmin)
              }
            />
          </>
        )}
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
                maxDate={dayjs()}
              />
              <DatePicker
                label="End Date"
                value={endAdmissionDate}
                onChange={(newEndDate) => setEndAdmissionDate(newEndDate)}
                sx={{ mb: 2 }}
                maxDate={dayjs()}
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
        <DrawerAutoComplete
          options={patientSymptomsData}
          value={selectedSymptoms}
          onChange={handleSymptomsSelect}
          title="Symptoms"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClose}
            sx={{ width: "120px", minWidth: "120px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "120px", minWidth: "120px" }}
            onClick={handleFilterSubmit}
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
