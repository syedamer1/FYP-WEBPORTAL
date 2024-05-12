import MainCard from "@components/CustomCard";
import HospitalTable from "./HospitalTable";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import { useState, useEffect } from "react";
import OverlayLoader from "@components/OverlayLoader";

const ManageHospital = () => {
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [hospitalData, setHospitalData] = useState([]);

  const fetchData = async () => {
    try {
      const [hospitalDataResponse, tehsilOptionsResponse] = await Promise.all([
        axios.get("http://localhost:8080/hospital/get"),
        axios.get("http://localhost:8080/tehsil/getIdAndName"),
      ]);
      setHospitalData(hospitalDataResponse.data);
      setTehsilOptions(tehsilOptionsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {};
  }, []);

  return (
    <>
      <OverlayLoader loading={fetching} />

      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Hospital
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />

        <HospitalTable
          hospitalData={hospitalData}
          tehsilOptions={tehsilOptions}
        />
      </MainCard>
    </>
  );
};

export default ManageHospital;
