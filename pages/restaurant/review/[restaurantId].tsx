import { AuthGuard, RatingIcon } from '@src/components';
import { AuthUserContext, db, logAnalyticsEvent } from '@src/lib';
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Timestamp, addDoc, collection, doc, getCountFromServer, updateDoc } from 'firebase/firestore';

import Head from 'next/head';
import toast from 'react-hot-toast';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

function ReviewPage() {
  const { user } = useContext(AuthUserContext);
  const router = useRouter();
  const { query } = router;
  const { restaurantId } = query;
  const [data, loading, error] = useDocument(doc(db, 'restaurant', String(restaurantId)));
  const restaurant = data?.data();
  //state to control the rating
  const [rating, setRating] = useState<number>(0);
  //state to control the review
  const [review, setReview] = useState<string>('');
  //state to control the rating dropdown
  const [show, setShow] = useState<boolean>(false);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    logAnalyticsEvent(
      'submit_review_form',
      {
        firebase_screen: 'Review Form Page',
        restaurant_id: restaurantId,
        reviewRating: rating,
        reviewText: review,
      },
      user?.uid
    );
    if (review.trim().length == 0) {
      toast.error('Review Required');
      return;
    } else if (rating == 0) {
      toast.error('Rating Required');
      return;
    } else if (!review.match(/^([a-zA-Z0-9\s.?']+)$/)) {
      toast.error('Special Characters Found');
      return;
    }
    const collectionRef = collection(doc(db, 'restaurant', String(restaurantId)), 'reviews');
    const documentRef = doc(db, 'restaurant', String(restaurantId));
    await addDoc(collectionRef, {
      restaurantId: restaurantId,
      reviewRating: rating,
      reviewText: review,
      userDisplayName: user?.displayName ? user.displayName : 'Anonymous',
      createdAt: Timestamp.now(),
    });
    const reviewsQuery = await getCountFromServer(collectionRef);
    const reviewsLength = reviewsQuery.data().count;
    const updatedTotal = restaurant?.restaurantTotalCleanRating + rating;
    const updatedRestaurantCleanRating = Math.ceil(updatedTotal / reviewsLength);
    await updateDoc(documentRef, {
      restaurantCleanRating: updatedRestaurantCleanRating,
      restaurantTotalCleanRating: updatedTotal,
    });
    router.back();
  };

  return (
    restaurantId &&
    restaurant && (
      <AuthGuard>
        <div
          className="w-screen flex justify-center font-ptsans bg-white overflow-auto h-[calc(100vh-64px)]"
          onClick={() => {
            setShow(false);
          }}
        >
          <Head>
            <title>Review Form Page</title>
          </Head>
          <form className="w-5/6 h-fit flex flex-col space-y-4 relative " onSubmit={submitReview}>
            <div className="w-full h-fit  mt-8 flex flex-col space-y-3">
              <h1 className="ml-2 text-restaurant-primary  text-base ">How was your experience ?</h1>
              <h1 className="ml-2 text-2xl text-black font-bold capitalize ">
                {restaurant?.restaurantName.length <= 6
                  ? String(restaurant?.restaurantName)
                  : `${String(restaurant?.restaurantName).slice(0, 6)}...`}
              </h1>
            </div>
            <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownDefaultRadio"
              className="text-gray-400 bg-gray-100  w-full h-14 focus:ring-4 focus:outline-none focus:ring-home-handleBg font-base  text-sm px-7 py-2.5 text-center inline-flex items-center  font-ptsans justify-between rounded-lg  max-xxs:text-xs"
              type="button"
              onClick={e => {
                e.stopPropagation();
                if (show == false) {
                  setShow(true);
                } else {
                  setShow(false);
                }
              }}
            >
              {rating == 0
                ? `
Select a rating for the restroom`
                : rating}
              {show ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-up ml-2 w-4 h-4"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                  />
                </svg>
              ) : (
                <svg
                  className="ml-2 w-4 h-4"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              )}
            </button>
            <div
              id="dropdownDefaultRadio"
              className={`z-10 w-full bg-white rounded-lg divide-y shadow  border border-home-bottom overflow-x-scroll overflow-y-hidden absolute top-48 ${
                show ? 'block' : 'hidden'
              }`}
            >
              <ul className="p-3 space-y-4 text-sm text-gray-700 dark:text-gray-200  w-full m-auto">
                <li>
                  <div
                    onClick={() => {
                      setRating(1);
                      setShow(!show);
                    }}
                    className="px-2 w-full h-8 text-home-handleBg flex items-center rounded-lg gap-2 mx-auto hover:bg-gray-400 bg-gray-100 cursor-pointer border border-home-bottom "
                  >
                    {<RatingIcon />}
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setRating(2);
                      setShow(!show);
                    }}
                    className="px-2 w-full h-8 text-home-handleBg flex items-center rounded-lg gap-2 mx-auto bg-gray-100  focus:ring-home-handleBg focus:ring-2 border border-home-bottom  hover:bg-gray-300"
                  >
                    {[...Array(2)].map((_, i) => (
                      <RatingIcon key={i} />
                    ))}
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setRating(3);
                      setShow(!show);
                    }}
                    className="px-2 w-full h-8 text-home-handleBg flex items-center rounded-lg gap-2 mx-auto bg-gray-100  focus:ring-home-handleBg focus:ring-2 border border-home-bottom  hover:bg-gray-300"
                  >
                    {[...Array(3)].map((_, i) => (
                      <RatingIcon key={i} />
                    ))}
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setRating(4);
                      setShow(!show);
                    }}
                    className="px-2 w-full h-8 text-home-handleBg flex items-center rounded-lg gap-2 mx-auto bg-gray-100  focus:ring-home-handleBg focus:ring-2 border border-home-bottom  hover:bg-gray-300"
                  >
                    {[...Array(4)].map((_, i) => (
                      <RatingIcon key={i} />
                    ))}
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      setRating(5);
                      setShow(!show);
                    }}
                    className="px-2 w-full h-8 text-home-handleBg flex items-center rounded-lg gap-2 mx-auto bg-gray-100  focus:ring-home-handleBg focus:ring-2 border border-home-bottom  hover:bg-gray-300"
                  >
                    {[...Array(5)].map((_, i) => (
                      <RatingIcon key={i} />
                    ))}
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full h-60 bg-gray-100 rounded-3xl flex items-center justify-center">
              <textarea
                className="w-5/6 h-full pt-3 bg-review-inputBg  outline-0 font-ptsans text-review-darkGrey text-base"
                placeholder="The restroom was..."
                value={review}
                maxLength={50}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setReview(e.target.value.trimStart());
                }}
              />
            </div>
            <button
              className={`bg-restaurant-buttonbg text-white w-full h-14 rounded-xl text-base font-inter font-bold`}
              onClick={submitReview}
            >
              Post review
            </button>
          </form>
        </div>
      </AuthGuard>
    )
  );
}

export default ReviewPage;
