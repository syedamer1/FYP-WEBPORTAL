/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  LocalHospital as LocalHospitalIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddHospitalDialog from "./AddHospitalDialog";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, Button, lighten } from "@mui/material";
import { data } from "./makedata";
import DeleteConfirmation from "@components/DeleteConfirmation";
import EditHospitalDialog from "./EditHospitalDialog";
const DataColumns = () => {
  const [AddHospitalOpen, setAddHospitalOpen] = useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);
  const [EditOpen, setEditOpen] = useState(false);
  const toggleDeleteOpen = () => {
    setDeleteOpen(!DeleteOpen);
  };
  const toggleEditOpen = () => {
    setEditOpen(!EditOpen);
  };

  const toggleAddHospitalOpen = () => {
    setAddHospitalOpen(!AddHospitalOpen);
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
            accessorKey: "code ",
            header: "Code",
            size: 150,
          },
          {
            id: "hospital_type",
            accessorKey: "hospital_type",
            header: "Hospital Type",
            size: 150,
          },
          {
            id: "tehsil_name",
            accessorKey: "tehsil_name",
            header: "Tehsil Name",
            size: 150,
          },
          {
            accessorKey: "created_on",
            header: "Created On",
            size: 200,
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
            accessorKey: "updated_on",
            header: "Updated On",
            size: 200,
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
            // eslint-disable-next-line no-unused-vars
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={toggleEditOpen}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={toggleDeleteOpen}
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
    data,
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
              <Button
                variant="contained"
                startIcon={<LocalHospitalIcon sx={{ fontSize: "0.5rem" }} />}
                onClick={toggleAddHospitalOpen}
              >
                Add Hospital
              </Button>
            </Box>
            <AddHospitalDialog
              open={AddHospitalOpen}
              onClose={toggleAddHospitalOpen}
            />
          </Box>
        </Box>
      );
    },
  });

  return (
    <>
      <DeleteConfirmation
        open={DeleteOpen}
        onClose={toggleDeleteOpen}
        onDelete={toggleDeleteOpen}
      />
      <EditHospitalDialog open={EditOpen} onClose={toggleEditOpen} />
      <MaterialReactTable table={table} />
    </>
  );
};

const HospitalTable = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataColumns />
    </LocalizationProvider>
  );
};

export default HospitalTable;
