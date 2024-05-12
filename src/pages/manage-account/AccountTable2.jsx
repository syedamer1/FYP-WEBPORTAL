/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip, lighten } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Custom component imports
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
// Axios for making HTTP requests
import axios from "axios";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const AccountTable = (
  tehsilOptions,
  districtOptions,
  divisionOptions,
  provinceOptions,
  hospitalOptions
) => {
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
    setTimeout(() => {
      initializeButton();
    }, 2000);
  }, []);

  // Call initializeButton function after a delay

  //consider storing this code in a custom hook (i.e useFetchUsers)
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
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL("http://localhost:8080/user/get-table-data");

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await axios.get(fetchURL.href);
      console.log("Response Data:", response.data);
      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });
  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteUserId(null);
    }
  };

  const deleteUserFromServer = async () => {
    try {
      if (deleteUserId) {
        await axios.delete(`http://localhost:8080/user/delete/${deleteUserId}`);
        console.log("User deleted");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const toggleEditUserDialog = (user) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen((prevOpen) => !prevOpen);
  };

  const handleAddUserDialog = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleAddUserDialogClose = () => {
    setIsAddUserDialogOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "firstName",
        header: "First Name",
        size: 200,
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        size: 200,
      },
      {
        accessorKey: "usertype",
        header: "User Type",
        size: 150,
      },
      {
        accessorKey: "contact",
        header: "Contact",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "password",
        header: "Password",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.province != null ? row.province.name : "No Province",
        id: "province_name",
        header: "Province Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.division != null ? row.division.name : "No Division",
        id: "division_name",
        header: "Division Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.district != null ? row.district.name : "No District",
        id: "district_name",
        header: "District Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.tehsil != null ? row.tehsil.name : "No Tehsil",
        id: "tehsil_name",
        header: "Tehsil Name",
        size: 150,
      },
      {
        accessorFn: (row) =>
          row.hospital != null ? row.hospital.name : "No Hospital",
        id: "hospital_name",
        header: "Hospital Name",
        size: 150,
      },
      {
        accessorFn: (row) => new Date(row.created_on),
        id: "created_on",
        header: "Created On",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        accessorFn: (row) =>
          row.updated_on == "null" ? "Not Updated" : row.updated_on,
        id: "updated_on",
        header: "Updated On",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        size: 300,
        Cell: ({ row }) => (
          <>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => toggleEditUserDialog(row.original)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteUser(row.original.id)}
              >
                Delete
              </Button>
            </Box>
          </>
        ),
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          marginLeft: 1,
        }}
      >
        <Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon sx={{ fontSize: "0.5rem" }} />}
            onClick={handleAddUserDialog}
          >
            Add User
          </Button>
          <AddUserDialog
            open={isAddUserDialogOpen}
            onClose={handleAddUserDialogClose}
          />
        </Box>

        <Box>
          <Tooltip arrow title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    ),
    rowCount: 48,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: false,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ marginTop: "30px" }}>
          <MaterialReactTable table={table} />
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteUserFromServer}
          />
          {isEditUserDialogOpen && selectedUser && (
            <EditUserDialog
              open={isEditUserDialogOpen}
              onClose={() => setIsEditUserDialogOpen(false)}
              userData={selectedUser}
              tehsilOptions={tehsilOptions}
              districtOptions={districtOptions}
              divisionOptions={divisionOptions}
              provinceOptions={provinceOptions}
              hospitalOptions={hospitalOptions}
            />
          )}
          <AddUserDialog
            open={isAddUserDialogOpen}
            onClose={handleAddUserDialogClose}
            tehsilOptions={tehsilOptions}
            districtOptions={districtOptions}
            divisionOptions={divisionOptions}
            provinceOptions={provinceOptions}
            hospitalOptions={hospitalOptions}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AccountTable;
