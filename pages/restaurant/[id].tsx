import { AuthGuard, RatingIcon } from '@src/components';
import { DocumentData, QueryDocumentSnapshot, collection, doc } from 'firebase/firestore';
import { orderBy, query } from 'firebase/firestore';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import Head from 'next/head';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import React from 'react';
import { RestaurantActionButtons } from '@src/components';
import { ReviewItem } from '@src/components';
import { db } from '@src/lib';
import { useRouter } from 'next/router';

interface ReviewProps {
  restaurantId: string;
  reviewRating: number;
  reviewText: string;
  userDisplayName: string;
}
const RestaurantDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, loading, error] = useDocument(doc(db, 'restaurant', String(id)));
  const reviewsRef = collection(doc(db, 'restaurant', String(id)), 'reviews');
  const [subData, subLoading, subError] = useCollection(query(reviewsRef, orderBy('createdAt', 'desc')));

  if (loading && subLoading) {
    return <p>Loading...</p>;
  }

  if (error && subError) {
    return <p>{JSON.stringify(error)}</p>;
  }
  const restaurant = data?.data();
  const reviews: ReviewProps[] | DocumentData[] | undefined = subData?.docs.map(
    (doc: QueryDocumentSnapshot<DocumentData>) => {
      return doc?.data();
    }
  );

  {
    return (
      id &&
      reviews &&
      restaurant && (
        <AuthGuard>
          <div className="flex flex-col space-y-2 w-screen h-[calc(100vh-64px)] items-center max-xs:space-y-2 bg-white landscape:h-[calc(100vw-64px)] overflow-y-scroll">
            <Head>
              <title>Restaurant Details Page</title>
            </Head>
            <div className="w-full flex flex-col items-center justify-start font-ptsans mt-2">
              <div className="w-full flex justify-center items-start py-2">
                <div className="w-4/5 flex space-x-2">
                  <div className="flex flex-col w-3/4  space-y-1 font-ptsans">
                    <h1 className="text-2xl max-xs:text-lg font-bold text-black capitalize">
                      {restaurant.restaurantName}
                    </h1>
                    <div className="flex space-x-1">
                      {restaurant.restaurantCleanRating == 0
                        ? null
                        : [...Array(restaurant.restaurantCleanRating)].map((_, i) => <RatingIcon key={i} />)}
                    </div>

                    <h1 className="text-base text-restaurant-primary font-normal  max-xs:text-md">
                      {'$ '.repeat(restaurant.restaurantCostRating)}
                    </h1>
                    <h1 className="text-base text-restaurant-secondary max-xs:text-md font-normal capitalize">
                      {restaurant.restaurantType}
                    </h1>
                    <h1 className="text-base text-restaurant-primary">{String(restaurant.restaurantAddress)}</h1>
                  </div>
                  <div className="flex flex-col w-1/3 space-y-4 items-center">
                    <div className="bg-red-500 w-24 ">
                      <QRCode
                        style={{ height: '100%', width: '100%' }}
                        value={`${restaurant.restaurantName} ${restaurant.restaurantQrCode}`}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                    <h1 className="text-restaurant-primary text-base font-bold text-left w-full landscape:text-center">{`${restaurant.restaurantQrCode}`}</h1>
                  </div>
                </div>
              </div>
              <div className="w-5/6 rounded h-[2.85px] bg-restaurant-light mt-2"></div>
              <div className="w-full  flex justify-center items-center py-2">
                <RestaurantActionButtons
                  menuURL={restaurant.restaurantMenuURL}
                  phoneNumber={restaurant.restaurantPhoneNo}
                  coordinates={restaurant.restaurantGeoCoords}
                  restaurant_id={id}
                  restaurantName={restaurant.restaurantName}
                />
              </div>
            </div>
            <div className="w-4/5 flex justify-between items-center py-1">
              <h1 className="text-xl  text-black font-bold font-ptsans max-xs:text-lg max-xxs:text-base">
                CleanRoom Review
              </h1>
              <Link href={`review/${id}`}>
                <button className="bg-restaurant-buttonbg rounded-md p-2 text-white text-base font-ptsans font-bold max-xs:text-sm max-xxs:text-xs">
                  Write a review
                </button>
              </Link>
            </div>
            <div className="w-5/6 flex flex-col space-y-1 ">
              <div className="w-full rounded h-[2.85px] bg-restaurant-light mt-2"></div>
              {reviews.length == 0 ? null : reviews.map((review, i) => <ReviewItem key={i} review={review} />)}
            </div>
          </div>
        </AuthGuard>
      )
    );
  }
};

export default RestaurantDetailsPage;
