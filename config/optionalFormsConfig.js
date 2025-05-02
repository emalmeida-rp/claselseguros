export const optionalFormsConfig = {
    'auto': {
        titleKey: 'form_auto_title',
        fields: [
            {
                id: 'brand',
                type: 'text',
                labelKey: 'form_brand_label',
                placeholderKey: 'form_brand_placeholder'
            },
            {
                id: 'model',
                type: 'text',
                labelKey: 'form_model_label',
                placeholderKey: 'form_model_placeholder'
            },
            {
                id: 'year',
                type: 'number',
                labelKey: 'form_year_label',
                placeholderKey: 'form_year_placeholder'
            },
            {
                id: 'plate',
                type: 'text',
                labelKey: 'form_plate_label',
                placeholderKey: 'form_plate_placeholder'
            }
        ]
    },
    'hogar': {
        titleKey: 'form_hogar_title',
        fields: [
            {
                id: 'address',
                type: 'text',
                labelKey: 'form_address_label',
                placeholderKey: 'form_address_placeholder'
            },
            {
                id: 'city',
                type: 'text',
                labelKey: 'form_city_label',
                placeholderKey: 'form_city_placeholder'
            },
            {
                id: 'province',
                type: 'text',
                labelKey: 'form_province_label',
                placeholderKey: 'form_province_placeholder'
            },
            {
                id: 'postal_code',
                type: 'text',
                labelKey: 'form_postal_code_label',
                placeholderKey: 'form_postal_code_placeholder'
            }
        ]
    },
    'vida': {
        titleKey: 'form_vida_title',
        fields: [
            {
                id: 'birth_date',
                type: 'date',
                labelKey: 'form_birth_date_label',
                placeholderKey: 'form_birth_date_placeholder'
            },
            {
                id: 'document',
                type: 'text',
                labelKey: 'form_document_label',
                placeholderKey: 'form_document_placeholder'
            },
            {
                id: 'occupation',
                type: 'text',
                labelKey: 'form_occupation_label',
                placeholderKey: 'form_occupation_placeholder'
            },
            {
                id: 'income',
                type: 'number',
                labelKey: 'form_income_label',
                placeholderKey: 'form_income_placeholder'
            }
        ]
    }
}; 