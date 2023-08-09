
export const formatData = function (values){
    let data = {
        id: values.id,
        doc_shipment_method_id: values.doc_shipment_method_id,
        doc_shipment_description: values.doc_shipment_description,
    }
    if (values.doc_shipment_method_id === 1) {
        data = {
            id: values.id,
            doc_shipment_method_id: values.doc_shipment_method_id,
            doc_shipment_description: values.doc_shipment_description,
            shipping_organization: values.shipping_organization,
            shipping_country: 'Российская Федерация',
            shipping_zip: values.shipping_zip,
            shipping_region: values.shipping_region,
            shipping_city: values.shipping_city,
            shipping_street: values.shipping_street,
            shipping_house: values.shipping_house,
            shipping_office: values.shipping_office,
            shipping_second_name: values.shipping_second_name,
            shipping_first_name: values.shipping_first_name,
            shipping_mid_name: values.shipping_mid_name,
            shipping_phone: values.shipping_phone ? values.shipping_phone.replace(/[^0-9]/g, "") : '',
        }
        delete data.doc_shipment_description
    }
    return data
}