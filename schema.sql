-- CureSlot Edge D1 SQLite Schema
CREATE TABLE IF NOT EXISTS clinics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    clinic_id TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_name TEXT,
    slot_time TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(clinic_id) REFERENCES clinics(id)
);

CREATE INDEX IF NOT EXISTS idx_appointments_clinic_date ON appointments(clinic_id, slot_time);
