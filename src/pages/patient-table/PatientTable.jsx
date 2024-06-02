/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import OverLayLoader from "@components/OverlayLoader";
import { formatDate } from "@utility";
const PatientTable = ({ hospitalId = null }) => {
  const [deletePatientId, setDeletePatientId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    // eslint-disable-next-line no-unused-vars
    data: { data = [], meta } = {}, // Initialize data as an empty array
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table-data",
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let fetchURL;
      if (hospitalId) {
        fetchURL = new URL(
          `${
            import.meta.env.VITE_REACT_APP_BASEURL
          }/patient/getPatientsByHospitalId/${hospitalId}`
        );
      } else {
        fetchURL = new URL();
        `${import.meta.env.VITE_REACT_APP_BASEURL}/patient/get`;
      }

      // fetchURL.searchParams.set(
      //   "start",
      //   `${pagination.pageIndex * pagination.pageSize}`
      // );
      // fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      // fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      // fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      // fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      const response = await axios.get(fetchURL.href);

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });
  const [initialize, setInitialize] = useState(false);
  function handleClick() {
    var header = document.querySelector("header");

    var computedStyle = window.getComputedStyle(header);
    if (computedStyle.display === "flex") {
      header.style.display = "none";
    } else {
      header.style.display = "flex";
    }
  }

  function initializeButton() {
    var button = document.querySelector(
      'button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-riw2ar-MuiButtonBase-root-MuiIconButton-root[aria-label="Toggle full screen"]'
    );

    var header = document.querySelector("header");
    header.style.display = "flex";

    button.addEventListener("click", handleClick);
  }

  useEffect(() => {
    if (!initialize) {
      setTimeout(() => {
        initializeButton();
      }, 2000);
      setInitialize(true);
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "table",
        header: "",
        columns: [
          {
            id: "id",
            accessorKey: "id",
            header: "ID",
            size: 150,
          },
          {
            id: "firstName",
            accessorKey: "firstName",
            header: "First Name",
            size: 150,
          },
          {
            id: "lastName",
            accessorKey: "lastName",
            header: "Last Name",
            size: 150,
          },
          {
            id: "cnic",
            accessorKey: "cnic",
            header: "CNIC",
            size: 150,
          },
          {
            id: "gender",
            accessorKey: "gender",
            header: "Gender",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() === "1" ? "Male" : "Female"),
          },
          {
            id: "age",
            accessorKey: "age",
            header: "Age",
            size: 150,
          },
          {
            id: "admissionDate",
            accessorKey: "admissionDate",
            header: "Admission Date",
            size: 150,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
          },
          {
            id: "deathBinary",
            accessorKey: "deathBinary",
            header: "Death",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "hospitalName",
            accessorFn: (row) => (row.hospital ? row.hospital.name : ""),
            header: "Hospital Name",
            size: 150,
          },
          {
            id: "diseaseName",
            accessorFn: (row) => (row.disease ? row.disease.name : ""),
            header: "Disease Name",
            size: 150,
          },
          {
            id: "blood",
            accessorKey: "blood",
            header: "Blood",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "chronicdisease",
            accessorKey: "chronicdisease",
            header: "Chronic Disease",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "diabetes",
            accessorKey: "diabetes",
            header: "Diabetes",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "highFever",
            accessorKey: "highFever",
            header: "High Fever",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "fever",
            accessorKey: "fever",
            header: "Fever",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "hypertension",
            accessorKey: "hypertension",
            header: "Hypertension",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "cardiac",
            accessorKey: "cardiac",
            header: "Cardiac",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "weaknessPain",
            accessorKey: "weaknessPain",
            header: "Weakness Pain",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "respiratory",
            accessorKey: "respiratory",
            header: "Respiratory",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "cancer",
            accessorKey: "cancer",
            header: "Cancer",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "thyroid",
            accessorKey: "thyroid",
            header: "Thyroid",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "prostate",
            accessorKey: "prostate",
            header: "Prostate",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "kidney",
            accessorKey: "kidney",
            header: "Kidney",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "neuro",
            accessorKey: "neuro",
            header: "Neuro",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "nausea",
            accessorKey: "nausea",
            header: "Nausea",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "asymptomatic",
            accessorKey: "asymptomatic",
            header: "Asymptomatic",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "gastrointestinal",
            accessorKey: "gastrointestinal",
            header: "Gastrointestinal",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "ortho",
            accessorKey: "ortho",
            header: "Ortho",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "respiratoryCD",
            accessorKey: "respiratoryCD",
            header: "Respiratory CD",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "cardiacsCD",
            accessorKey: "cardiacsCD",
            header: "Cardiacs CD",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            id: "kidneyCD",
            accessorKey: "kidneyCD",
            header: "Kidney CD",
            size: 150,
            Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
          },
          {
            accessorFn: (row) =>
              row.createdOn ? formatDate(row.createdOn) : "Not Created",
            id: "createdOn",
            header: "Created On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.createdOn
                ? formatDate(cell.row.original.createdOn)
                : "Not Created",
          },
          {
            accessorFn: (row) =>
              row.updatedOn ? formatDate(row.updatedOn) : "Not Updated",
            id: "updatedOn",
            header: "Updated On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.updatedOn
                ? formatDate(cell.row.original.updatedOn)
                : "Not Updated",
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <>
        <Box>
          <Tooltip arrow title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </>
    ),
    rowCount: 10,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: false,
      showProgressBars: isRefetching,
      sorting,
      showLoadingOverlay: false,
    },
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ marginTop: "30px" }}>
          <MaterialReactTable table={table} />
          <OverLayLoader loading={isLoading} />
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default PatientTable;
