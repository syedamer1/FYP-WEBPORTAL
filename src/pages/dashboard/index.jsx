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
import fetchDisease$ from "./_request";
const Dashboard = () => {
  const CustomIconButton = styled(IconButton)({
    fontSize: "1.25rem",
  });

  const [IsAddDiseaseOpen, setIsAddDiseaseOpen] = useState(false);

  const handleIsAddDiseaseOpen = () => {
    setIsAddDiseaseOpen(true);
  };

  const handleIsAddDiseaseClose = () => {
    setIsAddDiseaseOpen(false);
  };
  const chartData = [
    { value: 3055448, name: "Recovered Patients" },
    { value: 1010120, name: "Decrease Patients" },
  ];
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [disease, setDisease] = useState(["COVID-19", "Influenza", "Ebola"]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    fetchDisease$({ setDisease });
    setFetching(false);
  }, [disease]);

  return (
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
                        {" "}
                        <Tooltip
                          disableFocusListener
                          disableTouchListener
                          title="Add Disease"
                        >
                          <CustomIconButton
                            onClick={handleIsAddDiseaseOpen}
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
              open={IsAddDiseaseOpen}
              onClose={handleIsAddDiseaseClose}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DataCard
          title="Population"
          count="4,065,568"
          percentage={59.3}
          IconComponent={PeopleAltOutlinedIcon}
          summarytitle="Time Period:"
          summary="25 April 2023 ~ 30 April 2023"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DataCard
          title="Recovered Patient"
          count="3,055,448"
          percentage={75.14}
          IconComponent={LocalHospitalIcon}
          summarytitle="Recovery Rate:"
          summary="Positive Recovery Trend"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DataCard
          title="Decreased Patient"
          count="1,010,120"
          percentage={24.85}
          IconComponent={PersonRemoveIcon}
          summarytitle="Death Rate:"
          summary="Negative Death Trend"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DataCard
          title="Chronic Patient Population"
          count="1,42,236"
          percentage={3.5}
          IconComponent={PeopleAltOutlinedIcon}
          summarytitle="Summary:"
          summary="3.5% Chronic Patients out of 4,42,236"
        />
      </Grid>

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />

      {/*PieChartStatistics*/}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">
              Pie Graph - Population Statistics{" "}
            </Typography>
          </Grid>
        </Grid>
        <CustomCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <PieChartStatistics chartData={chartData} />
          </Box>
        </CustomCard>
      </Grid>

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">
              {" "}
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">
              Scatter Aggregate Bar - Gender{" "}
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Dynamic TimeWise Patient Count</Typography>
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
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Dynamic TimeWise Patient Count</Typography>
          </Grid>
        </Grid>
        <CustomCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <DynamicTimeChart />
          </Box>
        </CustomCard>
      </Grid>
    </Grid>
  );
};
export default Dashboard;
