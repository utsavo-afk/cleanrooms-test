import 'mapbox-gl/dist/mapbox-gl.css';

import { AuthGuard, MarkerIcon, RatingIcon, RestaurantListItem } from '@src/components';
import React, { useRef } from 'react';
import { getGeoHashRange, restaurantsRef } from '@src/lib';
import { query, where } from 'firebase/firestore';

import { DocumentData } from 'firebase/firestore';
import Draggable from 'react-draggable';
import Head from 'next/head';
import Link from 'next/link';
import MapComp from '@src/components/Map';
import { Marker } from 'react-map-gl';
import { useCollection } from 'react-firebase-hooks/firestore';

interface RestaurantProps {
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
  restaurantCostRating: number;
  restaurantType: string;
  restaurantUtilities: string[];
  restaurantGeohash: string;
}
const HomePage = ({ coords }: { coords: { longitude: number; latitude: number } }) => {
  const { longitude, latitude } = coords;
  const nodeRef = useRef(null);
  // const [mapBlur, setMapBlur] = useState<boolean>(false);
  const range = getGeoHashRange(longitude, latitude);

  // useEffect(() => {
  //   setViewState({ longitude: longitude, latitude: latitude, zoom: 12 });
  // }, [latitude, longitude]);

  const [data, loading, error] = useCollection(
    query(restaurantsRef, where('restaurantGeohash', '<=', range.upper), where('restaurantGeohash', '>=', range.lower))
  );

  const restaurants: RestaurantProps[] | DocumentData[] | undefined = data?.docs.map(document => {
    return { ...document.data(), restaurantId: document.id };
  });
  // state to control the viewport of map
  // const [viewState, setViewState] = useState({
  //   longitude: longitude,
  //   latitude: latitude,
  //   zoom: 12,
  // });
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }
  if (!data) {
    return <p>No restaurant nearby</p>;
  }
  // incase user has not enabled location API
  return (
    restaurants &&
    longitude &&
    latitude && (
      <AuthGuard>
        <div className="h-screen  w-screen grid grid-rows-3 relative overflow-hidden">
          <Head>
            <title>Restaurant List Page</title>
            <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.0/mapbox-gl.css" rel="stylesheet" />
          </Head>

          <div className={`h-full w-screen  row-span-2 `}>
            <MapComp longitude={longitude} latitude={latitude}>
              {restaurants.map(restaurant => (
                <div key={restaurant.restaurantId}>
                  <Link href={`restaurant/${restaurant.restaurantId}`}>
                    <Marker
                      latitude={restaurant.restaurantGeoCoords?.latitude}
                      longitude={restaurant.restaurantGeoCoords?.longitude}
                      anchor="center"
                    >
                      <MarkerIcon />
                      <div className="w-[148px] bg-white shadow-xl h-14 rounded-2xl flex justify-center items-center">
                        <div className="w-[146px] h-13  flex space-x-1 items-center px-2">
                          <div className="flex flex-col  font-ptsans items-start space-y-1 h-12 w-[72px]">
                            <div className="flex justify-start items-center  w-full h-[22px]">
                              <p className="text-black  capitalize text-[12px] font-bold w-full  tracking-normal h-[22px]">
                                {restaurant.restaurantName.length <= 7
                                  ? String(restaurant.restaurantName)
                                  : `${String(restaurant.restaurantName).slice(0, 5)}..`}
                              </p>
                            </div>
                            <div className="flex justify-start w-full items-start  h-[18px]">
                              {restaurant.restaurantCleanRating == 0
                                ? null
                                : [...Array(restaurant.restaurantCleanRating)].map((_, i) => <RatingIcon key={i} />)}
                            </div>
                          </div>
                          <div className="flex flex-col font-ptsans items-start space-y-1 h-12  w-[72px]">
                            <div className="flex justify-start items-center h-5 w-full">
                              <p className="text-restaurant-secondary capitalize  text-[12px] w-full">
                                {restaurant.restaurantType}
                              </p>
                            </div>
                            <div className="flex justify-start items-baseline h-6 w-full">
                              <p className="text-home-gray  text-[12px] w-full">
                                {restaurant.restaurantQrCode.length <= 11
                                  ? String(restaurant.restaurantQrCode)
                                  : `${String(restaurant.restaurantQrCode).slice(0, 9)}..`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Marker>
                  </Link>
                </div>
              ))}
            </MapComp>
          </div>
          <Draggable
            // onStart={() => {
            //   setMapBlur(true);
            // }}
            // onStop={() => {
            //   setMapBlur(false);
            // }}
            nodeRef={nodeRef}
            handle="#tabHandle"
            axis="y"
            bounds={{
              left: 0,
              right: 0,
              top: -screen.height + screen.height * 0.34,
              bottom: -1,
            }}
          >
            <div
              className={`w-full h-screen z-10 row-span-3 cursor-move  ease-in-out`}
              ref={nodeRef}
              id={'bottomContent'}
            >
              <div className="w-full h-full overflow-y-scroll bg-white">
                <div className={`bg-home-bottom h-9 sticky top-0 flex justify-center items-center`} id="tabHandle">
                  <div className="h-1 w-10 max-md:w-16  shadow-black shadow-md bg-home-handle rounded-3xl cursor-pointer "></div>
                </div>
                {restaurants.map(restaurant => (
                  <RestaurantListItem
                    restaurant={restaurant}
                    key={restaurant.restaurantId}
                    currentLocation={{ latitude, longitude }}
                  />
                ))}
                <div className="w-full flex items-center grow my-2 max-xs:my-0 ">
                  <p className="mt-2 w-full  text-home-gray text-center text-lg max-xs:text-xs max-md:text-sm font-thin font-ptsans py-2 max-xs:py-1">
                    No More Restaurants Near You
                  </p>
                </div>
              </div>
            </div>
          </Draggable>
        </div>
      </AuthGuard>
    )
  );
};

export default HomePage;
