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
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditUserDialog from "./EditUserDialog";
import AddUserDialog from "./AddUserDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverlayLoader";

const AccountTable = () => {
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
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
      const fetchURL = new URL("http://localhost:8080/user/get");
      const response = await axios.get(fetchURL.href);

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });
  const [initialize, setInitialize] = useState(false);

  // Function to toggle full screen - just for reference, you might not need it
  function handleClick() {
    var header = document.querySelector("header");

    var computedStyle = window.getComputedStyle(header);
    if (computedStyle.display === "flex") {
      header.style.display = "none";
    } else {
      header.style.display = "flex";
    }
  }

  // Function to initialize button - just for reference, you might not need it
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

  const handleDeleteAccount = (accountId) => {
    setDeleteAccountId(accountId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteAccountId(null);
    }
  };

  const deleteAccountFromServer = async () => {
    try {
      if (deleteAccountId) {
        await axios.delete(
          `http://localhost:8080/account/delete/${deleteAccountId}` // Change to account API endpoint
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteAccountId(null);
    }
  };

  const toggleEditUserDialog = (account) => {
    setSelectedAccount(account);
    setIsEditUserDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddUserDialog = () => {
    setIsAddUserDialogOpen((prevOpen) => !prevOpen);
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
        size: 200,
        Cell: ({ row }) => (
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
              onClick={() => handleDeleteAccount(row.original.id)}
            >
              Delete
            </Button>
          </Box>
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
      <>
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
              startIcon={<PersonAddIcon sx={{ fontSize: "0.5rem" }} />}
              variant="contained"
              onClick={toggleAddUserDialog}
            >
              Add User
            </Button>
          </Box>
          <Box>
            <Tooltip arrow title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </>
    ),
    rowCount: 30,
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
          <OverLayLoader loading={isLoading} />
          <AddUserDialog
            open={isAddUserDialogOpen}
            onClose={toggleAddUserDialog}
            refresh={refetch}
          />
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteAccountFromServer}
          />
          {isEditUserDialogOpen && selectedAccount && (
            <EditUserDialog
              open={isEditUserDialogOpen}
              onClose={() => setIsEditUserDialogOpen(false)}
              account={selectedAccount}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default AccountTable;
