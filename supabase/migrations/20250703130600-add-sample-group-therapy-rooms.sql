
-- Add sample group therapy rooms for testing
INSERT INTO public.group_therapy_rooms (room_name, description, therapy_type, max_participants, meeting_schedule) VALUES
('Anxiety Support Circle', 'A safe space to share experiences and coping strategies for anxiety', 'anxiety', 8, '{"day": "Monday", "time": "7:00 PM"}'),
('Depression Recovery Group', 'Weekly sessions focused on healing and building resilience', 'depression', 6, '{"day": "Wednesday", "time": "6:30 PM"}'),
('Grief & Loss Support', 'Compassionate support for those dealing with loss', 'grief', 8, '{"day": "Thursday", "time": "7:30 PM"}'),
('General Wellness Circle', 'Open discussions about mental health and wellness', 'general', 10, '{"day": "Saturday", "time": "10:00 AM"}'),
('Addiction Recovery Support', 'Peer support for addiction recovery journey', 'addiction', 6, '{"day": "Tuesday", "time": "6:00 PM"}')
ON CONFLICT DO NOTHING;
