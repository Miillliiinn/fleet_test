export async function fetchEmployees({setEmployees, setLoadingEmployees, setErrors, setLastRefreshAt})
{
  setLoadingEmployees(true);
  setErrors((prev) => []);

  try {
    const response = await fetch("/api/employees");
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Could not load employees");
    }

    setEmployees(Array.isArray(json) ? json : []);
    setLastRefreshAt(new Date().toISOString());
  } catch (error) {
    setErrors((prev) => [
      ...prev,
      `Employees fetch failed: ${error.message}`,
    ]);
  } finally {
    setLoadingEmployees(false);
  }
}