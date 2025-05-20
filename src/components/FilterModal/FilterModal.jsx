import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterModal = ({ schema = [], initialValues = {}, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Initialize filters when schema or initialValues change
  useEffect(() => {
    const defaults = {};
    schema.forEach((field) => {
      defaults[field.key] = initialValues[field.key] ?? "";
    });
    setFilters(defaults);
  }, [schema, initialValues]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    // Reset all filters to empty string
    const cleared = {};
    schema.forEach((field) => {
      cleared[field.key] = "";
    });
    setFilters(cleared);
    if (onClear) {
      onClear();
    }
  };

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} color="primary">
        <FilterListIcon />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {schema.map((field) => {
              const value = filters[field.key] ?? "";

              if (field.type === "select") {
                return (
                  <FormControl fullWidth key={field.key}>
                    <InputLabel id={`${field.key}-label`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`${field.key}-label`}
                      id={`${field.key}-select`}
                      value={value}
                      label={field.label}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              if (field.type === "boolean") {
                return (
                  <FormControlLabel
                    key={field.key}
                    control={
                      <Checkbox
                        checked={value === true}
                        onChange={(e) => handleChange(field.key, e.target.checked)}
                      />
                    }
                    label={field.label}
                  />
                );
              }

              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  type={field.type}
                  fullWidth
                  value={value}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : undefined
                  }
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear} color="inherit">
            Clear
          </Button>
          <Button onClick={() => setIsOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterModal;
