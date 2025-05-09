/*
  # Initial database schema

  1. Tables
    - users
    - clients
    - machines
    - maintenance_requests
    - maintenance_history
    - notifications
    - documents
    - photos

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES users(id)
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Machines table
CREATE TABLE IF NOT EXISTS machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  acquisition_date DATE NOT NULL,
  hour_meter INTEGER,
  status TEXT NOT NULL CHECK (status IN ('operational', 'maintenance', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES machines(id) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES machines(id) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  machine_id UUID REFERENCES machines(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  scheduled_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  resolution TEXT,
  technician TEXT
);

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Maintenance history table
CREATE TABLE IF NOT EXISTS maintenance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES machines(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  performed_at TIMESTAMPTZ NOT NULL,
  performed_by TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('corrective', 'preventive')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE maintenance_history ENABLE ROW LEVEL SECURITY;

-- Parts used in maintenance
CREATE TABLE IF NOT EXISTS parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_id UUID REFERENCES maintenance_history(id) NOT NULL,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('maintenance', 'preventive', 'system')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Users can only access their own data
CREATE POLICY users_access ON users
  FOR ALL
  USING (id = auth.uid());

-- Clients can only access their own data
CREATE POLICY clients_access ON clients
  FOR ALL
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Machines access policy
CREATE POLICY machines_access ON machines
  FOR ALL
  USING (client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Documents access policy
CREATE POLICY documents_access ON documents
  FOR ALL
  USING (machine_id IN (
    SELECT id FROM machines WHERE client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Photos access policy
CREATE POLICY photos_access ON photos
  FOR ALL
  USING (machine_id IN (
    SELECT id FROM machines WHERE client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Maintenance requests access policy
CREATE POLICY maintenance_requests_access ON maintenance_requests
  FOR ALL
  USING (client_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Maintenance history access policy
CREATE POLICY maintenance_history_access ON maintenance_history
  FOR ALL
  USING (machine_id IN (
    SELECT id FROM machines WHERE client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Parts access policy
CREATE POLICY parts_access ON parts
  FOR ALL
  USING (maintenance_id IN (
    SELECT id FROM maintenance_history WHERE machine_id IN (
      SELECT id FROM machines WHERE client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
      )
    )
  ) OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Notifications access policy
CREATE POLICY notifications_access ON notifications
  FOR ALL
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));