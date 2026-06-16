# Demo Inventory Sheets

Sample inventory data for the three target industries. Customers can:

- **Reference** these files to see the expected column structure
- **Upload** them directly to the Inventory page as starter data
- **Edit** the columns to match their own catalog before uploading

Most samples are set in a Pakistani business context (DHA, Bahria Town,
Lahore clinics, etc.). One USD/international demo is included for
international tenants. Prices are integers in your tenant's currency —
set it under Settings → Business currency.

## Files

| File | Industry | Currency | Purpose |
|---|---|---|---|
| `real-estate.csv` | Real Estate | PKR | Property listings — houses, apartments, plots for sale and rent |
| `ecommerce.csv` | E-commerce | PKR | Product catalog — clothing, accessories with sizes and stock |
| `healthcare.csv` | Healthcare | PKR | Service offerings — consultations, treatments, packages |
| `us-ecommerce.csv` | E-commerce | USD | International apparel store — prices in USD, sizes 8–XXL |

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

- Use `price` as the column header (integer in your tenant's currency — no commas, no symbol)
- The CSV uploader also accepts legacy `price_pkr` and `price_usd` headers as aliases — both are stored in the same `price` column on the server
- Boolean fields use lowercase `true` / `false`
- Enum fields use lowercase `snake_case`
- Empty cells are allowed for optional fields
- UTF-8 encoded; CRLF line endings (Windows-compatible)
