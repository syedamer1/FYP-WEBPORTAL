/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddUserDialog from "./AddUserDialog";
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
const DataColumns = () => {
  const [AddUserOpen, setAddUserOpen] = useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);
  const handledDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handledDeleteClose = () => {
    setDeleteOpen(false);
  };
  const handleAddUser = () => {
    setAddUserOpen(true);
  };
  const handleAddUserClose = () => {
    setAddUserOpen(false);
  };
  const columns = useMemo(
    () => [
      {
        id: "user",
        header: "",
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: "name",
            header: "Name",
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "email",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Email",
            size: 300,
          },
          {
            accessorKey: "userType",
            header: "User Type",
            size: 150,
          },
          {
            accessorKey: "contact",
            header: "Contact",
            size: 200,
          },
          {
            accessorKey: "password",
            header: "Password",
            size: 200,
            enableColumnFilter: false,
            enableSorting: false,
          },
          {
            accessorKey: "cnic",
            header: "CNIC",
            size: 200,
          },
          {
            accessorKey: "address",
            header: "Address",
            size: 200,
          },
          {
            accessorFn: (row) => new Date(row.created_at),
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
            accessorFn: (row) => new Date(row.updated_at),
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
                  onClick={() => {}}
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
                startIcon={<PersonAddIcon sx={{ fontSize: "0.5rem" }} />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Box>
            <AddUserDialog open={AddUserOpen} onClose={handleAddUserClose} />
          </Box>
        </Box>
      );
    },
  });

  return (
    <>
      <DeleteConfirmation
        open={DeleteOpen}
        onClose={handledDeleteClose}
        onDelete={handledDeleteClose}
      />
      <MaterialReactTable table={table} />
    </>
  );
};

const AccountTable = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataColumns />
    </LocalizationProvider>
  );
};

export default AccountTable;
