/* eslint-disable react/prop-types */
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
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  PersonRemove as PersonRemoveIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { useUser } from "@context/UserContext";
import { formatDatetoWordDate } from "@utility";
import DataCard from "@components/DataCard";
import CustomCard from "@components/CustomCard";
import FilterDrawer from "./Drawer";
import CustomButton from "@components/CustomButtom";
import CenteredAlert from "@components/CenteredAlert";
import AddDiseaseDialog from "./AddDiseaseDialog";
import ScatterAggregateBar from "./ScatterAggregateBar";
import PieChartStatistics from "./PieChartStatistics";
import DynamicTimeChart from "./DynamicTimeChart";
import LineRaceChart from "./LineRaceChart";
import {
  LocationOnOutlined,
  AccountTreeOutlined,
  BusinessOutlined,
  LocationCityOutlined,
  LocalHospitalOutlined,
} from "@mui/icons-material";
import { getTabIndices, userType } from "@utility";
import { debounce } from "lodash";
import { a11yProps, TabPanel } from "@components/TabPart";
// import OrganDataChart from "./OrganDataChart";
import BarChart from "./BarChart";
import DynamicAreaTimeAxis from "./DynamicAreaTimeAxis";
const CustomIconButton = styled(IconButton)({
  fontSize: "1.25rem",
});

