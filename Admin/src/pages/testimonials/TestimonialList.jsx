/**
 * TestimonialList — Paginated table of customer testimonials.
 * Supports search, status filtering (pending/approved/denied),
 * and links to TestimonialDetail for review and approval.
 * @route /testimonials
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { testimonialService } from '../../services/testimonialService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  useEffect(() => {
    loadTestimonials();
  }, [filters]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll(filters);
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await testimonialService.approve(id);
      toast.success('Testimonial approved');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to approve testimonial');
    }
  };

  const handleDeny = async (id) => {
    try {
      await testimonialService.deny(id);
      toast.success('Testimonial denied');
      loadTestimonials();
    } catch (error) {
      toast.error('Failed to deny testimonial');
    }
  };

  return (
    <div className="testimonial-list">
      <div className="page-header">
        <h1>Testimonials</h1>
        <Link to="/testimonials/kanban" className="btn-secondary">
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
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
                <th>Testimonial</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td>{testimonial.full_name}</td>
                  <td>{testimonial.email}</td>
                  <td className="testimonial-text">
                    {testimonial.testimonial.substring(0, 100)}...
                  </td>
                  <td>
                    <span className={`badge badge-${testimonial.status}`}>
                      {testimonial.status}
                    </span>
                  </td>
                  <td>{format(new Date(testimonial.created_at), 'MMM dd, yyyy')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/testimonials/${testimonial.id}`} className="btn-link">
                        View
                      </Link>
                      {testimonial.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(testimonial.id)}
                            className="btn-approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(testimonial.id)}
                            className="btn-deny"
                          >
                            Deny
                          </button>
                        </>
                      )}
                    </div>
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
