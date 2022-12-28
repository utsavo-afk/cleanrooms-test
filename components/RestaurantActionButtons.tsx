import { AuthUserContext, logAnalyticsEvent } from '@src/lib';
import React, { useContext } from 'react';

import { CallIcon } from './CallIcon';
import { DirectionsIcon } from './DirectionsIcon';
import Link from 'next/link';
import { MenuIcon } from './MenuIcon';

interface Props {
  menuURL: string;
  phoneNumber: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  restaurant_id: string | string[];
  restaurantName: string;
}
export const RestaurantActionButtons: React.FC<Props> = ({
  menuURL,
  phoneNumber,
  coordinates,
  restaurant_id,
  restaurantName,
}) => {
  const { user } = useContext(AuthUserContext);

  return (
    <div className="w-4/5  flex items-center justify-between font-ptsans p-2 ">
      <div className="w-fit  flex flex-col items-center space-y-2">
        <div className="flex flex-col justify-between items-center w-fit">
          <Link
            href={menuURL}
            target={'_blank'}
            onClick={() => {
              logAnalyticsEvent(
                'CTA_click',
                {
                  action_button: 'Menu',
                  menuURL,
                  restaurant_id,
                  restaurantName,
                },
                user?.uid
              );
            }}
          >
            <MenuIcon />
          </Link>
          <p className="mt-2">Menu</p>
        </div>
      </div>
      <div className="w-fit   flex flex-col items-center space-y-2">
        <div className=" flex flex-col justify-between items-center w-fit">
          <Link
            href={`tel:${phoneNumber}`}
            className="mt-0.5"
            target={'_blank'}
            onClick={() => {
              logAnalyticsEvent(
                'CTA_click',
                {
                  action_button: 'Call',
                  phoneNumber,
                  restaurant_id,
                  restaurantName,
                },
                user?.uid
              );
            }}
          >
            <CallIcon />
          </Link>
          <p className="mt-2">Call</p>
        </div>
      </div>
      <div className="w-fit  flex flex-col items-center space-y-2">
        <div className=" flex flex-col justify-between items-center w-fit">
          <Link
            href={`https://maps.google.com/?q=MY%20LOCATION@${coordinates.latitude},${coordinates.longitude}`}
            target={'_blank'}
            onClick={() => {
              logAnalyticsEvent(
                'CTA_click',
                {
                  action_button: 'Directions',
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                  restaurant_id,
                  restaurantName,
                },
                user?.uid
              );
            }}
          >
            <DirectionsIcon />
          </Link>
          <p className="mt-2">Directions</p>
        </div>
      </div>
    </div>
  );
};
