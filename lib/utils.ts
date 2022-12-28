//date from firebase is represented as
import geohash from 'ngeohash';

export const getDate = (seconds: number, nanoseconds: number) => {
  return new Date(seconds * 1000 + nanoseconds / 1000000);
};

export const getGeoHashRange = (longitude: number, latitude: number, r = 10) => {
  const lat = 0.0144927536231884; // degrees latitude per mile
  const lon = 0.0181818181818182; // degrees longitude per mile

  const lowerLat = latitude - lat * r;
  const lowerLon = longitude - lon * r;

  const upperLat = latitude + lat * r;
  const upperLon = longitude + lon * r;

  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);

  return {
    lower,
    upper,
  };
};
