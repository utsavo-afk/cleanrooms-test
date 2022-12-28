import { convertDistance, getDistance } from 'geolib';

import { BidetIcon } from './BidetIcon';
import { DocumentData } from 'firebase/firestore';
import { FemaleHygeineIcon } from './FemaleHygeineIcon';
import { HandicapIcon } from './HandicapIcon';
import Link from 'next/link';
import { MotherRoomIcon } from './MotherRoomIcon';
import { RatingIcon } from './RatingIcon';
import React from 'react';
import { RestroomIcon } from './RestroomIcon';
import { TransGenIcon } from './TransGenIcon';
import { getDate } from '@src/lib';
import moment from 'moment';
import styles from './styles.module.css';

interface Props {
  restaurant:
    | {
        restaurantId: string;
        restaurantAddress: string;
        restaurantCleanRating: number;
        restaurantGeoCoords: { latitude: number; longitude: number };
        restaurantImageURL: string;
        restaurantLastCleanedAt: { seconds: number; nanoseconds: number };
        restaurantName: string;
        restaurantMenuURL: string;
        restaurantPhoneNo: number;
        restaurantQrCode: string;
        restaurantType: string;
        restaurantCostRating: number;
        restaurantUtilities: string[];
      }
    | DocumentData
    | undefined;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

export const RestaurantListItem: React.FC<Props> = ({ restaurant, currentLocation }) => {
  const { latitude, longitude } = restaurant?.restaurantGeoCoords;
  const distance = getDistance(currentLocation, { latitude, longitude });
  const formattedDistance = convertDistance(distance, 'mi').toFixed(2);
  const formattedTimeStamp = moment(
    getDate(restaurant?.restaurantLastCleanedAt.seconds, restaurant?.restaurantLastCleanedAt.nanoseconds)
  ).fromNow();
  return (
    <Link href={`restaurant/${restaurant?.restaurantId}`}>
      <div className="w-full h-fit grid grid-cols-10  gap-2 border border-b-4 border-gray-300 z-10 font-ptsans items-center p-2">
        <div className="col-span-3 w-full h-full flex justify-center items-center ">
          <div className="w-28 h-28">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={`${restaurant?.restaurantImageURL}`}
              className="w-full h-full  rounded-lg"
              alt="restaurant image"
            />
          </div>
        </div>
        <div className="col-span-5 w-full  h-full flex flex-col justify-center items-start ">
          <div className="flex flex-col space-y-1 items-start w-full h-full">
            <div
              className={` ${styles.restaurant_name} text-3xl max-md:text-2xl text-black font-bold font-ptsans capitalize  h-fit`}
            >
              {restaurant?.restaurantName}
            </div>
            <div className="text-restaurant-secondary text-xl max-md:text-base max-xs:text-xs capitalize w-full h-fit">
              {restaurant?.restaurantType}
            </div>
            <div className="flex space-x-1 items-center w-full h-fit">
              {restaurant?.restaurantCleanRating == 0
                ? null
                : [...Array(restaurant?.restaurantCleanRating)].map((_, i) => <RatingIcon key={i} />)}
            </div>
            {(formattedTimeStamp.includes('minute') ||
              formattedTimeStamp.includes('hour') ||
              formattedTimeStamp.includes('second')) && (
              <h1 className="text-home-gray max-md:text-base text-md italic w-full h-fit">
                {`Last cleaned ${''}
                ${moment(
                  getDate(restaurant?.restaurantLastCleanedAt.seconds, restaurant?.restaurantLastCleanedAt.nanoseconds)
                ).fromNow()}
                `}
              </h1>
            )}
            <div className="h-full w-full flex  items-center space-x-2">
              {restaurant?.restaurantUtilities.map((utility: string, index: number) => {
                switch (utility.toLowerCase().trim()) {
                  case 'baby changing area':
                    return <MotherRoomIcon key={index} />;
                  case 'gender neutral bathroom':
                    return <TransGenIcon key={index} />;
                  case 'bidet':
                    return <BidetIcon key={index} />;
                  case 'handicap':
                    return <HandicapIcon key={index} />;
                  case 'female hygiene':
                    return <FemaleHygeineIcon key={index} />;
                  case 'restroom':
                    return <RestroomIcon key={index} />;
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
        <div className={` ${styles.right_section} col-span-2 w-full h-full flex flex-col items-end `}>
          <div className="h-8 flex items-center justify-end">
            <h1 className="text-sm  font-normal italic ">{`${formattedDistance ? formattedDistance : null} miles`}</h1>
          </div>

          <div className={`${styles.restaurant_QR_code}`}>{restaurant?.restaurantQrCode}</div>
        </div>
      </div>
    </Link>
  );
};
