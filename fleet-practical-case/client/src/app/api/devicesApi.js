export async function fetchDevices( { setLoadingDevices, setDevices, setLastRefreshAt, setErrors })
{
    setLoadingDevices(true);
    try {
      const response = await fetch("/api/devices");
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || "Could not load devices");
      }
      setDevices(Array.isArray(json) ? json : []);
      setLastRefreshAt(new Date().toISOString());
    } catch (error) {
      setErrors((prev) => [...prev, `Devices fetch failed: ${error.message}`]);
    } finally {
      setLoadingDevices(false);
    }
}