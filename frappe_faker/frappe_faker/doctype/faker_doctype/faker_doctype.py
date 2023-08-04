# Copyright (c) 2023, Maxim S and contributors
# For license information, please see license.txt

import frappe
from faker import Faker
from frappe.model.document import Document

# @frappe.whitelist()
# def get_locales():
#     fake = Faker()
#     return fake.locales

@frappe.whitelist()
def fake_doc(name):

    faker_doc = frappe.get_doc("Faker Doctype", name)
    locale = faker_doc.locale
    fake = Faker(locale)
    new_doc_data = {'doctype': faker_doc.document_type}
    new_doc_data['title'] = faker_doc.name 
    
    for d in faker_doc.doc_fields:	
        try:
            fake_method = getattr(fake, d.fak_method)
        except AttributeError:
            raise NotImplementedError("Class `{}` does not implement `{}`".format(fake.__class__.__name__, d.fak_method))
        new_doc_data[d.fieldname] = fake_method()
    print(new_doc_data)
    # create a new document
    new_doc = frappe.get_doc(new_doc_data)
    new_doc.insert()
    frappe.msgprint('Fake document is created')
    

    
    
class FakerDoctype(Document):
    pass
        
         
        
        

        
        
