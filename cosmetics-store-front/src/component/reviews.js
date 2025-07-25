// import React from 'react';

// const ReviewComponent = ({ review }) => {
//   const { rating, reviewText, userId, createdAt } = review;

//   return (
//     <div className="review-card" style={styles.card}>
//       <h3 style={styles.userName}>{userId?.name || 'Anonymous'}</h3>
//       <p style={styles.rating}>⭐ {rating ? `${rating}/5` : 'No rating given'}</p>
//       <p style={styles.reviewText}>{reviewText || 'No review provided.'}</p>
//       <p style={styles.date}>Reviewed on: {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}</p>
//     </div>
//   );
// };

// const styles = {
//   card: {
//     border: '1px solid #ddd',
//     borderRadius: '10px',
//     padding: '15px',
//     marginBottom: '12px',
//     background: 'linear-gradient(135deg, #ffffff, #f3f4f6)',
//     boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
//     transition: 'transform 0.2s ease-in-out',
//   },
//   userName: {
//     fontSize: '1.2em',
//     fontWeight: 'bold',
//     color: '#2c3e50',
//   },
//   rating: {
//     color: '#f39c12',
//     fontWeight: 'bold',
//     margin: '5px 0',
//   },
//   reviewText: {
//     fontSize: '1em',
//     margin: '10px 0',
//     color: '#333',
//     lineHeight: '1.5',
//   },
//   date: {
//     fontSize: '0.85em',
//     color: '#777',
//     fontStyle: 'italic',
//   },
// };

// export default ReviewComponent;
