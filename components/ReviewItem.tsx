import { DocumentData } from 'firebase/firestore';
import React from 'react';
import { RatingIcon } from './RatingIcon';
interface Props {
  review:
    | {
        restaurantId: unknown;
        reviewRating: number;
        reviewText: string;
        userDisplayName: string;
      }
    | DocumentData;
}
export const ReviewItem: React.FC<Props> = ({ review }) => {
  return (
    <div className="w-full  flex flex-col items-start border-b-2 border-restaurant-light space-y-2 p-2 font-ptsans">
      <h1 className="text-restaurant-secondary">{review.userDisplayName}</h1>
      <div className="flex space-x-1">
        {[...Array(review.reviewRating)].map((_, i) => (
          <RatingIcon key={i} />
        ))}
      </div>
      <p className="text-sm text-review-light">{review.reviewText}</p>
    </div>
  );
};
