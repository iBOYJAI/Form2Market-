import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logisticsAPI } from '../services/api';
import TruckIcon from '../assets/images/Notion-Resources/Notion-Icons/Accent-Color/svg/ni-truck-location.svg';

const PostTransportJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pickup_location: '',
        dropoff_location: '',
        goods_type: '',
        quantity: '',
        vehicle_type_needed: 'Truck',
        price_offer: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await logisticsAPI.createJob(formData);
            alert('Job Posted Successfully! Transporters will be notified.');
            navigate(-1); // Go back
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Failed to post job');
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <img src={TruckIcon} alt="Truck" style={{ width: '40px', height: '40px' }} />
                    <h1 style={{ color: '#1e293b', margin: 0 }}>Request Transport</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div className="form-group">
                        <label>Pickup Location</label>
                        <input type="text" name="pickup_location" required value={formData.pickup_location} onChange={handleChange} className="form-input" placeholder="e.g. Farm Location" />
                    </div>

                    <div className="form-group">
                        <label>Dropoff Location</label>
                        <input type="text" name="dropoff_location" required value={formData.dropoff_location} onChange={handleChange} className="form-input" placeholder="e.g. Market Warehouse" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Goods Type</label>
                            <input type="text" name="goods_type" required value={formData.goods_type} onChange={handleChange} className="form-input" placeholder="e.g. Tomatoes" />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input type="text" name="quantity" required value={formData.quantity} onChange={handleChange} className="form-input" placeholder="e.g. 500kg" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Vehicle Needed</label>
                            <select name="vehicle_type_needed" value={formData.vehicle_type_needed} onChange={handleChange} className="form-input">
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Auto">Auto</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Offer Price (₹)</label>
                            <input type="number" name="price_offer" required value={formData.price_offer} onChange={handleChange} className="form-input" placeholder="e.g. 2000" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Additional Details</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3"></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
                        Post Job request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostTransportJob;
