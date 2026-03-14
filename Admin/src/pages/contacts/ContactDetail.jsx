/**
 * ContactDetail — View and edit a single contact submission.
 * Uses react-hook-form for inline editing of status, priority,
 * internal notes, and admin tags. Supports delete with confirmation.
 * @route /contacts/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contactService';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      const data = await contactService.getById(id);
      setContact(data);
      reset(data);
    } catch (error) {
      toast.error('Failed to load contact');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Only send the editable lead management fields
      const updateData = {
        lead_status: data.lead_status,
        priority: data.priority,
        assigned_to: data.assigned_to,
        admin_notes: data.admin_notes,
        response_sent: data.response_sent,
      };
      await contactService.update(id, updateData);
      toast.success('Contact updated successfully');
      navigate('/contacts');
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!contact) return <p>Contact not found</p>;

  return (
    <div className="contact-detail">
      <div className="page-header">
        <h1>Contact Details</h1>
        <button onClick={() => navigate('/contacts')} className="btn-secondary">
          Back to List
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-section">
          <h2>Contact Information</h2>
          <div className="info-row">
            <label>Full Name:</label>
            <span>{contact.full_name}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{contact.email}</span>
          </div>
          <div className="info-row">
            <label>Company:</label>
            <span>{contact.company_name || 'N/A'}</span>
          </div>
          <div className="info-row">
            <label>Country:</label>
            <span>{contact.country}</span>
          </div>
          <div className="info-row">
            <label>Scheduled Time:</label>
            <span>{format(new Date(contact.scheduled_time), 'PPpp')}</span>
          </div>
          <div className="info-row">
            <label>Description:</label>
            <p>{contact.description || 'N/A'}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2>Affiliate Attribution</h2>
          {contact.affiliate_code ? (
            <>
              <div className="info-row">
                <label>Promo Code:</label>
                <span className="affiliate-code">{contact.affiliate_code}</span>
              </div>
              {contact.affiliate ? (
                <>
                  <div className="info-row">
                    <label>Affiliate Name:</label>
                    <span>{contact.affiliate.full_name}</span>
                  </div>
                  <div className="info-row">
                    <label>Affiliate Email:</label>
                    <span>{contact.affiliate.email}</span>
                  </div>
                  <div className="info-row">
                    <label>Affiliate Mobile:</label>
                    <span>{contact.affiliate.mobile_number || 'N/A'}</span>
                  </div>
                </>
              ) : (
                <div className="info-row">
                  <label>Status:</label>
                  <span className="no-affiliate">Affiliate code found but affiliate details not available</span>
                </div>
              )}
            </>
          ) : (
            <div className="info-row">
              <label>Attribution:</label>
              <span className="no-affiliate">No Affiliate / Direct Lead</span>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h2>Lead Management</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Lead Status</label>
              <select {...register('lead_status')}>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
                <option value="lost">Lost</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select {...register('priority')}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <input type="text" {...register('assigned_to')} />
            </div>
            <div className="form-group">
              <label>Admin Notes</label>
              <textarea {...register('admin_notes')} rows="4" />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" {...register('response_sent')} />
                Response Sent
              </label>
            </div>
            <button type="submit" className="btn-primary">
              Update Contact
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
