import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeReview = () => {
  const [reviews, setReviews] = useState([]);
  const productId = "67f02a6371af011145853dd2"; // Static productId for now

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token"); // or whatever key you use
        const res = await axios.get(
          `http://localhost:5000/api/reviews/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched reviews:", res.data);
        setReviews(res.data.reviews || res.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px" }}>
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
            <p><strong>{review.certifiedBuyerName || "Anonymous"}</strong> ({review.location || "Unknown"})</p>
            <p>Rating: ⭐ {review.rating}</p>
            <p>{review.reviewText}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default HomeReview;
