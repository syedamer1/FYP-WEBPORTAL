/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  AddLocation as AddLocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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
import AddDivisionDialog from "./AddDivisonDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
const DataColumns = () => {
  const [AddDivisionOpen, setAddDivisionOpen] = useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);
  const handledDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handledDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleAddDivision = () => {
    setAddDivisionOpen(true);
  };
  const handleAddDivisionClose = () => {
    setAddDivisionOpen(false);
  };
  const columns = useMemo(
    () => [
      {
        id: "division",
        header: "",
        columns: [
          {
            id: "id",
            accessorKey: "id",
            header: "ID",
            size: 100,
          },
          {
            id: "name",
            accessorKey: "name",
            header: "Name",
            size: 300,
          },
          {
            id: "Province",
            accessorKey: "province_name",
            header: "Province Name",
            size: 300,
          },
          {
            accessorKey: "created_on",
            header: "Created On",
            size: 200,
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
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
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
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
            enableHiding: false,
            // eslint-disable-next-line no-unused-vars
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    console.log("EDIT");
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handledDeleteOpen}
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
                startIcon={<AddLocationIcon sx={{ fontSize: "0.5rem" }} />}
                onClick={handleAddDivision}
              >
                Add Division
              </Button>
              <AddDivisionDialog
                open={AddDivisionOpen}
                onClose={handleAddDivisionClose}
              />
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />{" "}
      <DeleteConfirmation
        open={DeleteOpen}
        onClose={handledDeleteClose}
        onDelete={handledDeleteClose}
      />
    </>
  );
};

const DivisionTable = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataColumns />
    </LocalizationProvider>
  );
};

export default DivisionTable;
