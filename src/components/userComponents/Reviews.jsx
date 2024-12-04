import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetReviewQuery } from "../../services/userApi";
import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
const Reviews = () => {
  const { product_id } = useParams();
  const { data } = useGetReviewQuery({ product_id: product_id });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (data?.review) {
      setReviews([...data.review]);
    }
  }, [data]);

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Reviews</h1>
      <div className="max-w-2xl mx-auto">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <div className="bg-gray-600 rounded-full p-2 mr-3">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{review.userName}</h3>
                 <Rating value={review.star} readOnly size="small" />
              </div>
            </div>
            <h4 className="text-gray-400 font-medium mb-1">{review.title}</h4>
            <p className="text-white mb-3">{review.comment}</p>
            <div className="flex space-x-3">
              <button className="flex items-center text-gray-400 hover:text-white">
                <ThumbsUp className="w-4 h-4 mr-1" />
              </button>
              <button className="flex items-center text-gray-400 hover:text-white">
                <ThumbsDown className="w-4 h-4 mr-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
