import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReviewComponent = () => {
  const navigate = useNavigate();
  const productId = "67f02a6371af011145853dd2"; // 🔁 Replace with actual product ID

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=/reviews/${productId}`);
    }
  }, [navigate, productId]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${productId}`)
      .then((response) => setProduct(response.data))
      .catch(() => setError("❌ Failed to load product details."));
  }, [productId]);

  // Reviews fetch - disabled
  /*
  const fetchReviews = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/reviews/${productId}`)
      .then((response) => setReviews(response.data))
      .catch(() => setError("❌ Failed to load reviews."));
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/reviews/review",
        { productId, ...formData },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("✅ Review submitted successfully!");
      setFormData({ rating: 5, reviewText: "", certifiedBuyerName: "", location: "" });
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
      <h2 style={{ color: "#007bff", fontSize: "24px", fontWeight: "bold" }}>
        🌟 Welcome to <span style={{ color: "#ff4081" }}>Lord Glory</span> Reviews 🌟
      </h2>

      {product && (
        <div style={{ marginBottom: "15px" }}>
          <h2>{product.name}</h2>
        </div>
      )}

      {/* <h3>💬 Customer Reviews ({reviews.length})</h3>
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
      )} */}

      <form onSubmit={submitReview} style={{ marginTop: "20px" }}>
        <h3>📝 Share Your Experience</h3>

        <input
          type="text"
          name="certifiedBuyerName"
          placeholder="Your Name"
          value={formData.certifiedBuyerName}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
        />

        <textarea
          name="reviewText"
          placeholder="Write your review..."
          value={formData.reviewText}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", resize: "none", marginBottom: "10px" }}
        />

        <input
          type="text"
          name="location"
          placeholder="Your Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
        />

        {/* ⭐ Star rating input */}
        <h4 style={{ margin: "10px 0" }}>Your Rating</h4>
        <div style={{ fontSize: "24px", marginBottom: "15px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setFormData({ ...formData, rating: star })}
              style={{
                cursor: "pointer",
                color: star <= formData.rating ? "#FFD700" : "#ccc",
                transition: "color 0.3s",
                marginRight: "5px",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <button
          type="submit"
          style={{ width: "100%", padding: "12px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" }}
        >
          Submit Review 🚀
        </button>
      </form>
    </div>
  );
};

export default ReviewComponent;
