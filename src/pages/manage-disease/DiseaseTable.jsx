/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { Box, Button, lighten } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import axios from "axios";
import EditDiseaseDialog from "./EditDiseaseDialog";
import DeleteConfirmation from "@components/DeleteConfirmation";
import AddDiseaseDialog from "./AddDiseaseDialog";
import { formatDate } from "@utility";
const DiseaseTable = () => {
  const [diseaseData, setDiseaseData] = useState([]);
  const [deleteDiseaseId, setDeleteDiseaseId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDiseaseDialogOpen, setIsAddDiseaseDialogOpen] = useState(false);
  const [isEditDiseaseDialogOpen, setIsEditDiseaseDialogOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const handleDeleteDisease = (diseaseId) => {
    setDeleteDiseaseId(diseaseId);
    setIsDeleteDialogOpen(true);
  };

  const toggleDeleteDialog = () => {
    setIsDeleteDialogOpen((prevOpen) => !prevOpen);
    if (!isDeleteDialogOpen) {
      setDeleteDiseaseId(null);
    }
  };

  const deleteDiseaseFromServer = async () => {
    try {
      if (deleteDiseaseId) {
        await axios.delete(
          `${
            import.meta.env.VITE_REACT_APP_BASEURL
          }/disease/delete/${deleteDiseaseId}`
        );
        fetchDiseaseData();
      }
    } catch (error) {
      console.error("Error deleting disease:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteDiseaseId(null);
    }
  };

  const fetchDiseaseData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASEURL}/disease/get`
      );
      setDiseaseData(response.data);
    } catch (error) {
      console.error("Error fetching disease data:", error);
    }
  };

  useEffect(() => {
    if (diseaseData.length == 0) {
      fetchDiseaseData();
    }
  }, [diseaseData]);
  const toggleEditDiseaseDialog = (disease) => {
    setSelectedDisease(disease);
    setIsEditDiseaseDialogOpen((prevOpen) => !prevOpen);
  };

  const handleAddDiseaseDialog = () => {
    setIsAddDiseaseDialogOpen(true);
  };

  const handleAddDiseaseDialogClose = () => {
    setIsAddDiseaseDialogOpen(false);
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
            id: "description",
            accessorKey: "description",
            header: "Description",
            size: 200,
          },
          {
            id: "symptoms",
            accessorKey: "symptoms",
            header: "Symptoms",
            size: 200,
          },
          {
            id: "causes",
            accessorKey: "causes",
            header: "Causes",
            size: 200,
          },
          {
            accessorFn: (row) =>
              row.createdOn ? formatDate(row.createdOn) : "Not Created",
            id: "createdOn",
            header: "Created On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.createdOn
                ? formatDate(cell.row.original.createdOn)
                : "Not Created",
          },

          {
            accessorFn: (row) =>
              row.updatedOn ? formatDate(row.updatedOn) : "Not Updated",
            id: "updatedOn",
            header: "Updated On",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) =>
              cell.row.original.updatedOn
                ? formatDate(cell.row.original.updatedOn)
                : "Not Updated",
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
                  onClick={() => toggleEditDiseaseDialog(row.original)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteDisease(row.original.id)}
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
    data: diseaseData,
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
              <Button variant="contained" onClick={handleAddDiseaseDialog}>
                Add Disease
              </Button>
            </Box>
            <AddDiseaseDialog
              open={isAddDiseaseDialogOpen}
              onClose={handleAddDiseaseDialogClose}
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
        onDelete={deleteDiseaseFromServer}
      />
      {isEditDiseaseDialogOpen && selectedDisease && (
        <EditDiseaseDialog
          open={isEditDiseaseDialogOpen}
          onClose={() => setIsEditDiseaseDialogOpen(false)}
          disease={selectedDisease}
          refresh={fetchDiseaseData}
        />
      )}
    </LocalizationProvider>
  );
};

export default DiseaseTable;
