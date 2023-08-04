// Copyright (c) 2023, Maxim S and contributors
// For license information, please see license.txt

function get_fields_for_doctype(doctype) {
    return new Promise((resolve) => frappe.model.with_doctype(doctype, resolve)).then(() => {
        return frappe.meta.get_docfields(doctype).filter((df) => {
            return (
                (frappe.model.is_value_type(df.fieldtype) &&
                    !["lft", "rgt"].includes(df.fieldname)) ||
                ["Table", "Table Multiselect"].includes(df.fieldtype)
            );
        });
    });
}

frappe.ui.form.on("Faker Doctype", {
    refresh(frm) {
        _FAKER_DOC = 'New faker doc'
        frm.add_custom_button(_FAKER_DOC, () => {
            frappe.call({
                method: "frappe_faker.frappe_faker.doctype.faker_doctype.faker_doctype.fake_doc",
                args: {
                    name: frm.doc.name
                },
                callback: function (r) {
                    // frm.set_value("template", r.message);
                    if (r.message) {
                        frappe.msgprint(r.message.message, r.message.subject);
                    }
                }
            })
        });
        frm.change_custom_button_type(_FAKER_DOC, null, 'primary');
    },
    read_fields: function (frm) {
        let selected_doctype = frm.doc.document_type;
        let added_fields = (frm.doc.doc_fields || []).map((d) => d.fieldname);
        console.log(added_fields)
        get_fields_for_doctype(frm.doc.document_type).then((fields) => {
            for (let df of fields) {
                if (
                    // webform_fieldtypes.includes(df.fieldtype) &&
                    !added_fields.includes(df.fieldname) &&
                    !df.hidden
                ) {
                    frm.add_child("doc_fields", {
                        fieldname: df.fieldname,
                        // label: df.label,
                        // fieldtype: df.fieldtype,
                        // options: df.options,
                        // reqd: df.reqd,
                        // default: df.default,
                        // read_only: df.read_only,
                        // depends_on: df.depends_on,
                        // mandatory_depends_on: df.mandatory_depends_on,
                        // read_only_depends_on: df.read_only_depends_on,
                    });
                }
            }
            frm.refresh_field("doc_fields");
            frm.scroll_to_field("doc_fields");
        });
    }
});
