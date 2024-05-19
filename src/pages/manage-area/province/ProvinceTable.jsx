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
import EditProvinceDialog from "./EditProvinceDialog";
import AddProvinceDialog from "./AddProvinceDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import OverLayLoader from "@components/OverLayLoader";
const ProvinceTable = () => {
  const [deleteProvinceId, setDeleteProvinceId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddProvinceDialogOpen, setIsAddProvinceDialogOpen] = useState(false);
  const [isEditProvinceDialogOpen, setIsEditProvinceDialogOpen] =
    useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
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
      const fetchURL = new URL("http://localhost:8080/province/get");

      const response = await axios.get(fetchURL.href);

      return {
        data: response.data,
        meta: response.meta,
      };
    },
    placeholderData: keepPreviousData,
  });

  const [initialize, setInitialize] = useState(false);
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
    if (!initialize) {
      setTimeout(() => {
        initializeButton();
      }, 2000);
      setInitialize(true);
    }
  }, []);

  const handleDeleteProvince = (provinceId) => {
    setDeleteProvinceId(provinceId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteProvinceId(null);
    }
  };

  const deleteProvinceFromServer = async () => {
    try {
      if (deleteProvinceId) {
        await axios.delete(
          `http://localhost:8080/province/delete/${deleteProvinceId}`
        );
        refetch();
      }
    } catch (error) {
      console.error("Error deleting province:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteProvinceId(null);
    }
  };

  const toggleEditProvinceDialog = (province) => {
    setSelectedProvince(province);
    setIsEditProvinceDialogOpen((prevOpen) => !prevOpen);
  };

  const toggleAddProvinceDialog = () => {
    setIsAddProvinceDialogOpen((prevOpen) => !prevOpen);
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
            id: "created_on",
            accessorFn: (row) => new Date(row.created_on),
            header: "Created On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
          },
          {
            id: "updated_on",
            accessorFn: (row) =>
              row.updated_on == "null" ? "Not Updated" : row.updated_on,
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
                  onClick={() => toggleEditProvinceDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteProvince(row.original.id)}
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
              onClick={toggleAddProvinceDialog}
            >
              Add Province
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
          <AddProvinceDialog
            open={isAddProvinceDialogOpen}
            onClose={toggleAddProvinceDialog}
            refresh={refetch}
          />
          <DeleteConfirmation
            open={isDeleteDialogOpen}
            onClose={toggleDeleteDialog}
            onDelete={deleteProvinceFromServer}
          />
          {isEditProvinceDialogOpen && selectedProvince && (
            <EditProvinceDialog
              open={isEditProvinceDialogOpen}
              onClose={() => setIsEditProvinceDialogOpen(false)}
              province={selectedProvince}
              refresh={refetch}
            />
          )}
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default ProvinceTable;
