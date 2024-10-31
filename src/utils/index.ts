import { FilterState } from '../pages/Home';

// Update URL and fetch when filters change
const handleApplyFilters = (
	tempFilters: FilterState,
	currentPage: number,
	navigate: (path: string) => void,
	setFetchUrl: (url: string) => void,
	defaultApiUrl: string
) => {
	const params = new URLSearchParams();

	// Add filters to params if they exist
	if (tempFilters.name) params.append('name', tempFilters.name);
	if (tempFilters.status) params.append('status', tempFilters.status);

	// Only add page if it's not page 1
	if (currentPage > 1) {
		params.append('page', currentPage.toString());
	}

	// Create clean URL
	const queryString = params.toString();
	const newPath = queryString ? `/?${queryString}` : '/';

	navigate(newPath);
	setFetchUrl(`${defaultApiUrl}?${queryString}`);
};

// Handle page changes
const handlePageChange = (
	newUrl: string,
	tempFilters: FilterState,
	navigate: (path: string) => void,
	setFetchUrl: (url: string) => void
) => {
	const urlParams = new URLSearchParams(new URL(newUrl).search);
	const pageNumber = urlParams.get('page') || '1';

	// Create new URL params
	const params = new URLSearchParams();

	// Preserve existing filters
	if (tempFilters.name) params.append('name', tempFilters.name);
	if (tempFilters.status) params.append('status', tempFilters.status);

	// Only add page parameter if not page 1
	if (pageNumber !== '1') {
		params.append('page', pageNumber);
	}

	// Create clean URL
	const queryString = params.toString();
	const newPath = queryString ? `/?${queryString}` : '/';

	navigate(newPath);
	setFetchUrl(newUrl);
};

export { handleApplyFilters, handlePageChange };
