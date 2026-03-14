/**
 * ContactList — Paginated table of all contact-form submissions.
 * Supports search (name/email), status filtering, and bulk delete.
 * Each row links to ContactDetail for full editing.
 * @route /contacts
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../../services/contactService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    affiliateCode: '',
  });

  useEffect(() => {
    loadContacts();
  }, [filters]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll(filters);
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-list">
      <div className="page-header">
        <h1>Contacts</h1>
        <Link to="/contacts/kanban" className="btn-secondary">
          Kanban View
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
          <option value="lost">Lost</option>
          <option value="spam">Spam</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="text"
          placeholder="Filter by affiliate code..."
          value={filters.affiliateCode || ''}
          onChange={(e) => setFilters({ ...filters, affiliateCode: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Promo Code</th>
                <th>Affiliate Name</th>
                <th>Affiliate Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.full_name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.country}</td>
                  <td>
                    <span className={`badge badge-${contact.lead_status}`}>
                      {contact.lead_status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${contact.priority}`}>
                      {contact.priority}
                    </span>
                  </td>
                  <td>
                    {contact.affiliate_code ? (
                      <span className="affiliate-code">{contact.affiliate_code}</span>
                    ) : (
                      <span className="no-affiliate">Direct Lead</span>
                    )}
                  </td>
                  <td>
                    {contact.affiliate ? contact.affiliate.full_name : '-'}
                  </td>
                  <td>
                    {contact.affiliate ? contact.affiliate.email : '-'}
                  </td>
                  <td>{format(new Date(contact.created_at), 'MMM dd, yyyy')}</td>
                  <td>
                    <Link to={`/contacts/${contact.id}`} className="btn-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
