import { useEffect, useMemo, useState } from "react";
import { fetchEmployees } from "./api/employeesApi";
import "../App.css";
import { fetchDevices } from "./api/devicesApi";
import { submitEmployee, handleDeleteEmployee } from "./hooks/useEmployees";
import { handleDeleteDevice, submitDevice } from "./hooks/useDevices";
import { EmployeesTab } from "./components/employees/employeTab";
import { DevicesTab } from "./components/devices/deviceTab";

const DEFAULT_EMPLOYEE_FORM = { name: "", role: "" };
const DEFAULT_DEVICE_FORM = { name: "", type: "Laptop", ownerId: "" };

function App() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [deviceOwnerFilter, setDeviceOwnerFilter] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [deviceSearch, setDeviceSearch] = useState("");
  const [employeeForm, setEmployeeForm] = useState(DEFAULT_EMPLOYEE_FORM);
  const [deviceForm, setDeviceForm] = useState(DEFAULT_DEVICE_FORM);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [dashboardState, setDashboardState] = useState({
    totalEmployees: 0,
    totalDevices: 0,
    assignedDevices: 0,
  });
  const [ownerNameById, setOwnerNameById] = useState({});
  const [loadingOwnerNames, setLoadingOwnerNames] = useState(false);
  const [lastRefreshAt, setLastRefreshAt] = useState("");

  const roleOptions = useMemo(() => {
    const set = new Set();
    employees.forEach((employee) => {
      if (employee.role) {
        set.add(employee.role);
      }
    });
    return Array.from(set);
  }, [employees]);

  const deviceTypeOptions = useMemo(() => {
    const set = new Set();
    devices.forEach((device) => {
      if (device.type) {
        set.add(device.type);
      }
    });
    return Array.from(set);
  }, [devices]);

  useEffect(() => {
    const savedTab = window.localStorage.getItem("fleet_active_tab");
    const savedRoleFilter = window.localStorage.getItem("fleet_role_filter");
    const savedTypeFilter = window.localStorage.getItem(
      "fleet_device_type_filter",
    );
    const savedOwnerFilter = window.localStorage.getItem(
      "fleet_device_owner_filter",
    );
    const hash = window.location.hash.replace("#", "");

    if (savedRoleFilter !== null) {
      setRoleFilter(savedRoleFilter);
    }
    if (savedTypeFilter !== null) {
      setDeviceTypeFilter(savedTypeFilter);
    }
    if (savedOwnerFilter !== null) {
      setDeviceOwnerFilter(savedOwnerFilter);
    }

    if (hash === "employees" || hash === "devices") {
      setActiveTab(hash);
    } else if (savedTab === "employees" || savedTab === "devices") {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("fleet_active_tab", activeTab);
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    window.localStorage.setItem("fleet_role_filter", roleFilter);
  }, [roleFilter]);

  useEffect(() => {
    window.localStorage.setItem("fleet_device_type_filter", deviceTypeFilter);
  }, [deviceTypeFilter]);

  useEffect(() => {
    window.localStorage.setItem("fleet_device_owner_filter", deviceOwnerFilter);
  }, [deviceOwnerFilter]);

  useEffect(() => {
    loadAllEmployees();
    loadAllDevice();
  }, []);

  useEffect(() => {
    if (activeTab !== "devices") {
      return;
    }

    const ownerIds = Array.from(
      new Set(
        filteredDevices
          .map((device) => Number(device.owner_id))
          .filter((ownerId) => Number.isInteger(ownerId) && ownerId > 0),
      ),
    );

    if (ownerIds.length === 0) {
      setOwnerNameById({});
      return;
    }

    setLoadingOwnerNames(true);
    setOwnerNameById({});

    Promise.all(
      ownerIds.map(async (ownerId) => {
        try {
          const response = await fetch(`/api/employees/${ownerId}`);

          if (response.status === 404) {
            return {
              ownerId: String(ownerId),
              ownerName: `Unknown employee #${ownerId}`,
            };
          }

          if (!response.ok) {
            throw new Error(`Failed to resolve owner ${ownerId}`);
          }

          const json = await response.json();
          return {
            ownerId: String(ownerId),
            ownerName: json.name,
          };
        } catch (error) {
          return {
            ownerId: String(ownerId),
            ownerName: `Unknown employee #${ownerId}`,
          };
        }
      }),
    )
      .then((resolvedOwners) => {
        const ownerMap = {};
        resolvedOwners.forEach((owner) => {
          ownerMap[owner.ownerId] = owner.ownerName;
        });
        setOwnerNameById(ownerMap);
      })
      .finally(() => {
        setLoadingOwnerNames(false);
      });
  }, [filteredDevices, activeTab]);

  useEffect(() => {
    let nextEmployees = [...employees];

    if (roleFilter) {
      nextEmployees = nextEmployees.filter(
        (employee) => employee.role === roleFilter,
      );
    }
    if (employeeSearch.trim()) {
      const normalized = employeeSearch.toLowerCase();
      nextEmployees = nextEmployees.filter((employee) => {
        return (
          String(employee.name || "")
            .toLowerCase()
            .includes(normalized) ||
          String(employee.role || "")
            .toLowerCase()
            .includes(normalized)
        );
      });
    }
    setFilteredEmployees(nextEmployees);
  }, [employees, roleFilter, employeeSearch]);

  useEffect(() => {
    let nextDevices = [...devices];

    if (deviceTypeFilter) {
      nextDevices = nextDevices.filter(
        (device) => device.type === deviceTypeFilter,
      );
    }
    if (deviceOwnerFilter) {
      nextDevices = nextDevices.filter(
        (device) => String(device.owner_id || "") === String(deviceOwnerFilter),
      );
    }
    if (deviceSearch.trim()) {
      const normalized = deviceSearch.toLowerCase();
      nextDevices = nextDevices.filter((device) => {
        return (
          String(device.name || "")
            .toLowerCase()
            .includes(normalized) ||
          String(device.type || "")
            .toLowerCase()
            .includes(normalized)
        );
      });
    }
    setFilteredDevices(nextDevices);
  }, [devices, deviceTypeFilter, deviceOwnerFilter, deviceSearch]);

  useEffect(() => {
    const assigned = devices.filter((device) => device.owner_id).length;
    setDashboardState({
      totalEmployees: employees.length,
      totalDevices: devices.length,
      assignedDevices: assigned,
    });
  }, [employees, devices]);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }
    const timer = window.setTimeout(() => setStatusMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);  

  // /api/employeesApi.js
  const loadAllEmployees = async () => 
  {
    await fetchEmployees( { setEmployees, setLoadingEmployees, setErrors, setLastRefreshAt } )
  }

  // /api/deviceApi.js
  const loadAllDevice = async () =>
  {
    await fetchDevices( { setLoadingDevices, setDevices, setLastRefreshAt, setErrors } );
  }

  // /hooks/useEmployees.js
  const callSubmitEmployee = async (event) =>
  {
    await submitEmployee(event, {employeeForm, editingEmployeeId, setStatusMessage, setEmployeeForm, setEditingEmployeeId, setErrors, loadAllEmployees, loadAllDevice, DEFAULT_EMPLOYEE_FORM});
  }

  // /hooks/useDevices.js
  const callSubmitDevice = async (event) =>
  {
    await submitDevice(event, { deviceForm, editingDeviceId, setStatusMessage, setDeviceForm, setEditingDeviceId, DEFAULT_DEVICE_FORM, loadAllDevice, loadAllEmployees, setErrors});
  }

  // /hooks/useEmployees.js
  const callHandleDeleteEmployee = async (employeeId) =>
  {
    await handleDeleteEmployee(employeeId, {setStatusMessage, setErrors, setEmployees, setLoadingEmployees, setLastRefreshAt});
  }

  // /hooks/useDevices.js
  const callHandleDeleteDevice = async (deviceId) =>
  {
    await handleDeleteDevice(deviceId, {setStatusMessage, setErrors, loadAllDevice, loadAllEmployees});
  }

  function clearErrorStack() {
    setErrors([]);
  }

  function beginEmployeeEdit(employee) {
    setActiveTab("employees");
    setEditingEmployeeId(employee.id);
    setEmployeeForm({
      name: employee.name || "",
      role: employee.role || "",
    });
  }

  function beginDeviceEdit(device) {
    setActiveTab("devices");
    setEditingDeviceId(device.id);
    setDeviceForm({
      name: device.name || "",
      type: device.type || "Laptop",
      ownerId: device.owner_id ? String(device.owner_id) : "",
    });
  }

  function resetEmployeeForm() {
    setEmployeeForm(DEFAULT_EMPLOYEE_FORM);
    setEditingEmployeeId(null);
  }

  function resetDeviceForm() {
    setDeviceForm(DEFAULT_DEVICE_FORM);
    setEditingDeviceId(null);
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <h1>Fleet Device Manager</h1>
        <p>Interview boilerplate for employee and device management.</p>
      </header>

      <section className="app-kpis">
        <article>
          <h3>Total employees</h3>
          <strong>{dashboardState.totalEmployees}</strong>
        </article>
        <article>
          <h3>Total devices</h3>
          <strong>{dashboardState.totalDevices}</strong>
        </article>
        <article>
          <h3>Assigned devices</h3>
          <strong>{dashboardState.assignedDevices}</strong>
        </article>
      </section>

      <div className="app-controls">
        <button
          className={
            activeTab === "employees" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("employees")}
          type="button"
        >
          Employees
        </button>
        <button
          className={
            activeTab === "devices" ? "tab-button active" : "tab-button"
          }
          onClick={() => setActiveTab("devices")}
          type="button"
        >
          Devices
        </button>
        <button
          type="button"
          onClick={() => {
            loadAllEmployees();
            loadAllDevice();
          }}
        >
          Manual refresh
        </button>
      </div>

      {statusMessage ? <p className="status success">{statusMessage}</p> : null}
      {lastRefreshAt ? (
        <p className="timestamp">Last refresh: {lastRefreshAt}</p>
      ) : null}

      {errors.length > 0 ? (
        <div className="status error">
          <div className="error-header">
            <strong>Errors ({errors.length})</strong>
            <button type="button" onClick={clearErrorStack}>
              Clear
            </button>
          </div>
          <ul>
            {errors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <main className="app-main">
        {activeTab === "employees" ? (
        <EmployeesTab
            editingEmployeeId={editingEmployeeId}
            callSubmitEmployee={callSubmitEmployee}
            employeeForm={employeeForm}
            setEmployeeForm={setEmployeeForm}
            resetEmployeeForm={resetEmployeeForm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            roleOptions={roleOptions}
            employeeSearch={employeeSearch}
            setEmployeeSearch={setEmployeeSearch}
            loadingEmployees={loadingEmployees}
            filteredEmployees={filteredEmployees}
            beginEmployeeEdit={beginEmployeeEdit}
            callHandleDeleteEmployee={callHandleDeleteEmployee}
          />
        ) : null}

        {activeTab === "devices" ? (
          <DevicesTab
            editingDeviceId={editingDeviceId}
            callSubmitDevice={callSubmitDevice}
            deviceForm={deviceForm}
            setDeviceForm={setDeviceForm}
            resetDeviceForm={resetDeviceForm}
            employees={employees}
            deviceTypeFilter={deviceTypeFilter}
            setDeviceTypeFilter={setDeviceTypeFilter}
            deviceTypeOptions={deviceTypeOptions}
            deviceOwnerFilter={deviceOwnerFilter}
            setDeviceOwnerFilter={setDeviceOwnerFilter}
            deviceSearch={deviceSearch}
            setDeviceSearch={setDeviceSearch}
            loadingDevices={loadingDevices}
            loadingOwnerNames={loadingOwnerNames}
            filteredDevices={filteredDevices}
            ownerNameById={ownerNameById}
            beginDeviceEdit={beginDeviceEdit}
            callHandleDeleteDevice={callHandleDeleteDevice}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
