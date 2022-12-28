import { BackArrowIcon } from './BackArrowIcon';
import React from 'react';
import { useRouter } from 'next/router';
interface Props {
  version?: number;
}
export const Header: React.FC<Props> = ({ version }) => {
  const router = useRouter();
  if (router.route == '/') {
    return null;
  }
  if (version == 1) {
    return (
      <div className="w-full h-16 bg-header-top flex justify-center items-center sticky top-0 z-10 " id="rotatable">
        <div className="w-full h-full flex  items-center justify-between">
          <div
            className="cursor-pointer ml-6 w-7 h-7"
            onClick={() => {
              router.back();
            }}
          >
            <BackArrowIcon />
          </div>
          <p className="text-xl font-normal  text-white font-paprika mr-6 leading-9">cleanr</p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-12  bg-header-top flex justify-end items-center fixed top-0 z-10 " id="rotatable">
      <p className="text-xl  font-normal text-white font-paprika mr-4 leading-9">cleanr</p>
    </div>
  );
};
