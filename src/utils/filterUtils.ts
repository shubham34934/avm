// Types for filter operations
export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'doesNotContain' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterThanOrEqual' 
  | 'lessThanOrEqual' 
  | 'specified' 
  | 'in' 
  | 'notIn';

export type FilterValue = string | number | boolean | string[] | number[] | boolean[] | Date | null | undefined;

export interface FilterField {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}

export interface FilterOptions {
  page?: number;
  size?: number;
  sort?: string | string[];
  distinct?: boolean;
  filters?: FilterField[];
}

// Helper function to convert filter field to query parameter
const createFilterQueryParam = (field: string, operator: FilterOperator, value: FilterValue): string => {
  if (value === null || value === undefined) return '';
  
  // Handle array values
  if (Array.isArray(value)) {
    return value.map(v => `${field}.${operator}=${encodeURIComponent(String(v))}`).join('&');
  }
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    return `${field}.${operator}=${value}`;
  }
  
  // Handle date values
  if (value instanceof Date) {
    return `${field}.${operator}=${value.toISOString()}`;
  }
  
  // Handle string and number values
  return `${field}.${operator}=${encodeURIComponent(String(value))}`;
};

// Main function to generate query parameters
export const generateFilterQuery = (options: FilterOptions): string => {
  const queryParams: string[] = [];

  // Add pagination
  if (options.page !== undefined) {
    queryParams.push(`page=${options.page}`);
  }
  if (options.size !== undefined) {
    queryParams.push(`size=${options.size}`);
  }

  // Add sorting
  if (options.sort) {
    if (Array.isArray(options.sort)) {
      options.sort.forEach(sort => {
        queryParams.push(`sort=${encodeURIComponent(sort)}`);
      });
    } else {
      queryParams.push(`sort=${encodeURIComponent(options.sort)}`);
    }
  }

  // Add distinct flag
  if (options.distinct) {
    queryParams.push('distinct=true');
  }

  // Add filters
  if (options.filters && options.filters.length > 0) {
    options.filters.forEach(filter => {
      const queryParam = createFilterQueryParam(filter.field, filter.operator, filter.value);
      if (queryParam) {
        queryParams.push(queryParam);
      }
    });
  }

  return queryParams.join('&');
};

// Helper function to create a filter field
export const createFilter = (field: string, operator: FilterOperator, value: FilterValue): FilterField => ({
  field,
  operator,
  value,
});

// Example usage:
/*
const filters: FilterOptions = {
  page: 0,
  size: 20,
  sort: ['id,desc', 'createdOn,asc'],
  distinct: true,
  filters: [
    createFilter('title', 'contains', 'search term'),
    createFilter('isActive', 'equals', true),
    createFilter('createdOn', 'greaterThan', new Date('2024-01-01')),
    createFilter('tags', 'in', ['tag1', 'tag2']),
  ],
};

const queryString = generateFilterQuery(filters);
// Result: page=0&size=20&sort=id,desc&sort=createdOn,asc&distinct=true&title.contains=search%20term&isActive.equals=true&createdOn.greaterThan=2024-01-01T00:00:00.000Z&tags.in=tag1&tags.in=tag2
*/ 