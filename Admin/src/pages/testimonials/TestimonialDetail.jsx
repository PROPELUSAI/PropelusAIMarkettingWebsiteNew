/**
 * TestimonialDetail — View and manage a single testimonial.
 * Admins can approve, deny, or delete submissions.
 * Shows the full testimonial text, author info, company, and rating.
 * @route /testimonials/:id
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testimonialService } from '../../services/testimonialService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const TestimonialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonial();
  }, [id]);

  const loadTestimonial = async () => {
    try {
      const data = await testimonialService.getById(id);
      setTestimonial(data);
    } catch (error) {
      toast.error('Failed to load testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await testimonialService.approve(id);
      toast.success('Testimonial approved');
      navigate('/testimonials');
    } catch (error) {
      toast.error('Failed to approve testimonial');
    }
  };

  const handleDeny = async () => {
    try {
      await testimonialService.deny(id);
      toast.success('Testimonial denied');
      navigate('/testimonials');
    } catch (error) {
      toast.error('Failed to deny testimonial');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await testimonialService.delete(id);
      toast.success('Testimonial deleted');
      navigate('/testimonials');
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!testimonial) return <p>Testimonial not found</p>;

  return (
    <div className="testimonial-detail">
      <div className="page-header">
        <h1>Testimonial Details</h1>
        <button onClick={() => navigate('/testimonials')} className="btn-secondary">
          Back to List
        </button>
      </div>

      <div className="detail-card">
        <div className="info-row">
          <label>Full Name:</label>
          <span>{testimonial.full_name}</span>
        </div>
        <div className="info-row">
          <label>Email:</label>
          <span>{testimonial.email}</span>
        </div>
        <div className="info-row">
          <label>Status:</label>
          <span className={`badge badge-${testimonial.status}`}>{testimonial.status}</span>
        </div>
        <div className="info-row">
          <label>Created:</label>
          <span>{format(new Date(testimonial.created_at), 'PPpp')}</span>
        </div>
        <div className="info-row">
          <label>Updated:</label>
          <span>{format(new Date(testimonial.updated_at), 'PPpp')}</span>
        </div>
        <div className="testimonial-content">
          <label>Testimonial:</label>
          <p>{testimonial.testimonial}</p>
        </div>

        <div className="action-buttons">
          {testimonial.status === 'pending' && (
            <>
              <button onClick={handleApprove} className="btn-approve">
                Approve
              </button>
              <button onClick={handleDeny} className="btn-deny">
                Deny
              </button>
            </>
          )}
          <button onClick={handleDelete} className="btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
