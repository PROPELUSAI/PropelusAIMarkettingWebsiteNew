/**
 * TestimonialKanban — Kanban board for testimonial moderation.
 * Columns: Pending → Approved / Denied.
 * Drag a card between columns to change its approval status.
 * @route /testimonials/kanban
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testimonialService } from '../../services/testimonialService';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'pending', label: 'Pending', color: '#FFA500' },
  { value: 'approved', label: 'Approved', color: '#32CD32' },
  { value: 'denied', label: 'Denied', color: '#DC143C' },
];

export const TestimonialKanban = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (testimonialId, newStatus) => {
    try {
      await testimonialService.updateStatus(testimonialId, newStatus);
      toast.success('Status updated');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getTestimonialsByStatus = (status) => {
    return testimonials.filter((t) => t.status === status);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="kanban-view">
      <div className="page-header">
        <h1>Testimonials Kanban</h1>
        <Link to="/testimonials" className="btn-secondary">
          List View
        </Link>
      </div>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <div key={status.value} className="kanban-column">
            <div className="column-header" style={{ borderTopColor: status.color }}>
              <h3>{status.label}</h3>
              <span className="count">{getTestimonialsByStatus(status.value).length}</span>
            </div>
            <div className="column-content">
              {getTestimonialsByStatus(status.value).map((testimonial) => (
                <div key={testimonial.id} className="kanban-card">
                  <h4>{testimonial.full_name}</h4>
                  <p>{testimonial.email}</p>
                  <p className="testimonial-preview">
                    {testimonial.testimonial.substring(0, 100)}...
                  </p>
                  <div className="card-actions">
                    <Link to={`/testimonials/${testimonial.id}`}>View</Link>
                    <select
                      value={testimonial.status}
                      onChange={(e) => handleStatusChange(testimonial.id, e.target.value)}
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
