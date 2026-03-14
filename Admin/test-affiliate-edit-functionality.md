# Test Affiliate Edit Functionality

## Testing Steps

### 1. Navigate to Affiliate Detail Page
- Go to `/affiliates` in your admin panel
- Click "View" on any affiliate to open the detail page

### 2. Test Edit Mode
- Look for the "✏️ Edit" button in the Basic Information card header
- Click the Edit button
- Verify that:
  - Commission Rate field becomes an input with % suffix
  - Assigned To field becomes a text input
  - Edit button changes to "💾 Save" and "❌ Cancel" buttons

### 3. Test Commission Rate Input
- Try entering various values:
  - Valid: `10`, `15.5`, `0`, `100`
  - Invalid: `abc`, `10%`, `-5`, `150` (should be rejected or show validation)
- Verify only numeric values with optional decimal are accepted

### 4. Test Assigned To Input
- Enter a name or email: `John Doe`, `admin@company.com`
- Verify text input accepts normal text

### 5. Test Save Functionality
- Enter valid values in both fields
- Click "💾 Save" button
- Verify:
  - Success toast message appears
  - Edit mode exits automatically
  - New values are displayed in view mode
  - Page data refreshes to show updated values

### 6. Test Cancel Functionality
- Click "✏️ Edit" again
- Change some values
- Click "❌ Cancel"
- Verify:
  - Edit mode exits
  - Original values are restored (no changes saved)

### 7. Test Validation
- Enter invalid commission rate (e.g., `150` or `abc`)
- Click Save
- Verify error message appears and values are not saved

## Expected Database Updates

The following fields should be updated in the `affiliate_registrations` table:
- `commission_rate` (DECIMAL)
- `assigned_to` (TEXT)
- `updated_at` (automatically updated by trigger)

## Validation Rules

### Commission Rate:
- Must be numeric (integer or decimal)
- Range: 0 to 100
- Optional field (can be empty)
- No percentage symbol in input (added as suffix for display)

### Assigned To:
- Text field
- Max length: 100 characters
- Optional field (can be empty)
- Accepts names, emails, or any text identifier

## Error Handling

- Network errors: Show "Failed to update affiliate information"
- Validation errors: Show specific validation message
- Success: Show "Affiliate information updated successfully"
- Loading state: Show "💾 Saving..." and disable buttons