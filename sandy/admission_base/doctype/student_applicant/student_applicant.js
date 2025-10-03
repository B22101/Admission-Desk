// Copyright (c) 2025, sandy and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student Applicant", {
  refresh(frm) {
    frappe.db.get_value("Academic Year", { is_current: 1 }, "name")
      .then(r => {
        if (r.message && r.message.name) {
          console.log("Academic Year:", r.message.name)
          frm.set_value("academic_year", r.message.name)
        } else {
          frappe.msgprint("No Current Academic Year Found")
        }
      })
  }
})
