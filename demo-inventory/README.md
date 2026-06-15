# Demo Inventory Sheets

Sample inventory data for each of the three target industries. Customers can:

- **Reference** these files to see the expected column structure
- **Upload** them directly to the Inventory page as starter data
- **Edit** the columns to match their own catalog before uploading

All sample data is set in a Pakistani business context (DHA, Bahria Town, Lahore clinics, etc.) to feel realistic for our target market.

## Files

| File | Industry | Purpose |
|---|---|---|
| `real-estate.csv` | Real Estate | Property listings — houses, apartments, plots for sale and rent |
| `ecommerce.csv` | E-commerce | Product catalog — clothing, accessories, electronics with sizes and stock |
| `healthcare.csv` | Healthcare | Service offerings — consultations, treatments, packages with pricing |

## Schema

### `real-estate.csv`
| Column | Type | Example |
|---|---|---|
| `id` | string | `RE-001` |
| `title` | string | `3 Bed House in DHA Phase 6` |
| `type` | enum | `house` / `apartment` / `plot` / `commercial` |
| `purpose` | enum | `buy` / `rent` |
| `bedrooms` | integer | `3` |
| `bathrooms` | integer | `4` |
| `area_size` | string | `10 marla` / `2400 sqft` |
| `area_location` | string | `DHA Phase 6` |
| `city` | string | `Lahore` |
| `price_pkr` | integer | `15000000` (1.5 crore) |
| `status` | enum | `available` / `under_offer` / `sold` |
| `description` | string | Short marketing line |

### `ecommerce.csv`
| Column | Type | Example |
|---|---|---|
| `sku` | string | `HD-BLK-M` |
| `name` | string | `Black Hoodie` |
| `category` | string | `Hoodies` |
| `variants` | string | `S,M,L,XL` (comma-separated) |
| `colors` | string | `Black,Navy,Grey` |
| `price_pkr` | integer | `2499` |
| `stock` | integer | `12` |
| `status` | enum | `in_stock` / `low_stock` / `out_of_stock` |
| `description` | string | Short product description |

### `healthcare.csv`
| Column | Type | Example |
|---|---|---|
| `id` | string | `SVC-001` |
| `service` | string | `Skin Consultation` |
| `category` | string | `Dermatology` |
| `duration_minutes` | integer | `30` |
| `price_pkr` | integer | `3000` |
| `practitioner` | string | `Dr. Sara Iqbal` |
| `requires_appointment` | boolean | `true` / `false` |
| `description` | string | Short service description |

## Notes

- Prices are in PKR (Pakistani Rupees) as integers — no commas, no currency symbol
- Boolean fields use lowercase `true` / `false`
- Enum fields use lowercase `snake_case`
- Empty cells are allowed for optional fields
- UTF-8 encoded; CRLF line endings (Windows-compatible)
