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
import EditDistrictDialog from "./EditDistrictDialog.jsx"; // Assuming you have an EditDistrictDialog component
import AddDistrictDialog from "./AddDistrictDialog.jsx"; // Assuming you have an AddDistrictDialog component
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverlayLoader";
const DistrictTable = () => {
  const [deleteDistrictId, setDeleteDistrictId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDistrictDialogOpen, setIsAddDistrictDialogOpen] = useState(false);
  const [isEditDistrictDialogOpen, setIsEditDistrictDialogOpen] =
    useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
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
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/district/get"
      );

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });

  const handleDeleteDistrict = (districtId) => {
    setDeleteDistrictId(districtId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteDistrictId(null);
    }
  };

  const deleteDistrictFromServer = async () => {
    try {
      if (deleteDistrictId) {
        await axios.delete(
          import.meta.env.VITE_REACT_APP_BASEURL +
            "/district/delete/" +
            deleteDistrictId
        );
        console.log("District deleted");
        refetch();
      }
    } catch (error) {
      console.error("Error deleting district:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDistrictId(null);
    }
  };

  const toggleEditDistrictDialog = (district) => {
    setSelectedDistrict(district);
    setIsEditDistrictDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddDistrictDialog = () => {
    setIsAddDistrictDialogOpen((prevOpen) => !prevOpen);
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
            id: "division.name",
            accessorFn: (row) => row.division.name, // Assuming district has a division attribute
            header: "Division Name",
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
              row.updatedOn === "null" ? "Not Updated" : row.updatedOn,
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
                  onClick={() => toggleEditDistrictDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteDistrict(row.original.id)}
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
              onClick={toggleAddDistrictDialog}
            >
              Add District
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
      showLoadingOverlay: false,
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
            onDelete={deleteDistrictFromServer}
          />
          <AddDistrictDialog
            open={isAddDistrictDialogOpen}
            onClose={toggleAddDistrictDialog}
            refresh={refetch}
          />
          {isEditDistrictDialogOpen && selectedDistrict && (
            <EditDistrictDialog
              open={isEditDistrictDialogOpen}
              onClose={() => setIsEditDistrictDialogOpen(false)}
              district={selectedDistrict}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default DistrictTable;
