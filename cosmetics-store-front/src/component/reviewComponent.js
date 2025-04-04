import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReviewComponent = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: "",
    certifiedBuyerName: "",
    location: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch(() => setError("❌ Failed to load product details."));
  }, [productId]);

  const fetchReviews = useCallback(() => {
    if (!productId) return;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/reviews/${productId}`)
      .then((response) => setReviews(response.data))
      .catch(() => setError("❌ Failed to load reviews."));
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!productId) return alert("❌ Product ID is missing.");
    try {
      await axios.post(
        "${process.env.REACT_APP_API_URL}/api/reviews/review",
        { productId, ...formData },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("✅ Review submitted successfully!");
      setFormData({ rating: 5, reviewText: "", certifiedBuyerName: "", location: "" });
      fetchReviews();
    } catch {
      setError("❌ Failed to submit review.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    cssEase: "ease-in-out",
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", background: "#f8f9fa", padding: "20px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", textAlign: "center" }}>
      <h2 style={{ color: "#007bff", fontSize: "24px", fontWeight: "bold" }}>🌟 Welcome to <span style={{ color: "#ff4081" }}>Lord Glory</span> Reviews 🌟</h2>
      {product && (
        <div style={{ marginBottom: "15px" }}>
          <h2>{product.name}</h2>
          <img src={product.image} alt={product.name} style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }} />
        </div>
      )}
      <h3>💬 Customer Reviews ({reviews.length})</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reviews.length > 0 ? (
        <Slider {...sliderSettings}>
          {reviews.map((review) => (
            <div key={review._id} style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)", transition: "0.3s" }}>
              <h4>{review.certifiedBuyerName} from {review.location || "Unknown"}</h4>
              <p style={{ fontSize: "18px", color: "#FFD700" }}>⭐ {review.rating}/5</p>
              <p>{review.reviewText}</p>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No reviews yet. Be the first to review! 😊</p>
      )}
      <form onSubmit={submitReview} style={{ marginTop: "20px" }}>
        <h3>📝 Share Your Experience</h3>
        <input type="text" name="certifiedBuyerName" placeholder="Your Name" value={formData.certifiedBuyerName} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
        <textarea name="reviewText" placeholder="Write your review..." value={formData.reviewText} onChange={handleChange} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", resize: "none" }} />
        <input type="text" name="location" placeholder="Your Location" value={formData.location} onChange={handleChange} required style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}>Submit Review 🚀</button>
      </form>
    </div>
  );
};

export default ReviewComponent;
