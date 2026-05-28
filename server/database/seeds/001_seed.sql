-- Default admin user (password: password - change immediately)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Clinic Owner', 'owner@dentalclinic.com', '$2a$10$nXtSzy9EKEqGdOH.Fa5ER.zscOUsLET6dllb78F7Q0X8OFzb1jvwm', 'owner'),
  ('Manager', 'manager@dentalclinic.com', '$2a$10$nXtSzy9EKEqGdOH.Fa5ER.zscOUsLET6dllb78F7Q0X8OFzb1jvwm', 'manager')
ON CONFLICT (email) DO NOTHING;

-- Default clinic availability (Mon-Fri 9am-6pm, Sat 10am-3pm)
INSERT INTO availability (day_of_week, start_time, end_time, slot_duration_minutes) VALUES
  (1, '09:00', '18:00', 30),
  (2, '09:00', '18:00', 30),
  (3, '09:00', '18:00', 30),
  (4, '09:00', '18:00', 30),
  (5, '09:00', '18:00', 30),
  (6, '10:00', '15:00', 30)
ON CONFLICT DO NOTHING;

-- Sample prospects for demo
INSERT INTO prospects (name, email, phone, source, status, service_interest, message) VALUES
  ('Aarav Sharma', 'aarav@example.com', '+977-9801234567', 'instagram', 'lead', 'Teeth Whitening', 'Saw your post on Instagram, interested in whitening.'),
  ('Priya Thapa', 'priya@example.com', '+977-9807654321', 'website', 'prospect', 'Dental Implants', 'Looking for implant consultation.'),
  ('Rohan Karki', 'rohan@example.com', '+977-9809876543', 'facebook', 'patient', 'Braces', 'Enquired via Facebook message.'),
  ('Sita Rai', 'sita@example.com', '+977-9812345678', 'whatsapp', 'lead', 'General Checkup', 'WhatsApp inquiry about checkup cost.')
ON CONFLICT DO NOTHING;
