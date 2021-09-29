import { times } from 'lodash';
import React, { ReactElement, FC } from 'react';
import { Button } from 'semantic-ui-react';
import Swal from 'sweetalert2';

import { useWizard } from '../../../contexts';

import './styles.scss';

interface PageCounterProps {
  numberOfPages: number;
}

const PageCounter: FC<PageCounterProps> = ({ numberOfPages }): ReactElement => {
  const { currentPage, jumpTo, hasSubmitted } = useWizard();

  const handlePageJump = (page: number): void => {
    if (page === currentPage) {
      return;
    }

    if (!hasSubmitted(page)) {
      Swal.fire({
        title: "Can't travel to the future!",
        icon: 'error',
        text: 'Please complete the registration portal in order!',
      });
      return;
    } else if (!hasSubmitted(currentPage)) {
      Swal.fire({
        title: 'Be careful!',
        text: "You will lose the current page's information if you leave now!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: `Go to page ${page}`,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          jumpTo(page);
        }
      });
    } else if (hasSubmitted(currentPage) || hasSubmitted(page)) {
      jumpTo(page);
    }
  };

  return (
    <div className="page-counter">
      {times(numberOfPages, (index) => (
        <Button
          className={index === currentPage - 1 ? 'active' : ''}
          key={index}
          size="mini"
          circular
          icon="circle"
          onClick={() => handlePageJump(index + 1)}
        />
      ))}
    </div>
  );
};

export default PageCounter;
