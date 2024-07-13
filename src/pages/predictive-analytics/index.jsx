import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Grid, Autocomplete, TextField } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ResourcesDataCard from "@components/ResourcesDataCard";
import CustomCard from "@components/CustomCard";
import PredictiveTable from "./PredictiveTable";
import PredictiveLineChart from "./PredictiveLineChart";
import MasksIcon from "@mui/icons-material/Masks";
import CenteredAlert from "@components/CenteredAlert";
import OverLayLoader from "@components/OverlayLoader";
import { useUser } from "@context/UserContext";

const PredictiveAnalytics = () => {
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchHospitalOptions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL +
            `/hospital/getHospitalOptionsBaseUser?userId=${user.id}`
        );
        setHospitalOptions(response.data);
      } catch (error) {
        console.error("Error fetching hospital options:", error);
      }
    };

    const fetchPredictiveData = async (hospital) => {
      try {
        setIsLoading(true);
        const folder_name = hospital.name + "_" + hospital.id;
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL +
            `/api/predictions?folder=${folder_name}`
        );
        setPredictionData(response.data);
      } catch (error) {
        console.error(
          "Error fetching predictive data for selected hospital:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user.hospital == null) {
      fetchHospitalOptions();
    } else {
      setSelectedHospital(user.hospital);
      fetchPredictiveData(user.hospital);
    }
  }, [user]);

  const handleHospitalChange = async (event, newValue) => {
    setSelectedHospital(newValue);

    if (newValue) {
      try {
        setIsLoading(true);
        //remove space from
        const folder_name = newValue.name + "_" + newValue.id;
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL +
            `/api/predictions?folder=${folder_name}`
        );
        setPredictionData(response.data);
      } catch (error) {
        console.error(
          "Error fetching predictive data for selected hospital:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalPatients = predictionData.reduce(
    (acc, item) => acc + item.PredictedPatients,
    0
  );
  const totalOxygenCylinders = predictionData.reduce(
    (acc, item) => acc + item.OxygenCylindersRequired,
    0
  );
  const totalVentilators = predictionData.reduce(
    (acc, item) => acc + item.VentilatorsRequired,
    0
  );

  const resourceCards = [
    {
      title: "Total Predicted Patients",
      count: totalPatients,
      IconComponent: PeopleAltOutlinedIcon,
    },
    {
      title: "Total Ventilators Required",
      count: totalVentilators,
      IconComponent: HotelIcon,
    },
    {
      title: "Total Oxygen Cylinders Required",
      count: totalOxygenCylinders,
      IconComponent: MasksIcon,
    },
    {
      title: "Average Upcoming Patients",
      count:
        predictionData.length > 0
          ? Math.floor(totalPatients / predictionData.length)
          : 0,
      IconComponent: PeopleAltOutlinedIcon,
    },
  ];

  return (
    <>
      <OverLayLoader loading={isLoading} />
      <Box>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h5">Predictive Analytics</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Autocomplete
                  sx={{
                    width: { xs: "100%", sm: 222 },
                    height: 40,
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    mb: 1.5,
                    position: "relative",
                  }}
                  id="hospital-autocomplete"
                  options={hospitalOptions}
                  getOptionLabel={(option) => option.name}
                  value={selectedHospital}
                  onChange={handleHospitalChange}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select Hospital" />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          {!selectedHospital ? (
            <CenteredAlert
              title={"Select Hospital to View Predictions"}
              color={"red"}
            />
          ) : isLoading ? (
            <CenteredAlert
              title={"Predictive data is loading"}
              color={"#ffcc00"}
            />
          ) : predictionData.length === 0 ? (
            <CenteredAlert title={"No patient data found"} color={"#ff0000"} />
          ) : (
            <>
              {resourceCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ResourcesDataCard
                    title={card.title}
                    count={card.count}
                    IconComponent={card.IconComponent}
                  />
                </Grid>
              ))}
              <Grid item xs={12} md={5} lg={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h5">
                      Predictive Analytic Table - Upcoming Patients
                    </Typography>
                  </Grid>
                </Grid>
                <CustomCard sx={{ mt: 2 }} content={false}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <PredictiveTable data={predictionData} />
                  </Box>
                </CustomCard>
              </Grid>
              <Grid item xs={12} md={7} lg={12}>
                <Typography variant="h5">
                  Line Graph - Hospital Patient Count
                </Typography>
                <CustomCard content={false} sx={{ mt: 1.5 }}>
                  <Box sx={{ pt: 1, pr: 2 }}>
                    <PredictiveLineChart chartData={predictionData} />
                  </Box>
                </CustomCard>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default PredictiveAnalytics;