const Dashboard = () => {
  const [BarChartData, setBarChartData] = useState([]);
  const [DynamicTimeChartData, setDynamicTimeChartData] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (userType.superAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("province");
          break;
        case 1:
          fetchBarChartData("division");
          break;
        case 2:
          fetchBarChartData("district");
          break;
        case 3:
          fetchBarChartData("tehsil");
          break;
        case 4:
          fetchBarChartData("hospital");
          break;
      }
      return;
    }
    if (userType.provinceAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("division");
          break;
        case 1:
          fetchBarChartData("district");
          break;
        case 2:
          fetchBarChartData("tehsil");
          break;
        case 3:
          fetchBarChartData("hospital");
          break;
      }
    }
    if (userType.divisionAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("district");
          break;
        case 1:
          fetchBarChartData("tehsil");
          break;
        case 2:
          fetchBarChartData("hospital");
          break;
      }
    }
    if (userType.districtAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("tehsil");
          break;
        case 1:
          fetchBarChartData("hospital");
          break;
      }
    }
    if (userType.hospitalAdmin == user.usertype) {
      switch (newValue) {
        case 0:
          fetchBarChartData("hospital");
          break;
      }
    }
  };

  const fetchBarChartData = debounce(
    async (type, updatedFilters = initialFilters) => {
      try {
        if (type == null || selectedDisease == null) {
          return;
        }

        const response = await axios.post(
          `${
            import.meta.env.VITE_REACT_APP_BASEURL
          }/dashboard/getBarChartData/${type}/${user.id}/${selectedDisease.id}`,
          updatedFilters
        );
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    },
    300
  );

  const [drawerOpen, setFilterDrawerOpen] = useState(false);
  const [AddDiseaseDialogOpen, setAddDiseaseDialogOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [disease, setDisease] = useState([]);
  const initialFilters = {
    hospitalIds: [],
    symptoms: [],
    admissionStartDate: null,
    admissionEndDate: null,
    gender: null,
    ageStart: null,
    ageEnd: null,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [statisticCardData, setStatisticCardData] = useState({
    patientsTotalCount: 0,
    patientsCount: 0,
    patientsDeathsCount: 0,
    patientsRecoveredCount: 0,
    patientsChronicCount: 0,
    admissionStartDate: null,
    admissionEndDate: null,
  });

  const { user } = useUser();

  const fetchDisease = debounce(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASEURL}/disease/getIdAndName`
      );
      setDisease(response.data);
    } catch (error) {
      console.error("Error fetching disease names:", error);
    }
  }, 300);

  const fetchDashboardData = debounce(
    async (updatedFilters = initialFilters) => {
      try {
        if (selectedDisease != null && user != null) {
          const response = await axios.post(
            `${
              import.meta.env.VITE_REACT_APP_BASEURL
            }/dashboard/getDashboardData/${user.id}/${selectedDisease.id}`,
            updatedFilters
          );
          setStatisticCardData(response.data.statisticResponse);
          setDynamicTimeChartData(
            response.data.dynamicTimeChartData.dataPoints
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    300
  );

  useEffect(() => {
    fetchDashboardData();
    if (user.usertype === userType.superAdmin) {
      fetchBarChartData("province");
    } else if (user.usertype === userType.provinceAdmin) {
      fetchBarChartData("division");
    } else if (user.usertype === userType.divisionAdmin) {
      fetchBarChartData("district");
    } else if (user.usertype === userType.tehsilAdmin) {
      fetchBarChartData("hospital");
    } else if (user.usertype === userType.hospitalAdmin) {
      fetchBarChartData("hospital");
    }
    fetchDisease();
  }, [selectedDisease == null]);

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!drawerOpen);
  };

  const toggleAddDiseaseDialog = () => {
    setAddDiseaseDialogOpen((prev) => !prev);
  };

  const handleFilterValue = (filtersValue) => {
    let updatedFilters;
    setFilters((prevFilters) => {
      updatedFilters = { ...prevFilters, ...filtersValue };
    });
    setFilters(filtersValue);
    if (userType.superAdmin == user.usertype) {
      switch (value) {
        case 0:
          fetchBarChartData("province", updatedFilters);
          break;
        case 1:
          fetchBarChartData("division", updatedFilters);
          break;
        case 2:
          fetchBarChartData("district"), updatedFilters;
          break;
        case 3:
          fetchBarChartData("tehsil", updatedFilters);
          break;
        case 4:
          fetchBarChartData("hospital", updatedFilters);
          break;
        default:
          break;
      }
      return;
    }
    switch (value) {
      case 0:
        fetchBarChartData("division", updatedFilters);
        break;
      case 1:
        fetchBarChartData("district", updatedFilters);
        break;
      case 2:
        fetchBarChartData("tehsil", updatedFilters);
        break;
      case 3:
        fetchBarChartData("hospital", updatedFilters);
        break;
      case 4:
        fetchBarChartData("hospital", updatedFilters);
        break;
      default:
        break;
    }
    fetchDashboardData();
  };
  const tabIndices = getTabIndices(user.usertype);

  const {
    patientsTotalCount,
    patientsCount,
    patientsDeathsCount,
    patientsRecoveredCount,
    patientsChronicCount,
    admissionStartDate,
    admissionEndDate,
  } = statisticCardData;

  const recoveryRate = (patientsRecoveredCount / patientsTotalCount) * 100;
  const deathRate = (patientsDeathsCount / patientsTotalCount) * 100;
  const chronicRate = (patientsChronicCount / patientsTotalCount) * 100;

  const recoveryTrend =
    recoveryRate > 50 ? "Positive Recovery Trend" : "Negative Recovery Trend";
  const deathTrend =
    deathRate > 5 ? "Negative Death Trend" : "Positive Death Trend";

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
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Disease"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
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
        {selectedDisease != null ? (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Population"
                count={patientsCount}
                percentage={(patientsCount / patientsTotalCount) * 100}
                IconComponent={PeopleAltOutlinedIcon}
                summarytitle="Time Period:"
                summary={`${formatDatetoWordDate(
                  admissionStartDate
                )} ~ ${formatDatetoWordDate(admissionEndDate)}`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Recovered Patient"
                count={patientsRecoveredCount}
                percentage={recoveryRate.toFixed(2)}
                IconComponent={LocalHospitalIcon}
                summarytitle="Recovery Rate:"
                summary={`${recoveryTrend} ${recoveryRate.toFixed(2)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Decreased Patient"
                count={patientsDeathsCount}
                percentage={deathRate.toFixed(2)}
                IconComponent={PersonRemoveIcon}
                summarytitle="Death Rate:"
                summary={`${deathTrend} ${deathRate.toFixed(2)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DataCard
                title="Chronic Patient Population"
                count={patientsChronicCount}
                percentage={chronicRate.toFixed(2)}
                IconComponent={PeopleAltOutlinedIcon}
                summarytitle="Summary:"
                summary={`${chronicRate.toFixed(
                  2
                )}% Chronic Patients out of ${patientsTotalCount.toLocaleString()}`}
              />
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Typography variant="h5">
                Pie Graph - Population Statistics
              </Typography>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <PieChartStatistics
                    chartData={{
                      recoveredPatient: patientsRecoveredCount,
                      deathPatient: patientsDeathsCount,
                    }}
                  />
                </Box>
              </CustomCard>
            </Grid>
            {/* Bar Graph - Patient Population Statistics*/}
            <Grid item xs={12} md={7} lg={8}>
              <Typography variant="h5">
                Bar Graph - Patient Population Statistics -{" "}
                {value === tabIndices.province
                  ? "Province"
                  : value === tabIndices.division
                  ? "Division"
                  : value === tabIndices.district
                  ? "District"
                  : value === tabIndices.tehsil
                  ? "Tehsil"
                  : "Hospital"}
              </Typography>
              <CustomCard content={false} sx={{ mt: 1.5 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="bar area tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ minHeight: "48px" }} // Adjust the height of the Tabs container
                >
                  {user.usertype === userType.superAdmin && (
                    <Tab
                      label="Province"
                      icon={<LocationOnOutlined />}
                      iconPosition="start"
                      {...a11yProps(tabIndices.province)}
                      sx={{ minHeight: "48px", minWidth: "100px" }} // Adjust the size of each Tab
                    />
                  )}
                  {(user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin) && (
                    <Tab
                      label="Division"
                      icon={<AccountTreeOutlined />}
                      iconPosition="start"
                      {...a11yProps(tabIndices.division)}
                      sx={{ minHeight: "48px", minWidth: "100px" }} // Adjust the size of each Tab
                    />
                  )}
                  {(user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin ||
                    user.usertype === userType.divisionAdmin) && (
                    <Tab
                      label="District"
                      icon={<BusinessOutlined />}
                      iconPosition="start"
                      {...a11yProps(tabIndices.district)}
                      sx={{ minHeight: "48px", minWidth: "100px" }} // Adjust the size of each Tab
                    />
                  )}
                  {(user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin ||
                    user.usertype === userType.divisionAdmin ||
                    user.usertype === userType.districtAdmin) && (
                    <Tab
                      label="Tehsil"
                      icon={<LocationCityOutlined />}
                      iconPosition="start"
                      {...a11yProps(tabIndices.tehsil)}
                      sx={{ minHeight: "48px", minWidth: "100px" }} // Adjust the size of each Tab
                    />
                  )}
                  {(user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin ||
                    user.usertype === userType.divisionAdmin ||
                    user.usertype === userType.districtAdmin ||
                    user.usertype === userType.tehsilAdmin) && (
                    <Tab
                      label="Hospital"
                      icon={<LocalHospitalOutlined />}
                      iconPosition="start"
                      {...a11yProps(tabIndices.hospital)}
                      sx={{ minHeight: "48px", minWidth: "100px" }} // Adjust the size of each Tab
                    />
                  )}
                </Tabs>
                {user.usertype === userType.superAdmin && (
                  <TabPanel value={value} index={tabIndices.province}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <BarChart BarChartdata={BarChartData} />
                    </Box>
                  </TabPanel>
                )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin) && (
                  <TabPanel value={value} index={tabIndices.division}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <BarChart BarChartdata={BarChartData} />
                    </Box>
                  </TabPanel>
                )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin) && (
                  <TabPanel value={value} index={tabIndices.district}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <BarChart BarChartdata={BarChartData} />
                    </Box>
                  </TabPanel>
                )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin ||
                  user.usertype === userType.districtAdmin) && (
                  <TabPanel value={value} index={tabIndices.tehsil}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <BarChart BarChartdata={BarChartData} />
                    </Box>
                  </TabPanel>
                )}
                {(user.usertype === userType.superAdmin ||
                  user.usertype === userType.provinceAdmin ||
                  user.usertype === userType.divisionAdmin ||
                  user.usertype === userType.districtAdmin ||
                  user.usertype === userType.tehsilAdmin) && (
                  <TabPanel value={value} index={tabIndices.hospital}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                      <BarChart BarChartdata={BarChartData} />
                    </Box>
                  </TabPanel>
                )}
              </CustomCard>
            </Grid>

            <Grid item xs={12} md={5} lg={4}>
              <Typography variant="h5">
                Dynamic Area Time Period - Patient Count
              </Typography>
              <CustomCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  <DynamicAreaTimeAxis />
                </Box>
              </CustomCard>
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              <Typography variant="h5">
                Line Race - Hospital Patient Count
              </Typography>
              <CustomCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                  <LineRaceChart />
                </Box>
              </CustomCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Typography variant="h5">
                Scatter Aggregate Bar - Gender
              </Typography>
              <Button variant="contained" color="primary">
                Export as PNG
              </Button>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <ScatterAggregateBar />
                </Box>
              </CustomCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Typography variant="h5">
                Dynamic Time Wise Patient Count
              </Typography>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <DynamicTimeChart chartData={DynamicTimeChartData} />
                </Box>
              </CustomCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography variant="h5">
                    Organ Health Overview Chart{" "}
                  </Typography>
                </Grid>
              </Grid>
              <CustomCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>{/* <OrganDataChart /> */}</Box>
              </CustomCard>
            </Grid>
          </>
        ) : (
          <CenteredAlert />
        )}
      </Grid>
    </>
  );
};

export default Dashboard;
