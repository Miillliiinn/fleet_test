import { fetchEmployees } from "../api/employeesApi";

export async function submitEmployee(event, {employeeForm, editingEmployeeId, setStatusMessage, setEmployeeForm, setEditingEmployeeId, setErrors, loadAllEmployees, loadAllDevice, DEFAULT_EMPLOYEE_FORM})
{
    event.preventDefault();

    const payload = {
      name: employeeForm.name,
      role: employeeForm.role,
    };

    const isEditing = Boolean(editingEmployeeId);
    const url = isEditing
      ? `/api/employees/${editingEmployeeId}`
      : "/api/employees";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Could not save employee");
      }
      setStatusMessage(isEditing ? "Employee updated" : "Employee created");
      setEmployeeForm(DEFAULT_EMPLOYEE_FORM);
      setEditingEmployeeId(null);
      await loadAllEmployees();
      await loadAllDevice();
    } catch (error) {
      setErrors((prev) => [...prev, `Employee save failed: ${error.message}`]);
    }
}


export async function handleDeleteEmployee(employeeId, {setStatusMessage, setErrors, setEmployees, setLoadingEmployees, setLastRefreshAt})
{
    const isConfirmed = window.confirm(
      "Delete employee and unassign their devices?",
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || "Could not delete employee");
      }
      setStatusMessage("Employee deleted");
      await fetchEmployees({setEmployees, setLoadingEmployees, setErrors, setLastRefreshAt});
    } catch (error) {
      setErrors((prev) => [
        ...prev,
        `Employee delete failed: ${error.message}`,
    ]);
  }
}