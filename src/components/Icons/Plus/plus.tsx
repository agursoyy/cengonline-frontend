import React, { FC } from 'react';

interface IProps {
  [x: string]: any;
}

const Plus: FC<IProps> = ({ ...props }) => {
  return (
    <svg
      {...props}
      className="icon icon-tabler icon-tabler-plus"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
};

export default Plus;
