/* eslint-disable react/prop-types */
import EditProvinceDialog from "./EditProvinceDialog";
import { useMemo, useState, useEffect } from "react";
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
import AddProvinceDialog from "./AddProvinceDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import axios from "axios";

const DataColumns = () => {
  const [AddProvinceOpen, setAddProvinceOpen] = useState(false);
  const [EditOpen, setEditOpen] = useState(false);
  const [deleteProvinceId, setDeleteProvinceId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [provinceData, setProvinceData] = useState([]);

  const toggleEditOpen = () => {
    setEditOpen(!EditOpen);
  };

  const toggleAddProvinceOpen = () => {
    setAddProvinceOpen(!AddProvinceOpen);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
  };

  const deleteProvince = async (provinceId) => {
    try {
      await axios.delete(`http://localhost:8080/province/delete/${provinceId}`);
      console.log("Province deleted");
      setDeleteProvinceId(null);
      setIsDeleteDialogOpen(false);
      fetchProvinceData(); // Refresh the data after successful deletion
    } catch (error) {
      console.error("Error deleting province:", error);
    }
  };

  const fetchProvinceData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/province/get");
      setProvinceData(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  useEffect(() => {
    fetchProvinceData();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "province",
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
            enableHiding: false,
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
                  onClick={() => {
                    setDeleteProvinceId(row.original.id);
                    setIsDeleteDialogOpen(true);
                  }}
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
    data: provinceData,
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
                onClick={toggleAddProvinceOpen}
              >
                Add Province
              </Button>
              <AddProvinceDialog
                open={AddProvinceOpen}
                onClose={toggleAddProvinceOpen}
              />
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onClose={toggleDeleteDialog}
        onDelete={() => deleteProvince(deleteProvinceId)}
      />
      <EditProvinceDialog open={EditOpen} onClose={toggleEditOpen} />
    </>
  );
};

const ProvinceTable = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DataColumns />
    </LocalizationProvider>
  );
};

export default ProvinceTable;
