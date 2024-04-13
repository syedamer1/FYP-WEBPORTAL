/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
// React imports
import { useMemo, useState } from "react";
// Material-UI imports
import { Box, Button, lighten } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
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
import EditHospitalDialog from "./EditHospitalDialog";
import AddHospitalDialog from "./AddHospitalDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
// Axios for making HTTP requests
import axios from "axios";

const HospitalTable = ({ hospitalData, tehsilOptions }) => {
  const [deleteHospitalId, setDeleteHospitalId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddHospitalDialogOpen, setIsAddHospitalDialogOpen] = useState(false);
  const [isEditHospitalDialogOpen, setIsEditHospitalDialogOpen] =
    useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleDeleteHospital = (hospitalId) => {
    setDeleteHospitalId(hospitalId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    // Reset the deleteHospitalId when the dialog is closed
    if (!isDeleteDialogOpen) {
      setDeleteHospitalId(null);
    }
  };

  const deleteHospitalFromServer = async () => {
    try {
      if (deleteHospitalId) {
        await axios.delete(
          `http://localhost:8080/hospital/delete/${deleteHospitalId}`
        );
        console.log("Hospital deleted");
      }
    } catch (error) {
      console.error("Error deleting hospital:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteHospitalId(null);
    }
  };

  const toggleEditHospitalDialog = (hospital) => {
    setSelectedHospital(hospital);
    setIsEditHospitalDialogOpen((prevOpen) => !prevOpen);
  };

  const handleAddHospitalDialog = () => {
    setIsAddHospitalDialogOpen(true);
  };

  const handleAddHospitalDialogClose = () => {
    setIsAddHospitalDialogOpen(false);
  };

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
            id: "name",
            accessorKey: "name",
            header: "Name",
            size: 150,
          },
          {
            id: "code",
            accessorKey: "code",
            header: "Code",
            size: 150,
          },
          {
            id: "hospital_type",
            accessorKey: "hospitalType",
            header: "Hospital Type",
            size: 150,
          },
          {
            id: "tehsil_name",
            accessorFn: (row) =>
              row.tehsil != null ? row.tehsil.name : "No Tehsil",
            header: "Tehsil Name",
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
            size: 200,
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => toggleEditHospitalDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteHospital(row.original.id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: hospitalData,
    enableColumnFilterModes: true,
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
              <Button variant="contained" onClick={handleAddHospitalDialog}>
                Add Hospital
              </Button>
            </Box>
            <AddHospitalDialog
              open={isAddHospitalDialogOpen}
              onClose={handleAddHospitalDialogClose}
              tehsilOptions={tehsilOptions}
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
        onDelete={deleteHospitalFromServer}
      />
      {isEditHospitalDialogOpen && selectedHospital && (
        <EditHospitalDialog
          open={isEditHospitalDialogOpen}
          onClose={() => setIsEditHospitalDialogOpen(false)}
          hospital={selectedHospital}
          tehsilOptions={tehsilOptions}
        />
      )}
    </LocalizationProvider>
  );
};

export default HospitalTable;
