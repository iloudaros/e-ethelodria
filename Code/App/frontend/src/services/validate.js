function validateJsonFormat(json) {
    // Helper function to validate if a value is a string
    function isString(value) {
        return typeof value === 'string';
    }
    
    // Helper function to validate the 'details' array
    function validateDetails(details) {
        if (!Array.isArray(details)) return false;
        return details.every(detail => 
            isString(detail.detail_name) && 
            isString(detail.detail_value)
        );
    }
    
    // Validate 'items' array
    if (!Array.isArray(json.items)) return false;
    const validItems = json.items.every(item => 
        isString(item.id) && 
        isString(item.name) && 
        isString(item.category) && 
        validateDetails(item.details)
    );
    
    if (!validItems) return false;
    
    // Validate 'categories' array
    if (!Array.isArray(json.categories)) return false;
    const validCategories = json.categories.every(category => 
        isString(category.id) && 
        isString(category.category_name)
    );
    
    return validCategories;
}

export default validateJsonFormat;