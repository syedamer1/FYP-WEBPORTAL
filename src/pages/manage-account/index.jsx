import MainCard from "@components/CustomCard";
import AccountTable from "./AccountTable";
import { Grid, Typography } from "@mui/material/";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import OverlayLoader from "@components/OverlayLoader";

const ManageAccount = () => {
  const [userData, setUserData] = useState([]);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    try {
      const [
        userDataResponse,
        tehsilOptionsResponse,
        districtOptionsResponse,
        divisionOptionsResponse,
        provinceOptionsResponse,
        hospitalOptionsResponse,
      ] = await Promise.all([
        axios.get("http://localhost:8080/user/get"),
      //  axios.get("http://localhost:8080/tehsil/get"),
        //axios.get("http://localhost:8080/district/get"),
        //axios.get("http://localhost:8080/division/get"),
       // axios.get("http://localhost:8080/province/get"),
        //axios.get("http://localhost:8080/hospital/get"),
      ]);
      setUserData(userDataResponse.data);
      setTehsilOptions(tehsilOptionsResponse.data);
      setDistrictOptions(districtOptionsResponse.data);
      setDivisionOptions(divisionOptionsResponse.data);
      setProvinceOptions(provinceOptionsResponse.data);
      setHospitalOptions(hospitalOptionsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // You might want to handle errors more gracefully, perhaps by showing a message to the user
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      // Cleanup function to cancel any ongoing requests
      // Not necessary in this case since axios automatically cancels requests for you,
      // but good practice to include cleanup logic if you're using other libraries for requests.
    };
  }, []);

  const memoizedOptions = useMemo(
    () => ({
      tehsilOptions,
      districtOptions,
      divisionOptions,
      provinceOptions,
      hospitalOptions,
    }),
    [
      tehsilOptions,
      districtOptions,
      divisionOptions,
      provinceOptions,
      hospitalOptions,
    ]
  );

  return (
    <>
      <OverlayLoader loading={fetching}>
        <MainCard>
          <Typography variant="h3" sx={{ marginBottom: 2 }}>
            Manage Account
          </Typography>
          <Grid
            item
            md={8}
            sx={{ display: { sm: "none", md: "block", lg: "none" } }}
          />
          <AccountTable userData={userData} {...memoizedOptions} />
        </MainCard>
      </OverlayLoader>
    </>
  );
};

export default ManageAccount;
