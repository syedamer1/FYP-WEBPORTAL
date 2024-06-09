/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import DataCard from "@components/DataCard";
import CustomCard from "@components/CustomCard";
import ScatterAggregateBar from "./ScatterAggregateBar";
import PieChartStatistics from "./PieChartStatistics";
import DynamicTimeChart from "./DynamicTimeChart";
import LineRaceChart from "./LineRaceChart";
import {
  Add as AddIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  PersonRemove as PersonRemoveIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import AddDiseaseDialog from "./AddDiseaseDialog";
import { styled } from "@mui/material/styles";
import axios from "axios";
import FilterDrawer from "./Drawer";
import CustomButton from "@components/CustomButtom";
import { useUser } from "@context/UserContext";
import { formatDate2 } from "@utility";
import CenteredAlert from "@components/CenteredAlert";
import { filter } from "lodash";
const Dashboard = () => {
  const [drawerOpen, setFilterDrawerOpen] = useState(false);
  const [statisticCardData, setStatisticCardData] = useState({
    patientsTotalCount: 0,
    patientsCount: 0,
    patientsDeathsCount: 0,
    patientsRecoveredCount: 0,
    patientsChronicCount: 0,
    admissionStartDate: null,
    admissionEndDate: null,
  });
  const [filters, setFilters] = useState({
    hospitalIds: [],
    symptoms: [],
    admissionStartDate: null,
    admissionEndDate: null,
    gender: null,
    ageStart: null,
    ageEnd: null,
  });
  const recoveryRate =
    (statisticCardData.patientsRecoveredCount /
      statisticCardData.patientsTotalCount) *
    100;
  const deathRate =
    (statisticCardData.patientsDeathsCount /
      statisticCardData.patientsTotalCount) *
    100;
  const chronicRate =
    (statisticCardData.patientsChronicCount /
      statisticCardData.patientsTotalCount) *
    100;

  const recoveryTrend =
    recoveryRate > 50 ? "Positive Recovery Trend" : "Negative Recovery Trend";
  const deathTrend =
    deathRate > 5 ? "Negative Death Trend" : "Positive Death Trend";

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!drawerOpen);
  };
  const CustomIconButton = styled(IconButton)({
    fontSize: "1.25rem",
  });

  const [AddDiseaseDialogOpen, setAddDiseaseDialogOpen] = useState(false);

  const toggleAddDiseaseDialog = () => {
    setAddDiseaseDialogOpen((prev) => !prev);
  };

  const [selectedDisease, setSelectedDisease] = useState(null);
  const [disease, setDisease] = useState([]);

  const fetchDisease = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/disease/getIdAndName"
      );
      setDisease(response.data);
    } catch (error) {
      console.error("Error fetching disease names:", error);
    }
  };
  const fetchDashboardData = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/dashboard/getDashboardData/" +
          user.id +
          "/" +
          selectedDisease.id,
        filters
      );
      const data = response.data;
      setStatisticCardData(data.statisticResponse);
      console.log("statisticCardData", statisticCardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const handleFilterValue = (filtersValue) => {
    setFilters(filtersValue);
    fetchDashboardData();
  };
  useEffect(() => {
    fetchDashboardData();
    fetchDisease();
  }, [selectedDisease]);

  const { user, updateUser } = useUser();

  return (
    <>
      {selectedDisease != null && (
        <>
          <CustomButton
            onButtonClick={toggleFilterDrawer}
            buttonOpen={drawerOpen}
          />
          <FilterDrawer
            open={drawerOpen}
            onClose={toggleFilterDrawer}
            handleFilterValue={handleFilterValue}
          />
        </>
      )}
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* row 1 */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">Real-Time Analytics</Typography>
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
                id="Disease-autocomplete"
                options={disease}
                getOptionLabel={(option) => option.name}
                value={selectedDisease}
                onChange={(event, newValue) => setSelectedDisease(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Disease"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title="Add Disease"
                          >
                            <CustomIconButton
                              onClick={toggleAddDiseaseDialog}
                              size="small"
                              sx={{
                                top: "50%",
                                zIndex: 1,
                              }}
                            >
                              <AddIcon />
                            </CustomIconButton>
                          </Tooltip>
                        </>
                      ),
                    }}
                  />
                )}
              />

              <AddDiseaseDialog
                open={AddDiseaseDialogOpen}
                onClose={toggleAddDiseaseDialog}
              />
            </Grid>
          </Grid>
        </Grid>
        {selectedDisease != null && (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Population"
                count={statisticCardData.patientsCount}
                percentage={
                  (statisticCardData.patientsCount /
                    statisticCardData.patientsTotalCount) *
                  100
                }
                IconComponent={PeopleAltOutlinedIcon}
                summarytitle="Time Period:"
                summary={`${formatDate2(
                  statisticCardData.admissionStartDate
                )} ~ ${formatDate2(statisticCardData.admissionEndDate)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Recovered Patient"
                count={statisticCardData.patientsRecoveredCount}
                percentage={recoveryRate.toFixed(2)}
                IconComponent={LocalHospitalIcon}
                summarytitle="Recovery Rate:"
                summary={`${recoveryTrend} ${recoveryRate.toFixed(2)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Decreased Patient"
                count={statisticCardData.patientsDeathsCount}
                percentage={deathRate.toFixed(2)}
                IconComponent={PersonRemoveIcon}
                summarytitle="Death Rate:"
                summary={`${deathTrend} ${deathRate.toFixed(2)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Chronic Patient Population"
                count={statisticCardData.patientsChronicCount}
                percentage={chronicRate.toFixed(2)}
                IconComponent={PeopleAltOutlinedIcon}
                summarytitle="Summary:"
                summary={`${chronicRate.toFixed(
                  2
                )}% Chronic Patients out of ${statisticCardData.patientsTotalCount.toLocaleString()}`}
              />
            </Grid>

            <Grid
              item
              md={8}
              sx={{ display: { sm: "none", md: "block", lg: "none" } }}
            />

            {/*PieChartStatistics*/}
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Pie Graph - Population Statistics
                  </Typography>
                </Grid>
              </Grid>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <PieChartStatistics chartData={{}} />
                </Box>
              </CustomCard>
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Line Race - Hospital Patient Count
                  </Typography>
                </Grid>
              </Grid>
              <CustomCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  <LineRaceChart />
                </Box>
              </CustomCard>
            </Grid>

            {/*ScatterAggregateBar - Gender*/}
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Scatter Aggregate Bar - Gender
                  </Typography>
                </Grid>
                <Button variant="contained" color="primary">
                  Export as PNG
                </Button>
              </Grid>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <ScatterAggregateBar />
                </Box>
              </CustomCard>
            </Grid>

            {/*organ Data Chart
              <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h5">Organ Health Overview Chart </Typography>
                  </Grid>
                </Grid>
                <CustomCard sx={{ mt: 2 }} content={false}>
                  <Box sx={{ p: 3, pb: 0 }}><<OrganDataChart/></Box>
                </CustomCard>
              </Grid>*/}

            {/*Dynamic Data + Time Axis Chart*/}
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Dynamic TimeWise Patient Count
                  </Typography>
                </Grid>
              </Grid>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <DynamicTimeChart />
                </Box>
              </CustomCard>
            </Grid>

            {/*Dynamic Data + Time Axis Chart*/}
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Dynamic TimeWise Patient Count
                  </Typography>
                </Grid>
              </Grid>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <DynamicTimeChart />
                </Box>
              </CustomCard>
            </Grid>
          </>
        )}
        {selectedDisease == null && <CenteredAlert />}
      </Grid>
    </>
  );
};
export default Dashboard;
