import { pick } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { IPitch, IUser } from 'ssw-common';

import { getAggregatedPitch, isError } from '../../../api';
import { BackButton, UserChip } from '../../../components';

import './styles.scss';
import { ParamTypes } from './types';

//interface ReviewClaimProps {}

type FormData = Pick<
  IPitch,
  | 'title'
  | 'assignmentGoogleDocLink'
  | 'description'
  | 'topics'
  | 'issues'
  | 'teams'
  | 'primaryEditor'
  | 'secondEditors'
  | 'thirdEditors'
  | 'writer'
>;

const defaultData: FormData = {
  title: '',
  assignmentGoogleDocLink: '',
  description: '',
  topics: [],
  teams: [],
  issues: [],
  writer: '',
  primaryEditor: '',
  secondEditors: [],
  thirdEditors: [],
};

const ReviewClaim = (): ReactElement => {
  const { pitchId } = useParams<ParamTypes>();
  const [author, setAuthor] = useState<Partial<IUser>>({});
  const [formData, setFormData] = useState<FormData>(defaultData);

  console.log(formData);

  useEffect(() => {
    const fetchAggregatedPitch = async (): Promise<void> => {
      const res = await getAggregatedPitch(pitchId);

      if (!isError(res)) {
        const { result } = res.data;
        const { author } = result.aggregated;
        setAuthor(author);

        setFormData(pick(result, Object.keys(defaultData)) as FormData);
      }
    };
    fetchAggregatedPitch();
  }, [pitchId]);

  return (
    <div className="review-claim-page">
      <BackButton title="Back to Unclaimed Pitches" linkTo="/pitches" />
      <div className="content">
        <div className="form-label-section">
          <span className="form-label row">Pitch Creator:</span>
          <UserChip user={author} />
        </div>

        <div className="form-label-section">
          <span className="form-label">Pitch Title</span>
          <Icon name="pencil" />
        </div>
        <p>{formData.title}</p>

        <div className="form-label-section">
          <span className="form-label">Google Doc Link</span>
          <Icon name="pencil" />
        </div>
        <p>{formData.assignmentGoogleDocLink}</p>

        <div className="form-label-section">
          <span className="form-label">Description</span>
          <Icon name="pencil" />
        </div>
        <p>{formData.description}</p>
      </div>
    </div>
  );
};

export default ReviewClaim;
