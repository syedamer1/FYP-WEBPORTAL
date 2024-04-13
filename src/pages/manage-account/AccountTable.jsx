/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
// React imports
import { useMemo, useState } from "react";
// Material-UI imports
import { Box, Button, lighten } from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// Material React Table imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

// Custom component imports
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
// Axios for making HTTP requests
import axios from "axios";

const AccountTable = ({
  userData,
  tehsilOptions,
  districtOptions,
  divisionOptions,
  provinceOptions,
  hospitalOptions,
}) => {
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    // Reset the deleteUserId when the dialog is closed
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
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: "Name",
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
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorFn: (row) =>
          row.updated_on == "null" ? "Not Updated" : row.updated_on,
        id: "updated_on",
        header: "Updated On",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
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
    data: userData,
    enableColumnFilterModes: true,
    enablePagination: true,
    enableColumnOrdering: true,
    enableGrouping: false,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: false,
    initialState: { showColumnFilters: true, showGlobalFilter: true },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          })}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon sx={{ fontSize: "0.5rem" }} />}
                onClick={handleAddUserDialog}
              >
                Add User
              </Button>
            </Box>
            <AddUserDialog
              open={isAddUserDialogOpen}
              onClose={handleAddUserDialogClose}
            />
          </Box>
        </Box>
      );
    },
  });
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
    </LocalizationProvider>
  );
};

export default AccountTable;
