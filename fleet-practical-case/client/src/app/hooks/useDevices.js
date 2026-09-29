export async function submitDevice(event, { deviceForm, editingDeviceId, setStatusMessage, setDeviceForm, setEditingDeviceId, DEFAULT_DEVICE_FORM, loadAllDevice, loadAllEmployees, setErrors})
  {
    event.preventDefault();

    const payload = {
      name: deviceForm.name,
      type: deviceForm.type,
      ownerId: deviceForm.ownerId || null,
    };

    const isEditing = Boolean(editingDeviceId);
    const url = isEditing ? `/api/devices/${editingDeviceId}` : "/api/devices";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Could not save device");
      }
      setStatusMessage(isEditing ? "Device updated" : "Device created");
      setDeviceForm(DEFAULT_DEVICE_FORM);
      setEditingDeviceId(null);
      await loadAllDevice();
      await loadAllEmployees();
    } catch (error) {
      setErrors((prev) => [...prev, `Device save failed: ${error.message}`]);
    }
}

export async function handleDeleteDevice(deviceId, {setStatusMessage, setErrors, loadAllDevice, loadAllEmployees})
{
    const isConfirmed = window.confirm("Delete this device?");
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || "Could not delete device");
      }
      setStatusMessage("Device deleted");
      await loadAllDevice();
      await loadAllEmployees();
    } catch (error) {
      setErrors((prev) => [...prev, `Device delete failed: ${error.message}`]);
    }
}