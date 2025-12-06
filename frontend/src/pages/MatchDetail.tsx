import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchService,type Match } from '../services/matchService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id) {
      loadMatch();
    }
  }, [id]);

  const loadMatch = async () => {
    try {
      const data = await matchService.getMatch(id!);
      setMatch(data);
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await matchService.updateMatchStatus(id!, status);
      await loadMatch();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleSubmitReview = async () => {
    if (!match || !user) return;

    const revieweeId = match.order?.creatorId === user.id 
      ? match.offer?.delivererId 
      : match.order?.creatorId;

    if (!revieweeId) return;

    try {
      await reviewService.createReview({
        matchId: id!,
        revieweeId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setShowReview(false);
      await loadMatch();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!match) {
    return <div className="container mx-auto px-4 py-8">Match not found</div>;
  }

  const isOrderCreator = match.order?.creatorId === user?.id;
  const isDeliverer = match.offer?.delivererId === user?.id;
  const canUpdateStatus = isOrderCreator || isDeliverer;
  const canComplete = match.status === 'ACCEPTED' && canUpdateStatus;
  const canReview = match.status === 'COMPLETED' && canUpdateStatus;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:text-blue-800">
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Match Details</h1>
        <div className="mb-4">
          <span className={`px-3 py-1 rounded ${match.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : match.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {match.status}
          </span>
        </div>

        {match.order && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold mb-2">Order</h2>
            <p><span className="font-medium">Title:</span> {match.order.title}</p>
            <p><span className="font-medium">Description:</span> {match.order.description}</p>
            <p><span className="font-medium">Budget:</span> ${match.order.budget?.toFixed(2)}</p>
            {match.order.creator && (
              <p><span className="font-medium">Creator:</span> {match.order.creator.name}</p>
            )}
          </div>
        )}

        {match.offer && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h2 className="text-xl font-semibold mb-2">Delivery Offer</h2>
            <p><span className="font-medium">Departure:</span> {new Date(match.offer.departureTime).toLocaleString()}</p>
            <p><span className="font-medium">Return:</span> {new Date(match.offer.returnTime).toLocaleString()}</p>
            {match.offer.deliverer && (
              <p><span className="font-medium">Deliverer:</span> {match.offer.deliverer.name}</p>
            )}
          </div>
        )}

        {canUpdateStatus && match.status === 'PENDING' && (
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => handleStatusUpdate('ACCEPTED')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Accept Match
            </button>
            <button
              onClick={() => handleStatusUpdate('REJECTED')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject Match
            </button>
          </div>
        )}

        {canComplete && (
          <button
            onClick={() => handleStatusUpdate('COMPLETED')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
          >
            Mark as Completed
          </button>
        )}

        {canReview && !showReview && (
          <button
            onClick={() => setShowReview(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Leave Review
          </button>
        )}

        {showReview && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
            <div className="mb-2">
              <label className="block mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Comment (optional)</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmitReview}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Review
              </button>
              <button
                onClick={() => setShowReview(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        <Chat matchId={id!} />
      </div>
    </div>
  );
};

export default MatchDetail;

