/**
 * Dashboard Page
 *
 * Overview page with key statistics: total contacts, pending testimonials,
 * total affiliates. Fetches counts from each service on mount.
 */
import { useEffect, useState } from 'react';
import { contactService } from '../services/contactService';
import { testimonialService } from '../services/testimonialService';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    openLeads: 0,
    convertedLeads: 0,
    pendingTestimonials: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const contacts = await contactService.getAll();
      const testimonials = await testimonialService.getAll();

      setStats({
        totalContacts: contacts.length,
        openLeads: contacts.filter((c) => c.lead_status === 'open').length,
        convertedLeads: contacts.filter((c) => c.lead_status === 'converted').length,
        pendingTestimonials: testimonials.filter((t) => t.status === 'pending').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Contacts</h3>
          <p className="stat-value">{stats.totalContacts}</p>
        </div>
        <div className="stat-card">
          <h3>Open Leads</h3>
          <p className="stat-value">{stats.openLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Converted Leads</h3>
          <p className="stat-value">{stats.convertedLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Testimonials</h3>
          <p className="stat-value">{stats.pendingTestimonials}</p>
        </div>
      </div>
    </div>
  );
};
