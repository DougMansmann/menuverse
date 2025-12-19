// MainCourseList.jsx
// MainCourseList.jsx
import { useState, useEffect } from "react";
import "./MainCourseList.css";
import { apiFetch } from "../utils/api.js";

export default function MainCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // which item is being edited (null = none, "new" = add-form)
  const [editingId, setEditingId] = useState(null);

  // form values for the item that is currently edited
  const [form, setForm] = useState({
    name: "",
    daysBetween: "7",
    lastTime: "",
    category: "",
    menuap_id: "",
    orgin: "",
    numsides: "0",
  });

  // -----------------------------------------------------------------
  // 1. FETCH ALL
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchCourses();
  }, []);

const fetchCourses = async () => { // ASYNC function
    try {
      const response = await apiFetch("http://localhost:8080/api/maincourse");
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 2. HELPERS – start / cancel editing
  // -----------------------------------------------------------------
  const startEdit = (course) => {
    setEditingId(course.id);
    setForm({
      name: course.name || "",
      daysBetween: course.daysBetween ?? "7",
      lastTime: course.lastTime || "",
      category: course.category || "",
      menuap_id: course.menuap_id || "",
      orgin: course.orgin || "",
      numsides: course.numsides ?? "0",
    });
  };

  const startAdd = () => {
    setEditingId("new");
    setForm({ name: "", daysBetween: "7", lastTime: "2025-01-01", category: "", menuap_id: "", orgin: "", numsides: "0"});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", daysBetween: "", lastTime: "", category: "", menuap_id: "", orgin: "", numsides: "" });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const [y, m, d] = isoString.split("-");
    return `${m}/${d}/${y}`;
  };

  // -----------------------------------------------------------------
  // 3. CREATE / UPDATE / DELETE
  // -----------------------------------------------------------------
  const saveCourse = async () => { // Add async
    const payload = {
      name: form.name.trim(),
      
      daysBetween: form.daysBetween === "" ? 7 : Number(form.daysBetween), // ← changed to 7
      lastTime: form.lastTime?.trim() ? form.lastTime.trim() : "2025-01-01",
      category: form.category.trim() || null,
      orgin: form.orgin.trim() || null, 
      menuap_id: form.menuap_id === "" ? null : Number(form.menuap_id),
      numsides: form.numsides === "" ? 0 : Number(form.numsides), // ← changed to 0
    };

    const isNew = editingId === "new";
    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? "http://localhost:8080/api/maincourse"
      : `http://localhost:8080/api/maincourse/${editingId}`;

    // NEW STARTS HERE
    try {
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const saved = await response.json();
      
      if (isNew) {
        setCourses((prev) => [...prev, saved]);
      } else {
        setCourses((prev) =>
          prev.map((c) => (c.id === saved.id ? saved : c))
        );
      }
      cancelEdit();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

const deleteCourse = async (id) => { // Add async
    if (!window.confirm("Delete this main course?")) return;
    try {
      await apiFetch(`http://localhost:8080/api/maincourse/${id}`, {
        method: "DELETE",
      });
      setCourses((prev) => prev.filter((c) => c.id !== id));
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
    <div className="maincourse-container">
      {/* ---------- ADD NEW BUTTON ---------- */}
      <button className="add-main" onClick={startAdd}>
        + Add New Main Course
      </button>

      {/* ---------- ADD FORM (when editing "new") ---------- */}
      {editingId === "new" && (
        <div className="maincourse-item edit-form">
          <EditForm
            form={form}
            setForm={setForm}
            onSave={saveCourse}
            onCancel={cancelEdit}
          />
        </div>
      )}

      {/* ---------- LIST ---------- */}
      <ul className="maincourse-list">
        {courses.map((course) => {
          const editing = isEditing(course.id);

          return (
            <li key={course.id} className="maincourse-item">
              {/* ----- READ ONLY HEADER ----- */}
              {!editing && (
                <div
                  className="maincourse-header"
                  onClick={() => startEdit(course)}
                  title="Click to edit"
                >
                  <span>{course.name}</span>
                  <span className="maincourse-icon">+</span>
                </div>
              )}

              {/* ----- EDIT FORM ----- */}
              {editing && (
                <div className="edit-form">
                  <EditForm
                    form={form}
                    setForm={setForm}
                    onSave={saveCourse}
                    onCancel={cancelEdit}
                    extraActions={
                      <button
                        className="delete-btn"
                        onClick={() => deleteCourse(course.id)}
                      >
                        Delete
                      </button>
                    }
                  />
                </div>
              )}

              {/* ----- DETAILS (only when NOT editing) ----- */}
              {!editing && (
                <div className="maincourse-details">
                  {course.category && (
                    <p>
                      <strong>Category:</strong> {course.category}
                    </p>
                  )}
                  {course.orgin && (
                    <p>
                      <strong>Orgin:</strong> {course.orgin}
                    </p>
                  )}
                  {course.daysBetween !== undefined && (
                    <p>
                      <strong>Minimum Days Between Serving:</strong>{" "}
                      {course.daysBetween}
                    </p>
                  )}
                  {course.lastTime && (
                    <p>
                      <strong>Last Date Served:</strong> {formatDate(course.lastTime)}
                    </p>
                  )}
                  {course.numsides != null && (
                    <p>
                      <strong>Number of Sides:</strong> {course.numsides}
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
    <div className="edit-form">
      {/* Each field: label and input on the same line */}
      <div className="field-row">
        <label>Course Name:</label>
        <input
          name="name"
          placeholder="Course name*"
          value={form.name}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className="field-row">
        <label>Number of Days Between:</label>
        <input
          name="daysBetween"
          type="number"
          min="0"
          placeholder="Min days between (optional)"
          value={form.daysBetween}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <label>Last Time Served:</label>
        <input
          name="lastTime"
          type="date"
          value={form.lastTime}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <label>Category:</label>
        <input
          name="category"
          placeholder="Category (optional)"
          value={form.category}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <label>Orgin:</label>
        <input
          name="orgin"
          placeholder="Orgin (optional)"
          value={form.orgin}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <label>Number of Sides:</label>
        <input
          name="numsides"
          type="number"
          min="0"
          placeholder="Number of sides (optional)"
          value={form.numsides}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
        {extraActions}
      </div>
    </div>
  );
}