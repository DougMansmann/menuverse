// SideItemList.jsx

import { useState, useEffect } from "react";
import "./SideItemList.css";
import { apiFetch } from "../utils/api.js";

export default function SideItemList() {
  const [sides, setsides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // which item is being edited (null = none, "new" = add-form)
  const [editingId, setEditingId] = useState(null);

  // form values for the item that is currently edited
  const [form, setForm] = useState({
    name: "",
    type: "",
    daysBetween: "30",
    lastTime: "2025-01-01",
   });

  // -----------------------------------------------------------------
  // 1. FETCH ALL
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchsides();
  }, []);

  const fetchsides = async () => {
    try {
      const response = await apiFetch("http://localhost:8080/api/sides");
      const data = await response.json();
      setsides(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 2. HELPERS – start / cancel editing
  // -----------------------------------------------------------------
  const startEdit = (side) => {
    setEditingId(side.id);
    setForm({
      name: side.name || "",
      type: side.type || "",  
      daysBetween: side.daysBetween || "",
      lastTime: side.lastTime?.trim() ? side.lastTime.trim() : "2025-01-01",
    });
  };

  const startAdd = () => {
    setEditingId("new");
    setForm({ name: "", type: "", daysBetween: "", lastTime: "2025-01-01" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", type: "", daysBetween: "", lastTime: ""});
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const [y, m, d] = isoString.split("-");
    return `${m}/${d}/${y}`;
  };

  // -----------------------------------------------------------------
  // 3. CREATE / UPDATE / DELETE
  // -----------------------------------------------------------------
  const saveside = async () => {
    const payload = {
      name: form.name.trim(),
      type: form.type.trim() || null,
      daysBetween: form.daysBetween === "" ? null : Number(form.daysBetween),
      lastTime: form.lastTime?.trim() ? form.lastTime.trim() : "2025-01-01",
    };

    const isNew = editingId === "new";
    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? "http://localhost:8080/api/sides"
      : `http://localhost:8080/api/sides/${editingId}`;

    try {
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const saved = await response.json();

      if (isNew) {
        setsides((prev) => [...prev, saved]);
      } else {
        setsides((prev) =>
          prev.map((c) => (c.id === saved.id ? saved : c))
        );
      }
      cancelEdit();

    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const deleteside = async (id) => {
    if (!window.confirm("Delete this side item?")) return;
    try {
      await apiFetch(`http://localhost:8080/api/sides/${id}`, {
        method: "DELETE",
      });
      setsides((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // -----------------------------------------------------------------
  // 4. RENDER
  // -----------------------------------------------------------------
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  const isEditing = (id) => editingId === id;

  return (
    <div className="sideitem-container">
      {/* ---------- ADD NEW BUTTON ---------- */}
      <button className="add-side" onClick={startAdd}>
        + Add New Side Item
      </button>

      {/* ---------- ADD FORM (when editing "new") ---------- */}
      {editingId === "new" && (
        <div className="sideitem-item edit-form">
          <EditForm
            form={form}
            setForm={setForm}
            onSave={saveside}
            onCancel={cancelEdit}
          />
        </div>
      )}

      {/* ---------- LIST ---------- */}
      <ul className="sideitem-list">
        {sides.map((side) => {
          const editing = isEditing(side.id);

          return (
            <li key={side.id} className="sideitem-item">
              {/* ----- READ ONLY HEADER ----- */}
              {!editing && (
                <div
                  className="sideitem-header"
                  onClick={() => startEdit(side)}
                  title="Click to edit"
                >
                  <span>{side.name}</span>
                  <span className="sideitem-icon">+</span>
                </div>
              )}

              {/* ----- EDIT FORM ----- */}
              {editing && (
                <div className="edit-form">
                  <EditForm
                    form={form}
                    setForm={setForm}
                    onSave={saveside}
                    onCancel={cancelEdit}
                    extraActions={
                      <button
                        className="delete-btn"
                        onClick={() => deleteside(side.id)}
                      >
                        Delete
                      </button>
                    }
                  />
                </div>
              )}

              {/* ----- DETAILS (only when NOT editing) ----- */}
              {!editing && (
                <div className="sideitem-details">
                  {<side className="type"></side> && (
                    <p>
                      <strong>Type:</strong> {side.type}
                    </p>
                  )}
                  {side.daysBetween !== undefined && (
                    <p>
                      <strong>Minimum Days Between Serving:</strong>{" "}
                      {side.daysBetween}
                    </p>
                  )}
                  {side.lastTime && (
                    <p>
                      <strong>Last Date Served:</strong> {formatDate(side.lastTime)}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -----------------------------------------------------------------
   Re-usable inline edit form
   ----------------------------------------------------------------- */
function EditForm({ form, setForm, onSave, onCancel, extraActions }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <input
        name="name"
        placeholder="side name*"
        value={form.name}
        onChange={handleChange}
        required
        autoFocus
      />
      <input
        name="type"
        placeholder="Type of Side Item (optional)"
        value={form.type }
        onChange={handleChange}
      />
      <input
        name="daysBetween"
        type="number"
        min="0"
        placeholder="Min days between (optional)"
        value={form.daysBetween}
        onChange={handleChange}
      />
      <input
        name="lastTime"
        type="date"
        placeholder="Last Time you had side item (optional)"
        value={form.lastTime}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
        {extraActions}
      </div>
    </>
  );
}