frappe.ready(function () {
    // Set Academic Year
    frappe.call({
        method: "sandy.api.publicApi.get_current_academic_year",
        callback: function (r) {
            if (r.message && r.message.name) {
                frappe.web_form.set_value("academic_year", r.message.name);
            } else {
                frappe.msgprint("No Current Academic Year Found");
            }
        }
    });

    // Update status based on "paid" field
    frappe.web_form.on("paid", function (field, value) {
        let paidStatus = frappe.web_form.get_value("paid");
        if (paidStatus) {
            frappe.web_form.set_value("status", "Applied");
        } else {
            frappe.web_form.set_value("status", "Payment Pending");
        }
    });

    frappe.web_form.on("department", (field, value) => {
        console.log("Department field changed:", value);

        // You can also get the latest value directly
        let dept = frappe.web_form.get_value("department");
        console.log("Department from form:", dept);

        // Call the API to get the program for the selected department
        frappe.call({
            method: "sandy.api.publicApi.get_det_program",
            args: { dept: dept },
            callback: function (r) {
                if (r.message && r.message.program) {
                    let program = frappe.web_form.set_value("program", r.message.program);
                    if (program === "PG") {
                        frappe.web_form.def_property("ug_certificate", "reqd", 1);
                    }
                } else {
                    frappe.msgprint("No Program Found for Department");
                }
            }
        });
    });

    // After Save → Create User
    frappe.web_form.after_save = function () {
        frappe.call({
            method: "sandy.api.publicApi.create_User",
            args: {
                first_name: frappe.web_form.get_value("first_name"),
                email: frappe.web_form.get_value("email")
            },
            callback: function (r) {
                if (r.message) {
                    frappe.show_alert({ message: r.message, indicator: 'green' });
                } else if (r.exc) {
                    frappe.msgprint("Error: " + r.exc);
                } else {
                    frappe.msgprint("Unexpected response");
                }
            }
        });
    }
});







