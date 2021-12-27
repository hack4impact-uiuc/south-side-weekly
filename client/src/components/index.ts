// import ClaimPitchModal from './Modals/ClaimPitch';
import ResourceModal from './modal/ResourceControl';
import WizardListTitle from './Wizard/ListTitle';
import PageCounter from './Wizard/PageCounter';
import WizardSvg from './Wizard/Svg';
import { FieldTag } from './tags/FieldTag/FieldTag';
import UserPicture from './UserPicture';
import SubmitButton from './Wizard/SubmitButton';
import PrevButton from './Wizard/PrevButton';
import { PitchTable, PitchRow } from './Tables/PitchDoc';
import TableTool from './Tables/TableTool';
import Walkthrough from './Walkthrough';
import DynamicTable from './Tables/DynamicTable';
import { DynamicColumn, View } from './Tables/DynamicTable/types';
import {
  EditableTagModal,
  EditInterests,
  EditTeams,
} from './Modals/EditableTags';
import { ReviewUser } from './modal/ReviewUser';
import { buildColumn } from './Tables/DynamicTable/util';
import { buildPaginatedColumn } from './Tables/PaginatedTable/util';
import Kanban from './Kanban';
import UserFeedbackModal from './Modals/UserFeedback';
import ResourceTable from './Tables/Resource';
import PitchFeedbackModal from './Modals/PitchFeedback';

export { PrivateRoute } from './wrapper/PrivateRoute';

export {
  // ClaimPitchModal,
  ResourceModal,
  WizardListTitle,
  PageCounter,
  WizardSvg,
  FieldTag,
  UserPicture,
  SubmitButton,
  PrevButton,
  ResourceTable,
  PitchTable,
  PitchRow,
  TableTool,
  Walkthrough,
  EditInterests,
  EditTeams,
  EditableTagModal,
  ReviewUser,
  DynamicTable,
  buildColumn,
  PitchFeedbackModal,
  UserFeedbackModal,
  buildPaginatedColumn,
  Kanban,
};

export type { View, DynamicColumn };
