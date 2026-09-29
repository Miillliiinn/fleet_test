import {db} from "../config/database.js";

// --

export function getHealth(req, res) // get /api/health
{
  res.json({ ok: true, timestamp: new Date().toISOString() });
};