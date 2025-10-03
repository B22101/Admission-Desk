import frappe

def set_owner_for_guest(doc, method):
    """
    If the current session user is Guest, set owner = student_email field value
    """
    if frappe.session.user == "Guest":
        if hasattr(doc, "email") and doc.email:
            doc.owner = doc.email
        else:
            # fallback if email not provided
            frappe.throw("Guest must provide an email to submit the application")
