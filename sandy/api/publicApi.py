import frappe

@frappe.whitelist(allow_guest=True)
def get_current_academic_year():
    year = frappe.db.get_value("Academic Year", {"is_current": 1}, "name")
    return {"name": year} if year else None


@frappe.whitelist(allow_guest = True)
def get_det_program(dept):
    program = frappe.db.get_value("Department List", {"department_name": dept}, "program")
    return {"program": program} if program else None


@frappe.whitelist(allow_guest = True)
def create_User(first_name, email):
    if not frappe.db.exists("User", email):
        try:
            user = frappe.get_doc({
                "doctype": "User",
                "first_name": first_name,
                "email": email,
                "send_welcome_email": 1,
                "roles": [{ "role": "Student Applicant" }]
            })
            user.insert(ignore_permissions = True)
            frappe.db.commit()
            return {"message": "User Created & email sent Successfully"}
        except Exception as e:
            return {"error": str(e)}
    else:
        return {"message:": "User Already Exists in the Email ID"}