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
  AddLocation as AddLocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import EditTehsilDialog from "./EditTehsilDialog.jsx"; // Assuming you have an EditTehsilDialog component
import AddTehsilDialog from "./AddTehsilDialog.jsx"; // Assuming you have an AddTehsilDialog component
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverLayLoader";

const TehsilTable = () => {
  const [deleteTehsilId, setDeleteTehsilId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddTehsilDialogOpen, setIsAddTehsilDialogOpen] = useState(false);
  const [isEditTehsilDialogOpen, setIsEditTehsilDialogOpen] = useState(false);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: { data = [], meta } = {},
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
      const response = await axios.get("http://localhost:8080/tehsil/get"); // Updated API endpoint

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });

  const handleDeleteTehsil = (tehsilId) => {
    setDeleteTehsilId(tehsilId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteTehsilId(null);
    }
  };

  const deleteTehsilFromServer = async () => {
    try {
      if (deleteTehsilId) {
        await axios.delete(
          `http://localhost:8080/tehsil/delete/${deleteTehsilId}` // Updated API endpoint
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting tehsil:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteTehsilId(null);
    }
  };

  const toggleEditTehsilDialog = (tehsil) => {
    setSelectedTehsil(tehsil);
    setIsEditTehsilDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddTehsilDialog = () => {
    setIsAddTehsilDialogOpen((prevOpen) => !prevOpen);
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
            id: "district.name",
            accessorFn: (row) => row.district.name, // Assuming tehsil has a district attribute
            header: "District Name",
            size: 150,
          },
          {
            accessorFn: (row) => new Date(row.createdOn),
            id: "createdOn",
            header: "Created On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
          },
          {
            accessorFn: (row) =>
              row.updatedOn === "null" ? "Not Updated" : row.updatedOn, // Assuming tehsil has updatedOn attribute
            id: "updatedOn",
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
                  onClick={() => toggleEditTehsilDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteTehsil(row.original.id)}
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
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
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
              startIcon={<AddLocationIcon sx={{ fontSize: "0.5rem" }} />}
              variant="contained"
              onClick={toggleAddTehsilDialog}
            >
              Add Tehsil
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
    rowCount: 500,
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
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteTehsilFromServer}
          />
          <AddTehsilDialog
            open={isAddTehsilDialogOpen}
            onClose={toggleAddTehsilDialog}
            refresh={refetch}
          />
          {isEditTehsilDialogOpen && selectedTehsil && (
            <EditTehsilDialog
              open={isEditTehsilDialogOpen}
              onClose={() => setIsEditTehsilDialogOpen(false)}
              tehsil={selectedTehsil}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default TehsilTable;
