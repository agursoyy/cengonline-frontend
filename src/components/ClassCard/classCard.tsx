import React, { FC } from 'react';

import './classCard.scss';

interface IProps {
  card: any;
  [x: string]: any;
}

const ClassCard: FC<IProps> = ({ card, ...props }) => {
  return (
    <div className="class">
      <h3>{card.title}</h3>
      <p>{card.term}</p>
      <p>
        {card.teacher.name} {card.teacher.surname}
      </p>
    </div>
  );
};

export default ClassCard;
