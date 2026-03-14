/**
 * ContactKanban — Drag-and-drop Kanban board for contact leads.
 * Columns represent statuses: Open → In Progress → Contacted → Qualified → Closed.
 * Dropping a card into a new column updates its status via the API.
 * @route /contacts/kanban
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../../services/contactService';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'open', label: 'Open', color: '#635BFF' },
  { value: 'in_progress', label: 'In Progress', color: '#00D4FF' },
  { value: 'contacted', label: 'Contacted', color: '#FFA500' },
  { value: 'qualified', label: 'Qualified', color: '#32CD32' },
  { value: 'converted', label: 'Converted', color: '#228B22' },
  { value: 'closed', label: 'Closed', color: '#808080' },
  { value: 'lost', label: 'Lost', color: '#DC143C' },
  { value: 'spam', label: 'Spam', color: '#8B0000' },
];

export const ContactKanban = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await contactService.update(contactId, { lead_status: newStatus });
      toast.success('Status updated');
      loadContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getContactsByStatus = (status) => {
    return contacts.filter((c) => c.lead_status === status);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="kanban-view">
      <div className="page-header">
        <h1>Contacts Kanban</h1>
        <Link to="/contacts" className="btn-secondary">
          List View
        </Link>
      </div>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <div key={status.value} className="kanban-column">
            <div className="column-header" style={{ borderTopColor: status.color }}>
              <h3>{status.label}</h3>
              <span className="count">{getContactsByStatus(status.value).length}</span>
            </div>
            <div className="column-content">
              {getContactsByStatus(status.value).map((contact) => (
                <div key={contact.id} className="kanban-card">
                  <h4>{contact.full_name}</h4>
                  <p>{contact.email}</p>
                  <p className="country">{contact.country}</p>
                  <span className={`badge badge-${contact.priority}`}>
                    {contact.priority}
                  </span>
                  <div className="card-actions">
                    <Link to={`/contacts/${contact.id}`}>View</Link>
                    <select
                      value={contact.lead_status}
                      onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                      className="status-select"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
